#!/usr/bin/env node
/**
 * 深圳中考信息自动更新检查器
 * 
 * 功能：定时抓取招考办、教育局等官方网站，检测新发布的中考相关通知
 * 检测到新通知时，发送邮件提醒并记录到日志
 * 
 * 用法：
 *   node update_checker.js           # 单次运行检查
 *   node update_checker.js --daemon   # 后台持续运行（每6小时检查一次）
 *   node update_checker.js --test     # 测试模式（检查但不发邮件）
 * 
 * 依赖：无外部依赖，使用 Node.js 内置模块
 */

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 部分政府网站HTTPS证书链不完整，需要忽略证书验证
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

// ==================== 配置 ====================
const CONFIG = {
  // 检查间隔（毫秒）：6小时
  checkInterval: 6 * 60 * 60 * 1000,
  
  // 中考关键时间窗口（月份），这些月份增加检查频率
  hotMonths: [3, 4, 5, 6, 7, 8],
  // 热门月份检查间隔：2小时
  hotCheckInterval: 2 * 60 * 60 * 1000,
  
  // 邮件配置
  email: {
    smtp: 'smtp.qq.com',
    port: 465,
    from: 'YOUR_EMAIL@example.com',
    authCode: 'YOUR_SMTP_AUTH_CODE',
    to: ['YOUR_NOTIFY_EMAIL@example.com'],
    subject: '🎓 深圳中考信息更新提醒'
  },
  
  // 监控的网页列表
  sources: [
    {
      name: '招考办 · 中考信息公告',
      url: 'https://szeb.sz.gov.cn/szzkw/zkgg/zkxx/index.html',
      keywords: ['中考', '录取', '分数线', '自主招生', '志愿', '报名', '招生计划'],
      priority: 'high'
    },
    {
      name: '深圳市教育局 · 通知公告',
      url: 'https://szeb.sz.gov.cn/xxgk/flzy/tzgg/index.html',
      keywords: ['中考', '高中', '招生', '自主招生'],
      priority: 'high'
    },
    {
      name: '中考中招管理系统',
      url: 'https://www.szzk.edu.cn/',
      keywords: ['报名', '志愿', '成绩', '录取', '查询'],
      priority: 'high'
    },
    {
      name: '本地宝 · 中考专题',
      url: 'https://sz.bendibao.com/edu/zhuantizhongkao/',
      keywords: ['分数线', '录取', '排名', '2026'],
      priority: 'medium'
    }
  ],
  
  // 状态文件路径
  stateFile: path.join(__dirname, '.update_checker_state.json'),
  logFile: path.join(__dirname, '.update_checker.log')
};

// ==================== 工具函数 ====================

function log(msg) {
  const ts = new Date().toISOString().replace('T', ' ').slice(0, 19);
  const line = `[${ts}] ${msg}`;
  console.log(line);
  try {
    fs.appendFileSync(CONFIG.logFile, line + '\n');
  } catch(e) {}
}

function loadState() {
  try {
    return JSON.parse(fs.readFileSync(CONFIG.stateFile, 'utf-8'));
  } catch(e) {
    return { lastCheck: null, knownHashes: {}, alerts: [] };
  }
}

function saveState(state) {
  fs.writeFileSync(CONFIG.stateFile, JSON.stringify(state, null, 2));
}

// 简单的内容哈希
function simpleHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash.toString(16);
}

// HTTPS/HTTP 请求（内置 curl 后备方案）
function fetchPage(url, timeout = 15000) {
  return new Promise((resolve, reject) => {
    const mod = url.startsWith('https') ? https : http;
    const req = mod.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        'Accept': 'text/html,application/xhtml+xml',
        'Accept-Language': 'zh-CN,zh;q=0.9'
      },
      timeout: timeout
    }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        fetchPage(res.headers.location, timeout).then(resolve).catch(reject);
        return;
      }
      let data = '';
      res.setEncoding('utf-8');
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    });
    req.on('error', (err) => {
      // Node.js HTTPS 遇到 EPROTO 等协议错误时，回退到 curl
      log(`  ⚠️ Node.js 请求失败(${err.code || err.message})，尝试 curl 后备...`);
      fetchWithCurl(url, timeout).then(resolve).catch(reject);
    });
    req.on('timeout', () => { req.destroy(); reject(new Error('Timeout')); });
  });
}

// curl 后备方案（兼容部分政府网站的特殊SSL配置）
function fetchWithCurl(url, timeout = 15000) {
  return new Promise((resolve, reject) => {
    try {
      const timeoutSec = Math.ceil(timeout / 1000);
      const result = execSync(
        `curl -sL -k --max-time ${timeoutSec} -H "User-Agent: Mozilla/5.0" "${url}"`,
        { encoding: 'utf-8', maxBuffer: 5 * 1024 * 1024 }
      );
      resolve(result);
    } catch(e) {
      reject(new Error(`curl 也失败: ${e.message}`));
    }
  });
}

// 从HTML中提取纯文本标题和链接
function extractTitles(html) {
  const titles = [];
  // 匹配 <a> 标签中的标题文本
  const linkRegex = /<a[^>]*href="([^"]*)"[^>]*>([^<]*)<\/a>/gi;
  let match;
  while ((match = linkRegex.exec(html)) !== null) {
    const href = match[1];
    const text = match[2].trim();
    if (text.length > 4 && text.length < 100) {
      titles.push({ text, href });
    }
  }
  // 匹配 <li> 中的文本
  const liRegex = /<li[^>]*>([^<]{5,80})<\/li>/gi;
  while ((match = liRegex.exec(html)) !== null) {
    titles.push({ text: match[1].trim(), href: '' });
  }
  return titles;
}

// 检查标题是否包含中考相关关键词
function isRelevant(text, keywords) {
  const lower = text.toLowerCase();
  return keywords.some(kw => lower.includes(kw));
}

// ==================== 核心检查逻辑 ====================

async function checkSource(source, state) {
  try {
    log(`正在检查: ${source.name} (${source.url})`);
    const html = await fetchPage(source.url);
    
    // 计算页面内容哈希
    const contentHash = simpleHash(html);
    const prevHash = state.knownHashes[source.url];
    
    if (prevHash === contentHash) {
      log(`  ✅ 无变化`);
      return null;
    }
    
    log(`  🔔 检测到内容变化！(hash: ${prevHash} → ${contentHash})`);
    
    // 提取标题
    const titles = extractTitles(html);
    const relevantTitles = titles.filter(t => isRelevant(t.text, source.keywords));
    
    // 更新哈希
    state.knownHashes[source.url] = contentHash;
    
    if (relevantTitles.length > 0) {
      return {
        source: source.name,
        url: source.url,
        priority: source.priority,
        newTitles: relevantTitles.slice(0, 10), // 最多10条
        timestamp: new Date().toISOString()
      };
    } else {
      log(`  ⚠️ 页面有变化但未检测到新的中考相关标题`);
      return null;
    }
    
  } catch(e) {
    log(`  ❌ 检查失败: ${e.message}`);
    return null;
  }
}

async function runCheck(testMode = false) {
  log('========== 开始检查 ==========');
  const state = loadState();
  const results = [];
  
  for (const source of CONFIG.sources) {
    const result = await checkSource(source, state);
    if (result) results.push(result);
  }
  
  state.lastCheck = new Date().toISOString();
  
  if (results.length > 0) {
    log(`\n📢 发现 ${results.length} 个网站有更新！`);
    
    // 构建提醒内容
    let alertBody = `深圳中考信息更新检测报告\n检查时间: ${state.lastCheck}\n\n`;
    
    for (const r of results) {
      alertBody += `━━━━━━━━━━━━━━━━━━━━\n`;
      alertBody += `📌 ${r.source}\n`;
      alertBody += `🔗 ${r.url}\n`;
      alertBody += `⭐ 优先级: ${r.priority}\n`;
      alertBody += `📝 发现的中考相关标题:\n`;
      for (const t of r.newTitles) {
        alertBody += `   • ${t.text}\n`;
        if (t.href) alertBody += `     ${t.href}\n`;
      }
      alertBody += '\n';
    }
    
    alertBody += `\n💡 建议操作:\n`;
    alertBody += `1. 访问上述网站查看具体内容\n`;
    alertBody += `2. 如有新的分数线/政策，更新 data.js 数据\n`;
    alertBody += `3. 更新 dataUpdateStatus 中的版本号和日期\n`;
    
    log(alertBody);
    
    // 记录到state
    state.alerts.push({
      timestamp: state.lastCheck,
      sources: results.map(r => r.source),
      count: results.reduce((sum, r) => sum + r.newTitles.length, 0)
    });
    // 只保留最近50条
    if (state.alerts.length > 50) state.alerts = state.alerts.slice(-50);
    
    // 发送邮件提醒
    if (!testMode) {
      try {
        sendEmailAlert(alertBody);
      } catch(e) {
        log(`邮件发送失败: ${e.message}`);
      }
    } else {
      log('（测试模式，跳过邮件发送）');
    }
  } else {
    log('✅ 所有网站无新的中考相关更新');
  }
  
  saveState(state);
  log('========== 检查完毕 ==========\n');
  return results;
}

// ==================== 邮件发送（通过Python调用） ====================

function sendEmailAlert(body) {
  const pyScript = `
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import sys

msg = MIMEMultipart()
msg['From'] = '${CONFIG.email.from}'
msg['To'] = '${CONFIG.email.to.join(",")}'
msg['Subject'] = '${CONFIG.email.subject} - ' + sys.argv[1] if len(sys.argv) > 1 else '${CONFIG.email.subject}'

body = open('${path.join(__dirname, '.email_body.tmp')}', 'r', encoding='utf-8').read()
msg.attach(MIMEText(body, 'plain', 'utf-8'))

server = smtplib.SMTP_SSL('${CONFIG.email.smtp}', ${CONFIG.email.port})
server.login('${CONFIG.email.from}', '${CONFIG.email.authCode}')
server.sendmail('${CONFIG.email.from}', ${JSON.stringify(CONFIG.email.to)}, msg.as_string())
server.quit()
print('Email sent successfully')
`;

  // 写入临时文件
  const tmpBody = path.join(__dirname, '.email_body.tmp');
  const tmpPy = path.join(__dirname, '.send_alert.py');
  
  fs.writeFileSync(tmpBody, body, 'utf-8');
  fs.writeFileSync(tmpPy, pyScript, 'utf-8');
  
  try {
    const dateStr = new Date().toISOString().slice(0, 10);
    execSync(`python3 "${tmpPy}" "${dateStr}"`, { timeout: 30000 });
    log('📧 邮件提醒已发送');
  } catch(e) {
    log(`📧 邮件发送失败: ${e.message}`);
  } finally {
    // 清理临时文件
    try { fs.unlinkSync(tmpBody); } catch(e) {}
    try { fs.unlinkSync(tmpPy); } catch(e) {}
  }
}

// ==================== 主入口 ====================

async function main() {
  const args = process.argv.slice(2);
  const isDaemon = args.includes('--daemon');
  const isTest = args.includes('--test');
  
  log('🎓 深圳中考信息更新检查器启动');
  log(`模式: ${isDaemon ? '后台守护' : '单次运行'}${isTest ? ' (测试)' : ''}`);
  
  if (isDaemon) {
    // 后台持续运行
    log('进入守护模式，按 Ctrl+C 退出');
    
    const check = async () => {
      await runCheck(isTest);
      
      // 根据月份决定下次检查间隔
      const month = new Date().getMonth() + 1;
      const interval = CONFIG.hotMonths.includes(month) 
        ? CONFIG.hotCheckInterval 
        : CONFIG.checkInterval;
      const hours = (interval / 3600000).toFixed(1);
      log(`下次检查: ${hours}小时后 (${CONFIG.hotMonths.includes(month) ? '中考季加速' : '常规'})`);
      
      setTimeout(check, interval);
    };
    
    await check();
  } else {
    // 单次运行
    await runCheck(isTest);
    process.exit(0);
  }
}

main().catch(e => {
  log(`致命错误: ${e.message}`);
  process.exit(1);
});
