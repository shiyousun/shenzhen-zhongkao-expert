/**
 * 深圳中考专家系统 · 核心应用逻辑
 * Venus LLM 对话引擎 + JSXGraph 几何 + 搜索引擎 + 设置
 */

// ============================
// 配置
// ============================
const CONFIG = {
    apiUrl: 'http://v2.open.venus.oa.com/llmproxy/v1/chat/completions',
    apiToken: 'YOUR_VENUS_API_TOKEN',
    model: 'claude-opus-4-6',
    imageModel: 'gemini-3.1-flash-image',
    temperature: 0.3,
    maxTokens: 8192,
    ragPath: '/Users/friendsun/Documents/乐天/c初三',
};

const SYSTEM_PROMPT = `你是"深圳中考全科AI教师"，一位经验丰富、知识渊博的教育专家。你精通初中七大学科：语文、数学、英语、物理、化学、道德与法治、历史。

## 你的核心能力

### 1. 解题与讲解
- 提供清晰的解题步骤，每一步都有详细说明
- 数学公式使用 LaTeX 格式：行内用 $...$，独立公式用 $$...$$
- 重要概念用**加粗**标注
- 适当使用表格、列表组织信息

### 2. 几何图形
- 当涉及几何问题时，主动提供图形描述
- 标注关键点、线段、角度
- 说明辅助线的添加思路

### 3. 知识体系
- 基于深圳中考考纲和教材大纲回答
- 引用本地知识库中的精准资料
- 联系知识点之间的关联

### 4. 考试策略
- 提供针对深圳中考的备考建议
- 分析题型特点和解题技巧
- 给出时间分配和答题策略

## 回答风格
- 用词准确，逻辑清晰
- 循序渐进，由浅入深
- 适当鼓励学生，保持积极正面
- 如遇不确定的信息，诚实说明

## 特殊格式
- 数学公式：$E = mc^2$（行内）或 $$\\sum_{i=1}^{n} i = \\frac{n(n+1)}{2}$$（块级）
- 代码块：使用 \`\`\` 包裹
- 重点：使用 **加粗** 或 > 引用
`;

// ============================
// 全局状态
// ============================
let geometryBoard = null;

// ============================
// 多模型池（并发时轮换使用）
// ============================
const MODEL_POOL = [
    { id: 'claude-opus-4-6', name: 'Claude Opus 4.6', label: '🟣 Opus' },
    { id: 'claude-sonnet-4-6', name: 'Claude Sonnet 4.6', label: '🔵 Sonnet' },
    { id: 'gpt-5.4', name: 'GPT 5.4', label: '🟢 GPT' },
    { id: 'gemini-3.1-pro', name: 'Gemini 3.1 Pro', label: '🟡 Gemini' },
];

// 每个会话的运行时状态（不持久化）
// sessionId -> { controller, isStreaming, streamingMsgDiv, fullContent, assignedModel }
const sessionRuntime = {};

function getSessionRuntime(sessionId) {
    if (!sessionRuntime[sessionId]) {
        sessionRuntime[sessionId] = {
            controller: null,
            isStreaming: false,
            streamingMsgDiv: null,
            fullContent: '',
            assignedModel: null,
        };
    }
    return sessionRuntime[sessionId];
}

// 为会话分配模型：优先 opus，如果被占用则轮换
function assignModelForSession(sessionId) {
    // 找出当前正在流式中的其他会话使用的模型
    const usedModels = new Set();
    for (const [sid, rt] of Object.entries(sessionRuntime)) {
        if (sid !== sessionId && rt.isStreaming && rt.assignedModel) {
            usedModels.add(rt.assignedModel);
        }
    }

    // 按优先级选择未占用的模型
    for (const model of MODEL_POOL) {
        if (!usedModels.has(model.id)) {
            return model.id;
        }
    }

    // 全部占用（不太可能，4个模型同时用），还是用第一个
    return MODEL_POOL[0].id;
}

// ============================
// 多会话管理
// ============================
let sessions = [];          // 所有会话
let activeSessionId = null; // 当前激活的会话 ID
let sessionPanelOpen = true;

// DOM 缓存：sessionId -> DocumentFragment (保存离开时的 chatMessages 子节点)
const sessionDOMCache = {};

function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function createSession(title = null, activate = true) {
    const id = generateId();
    const session = {
        id,
        title: title || `新会话 ${sessions.length + 1}`,
        messages: [], // {role, content, timestamp}
        artifacts: [], // {id, title, type, code, icon}
        createdAt: Date.now(),
        updatedAt: Date.now(),
    };
    sessions.unshift(session);
    saveSessions();
    renderSessionList();
    if (activate) {
        switchSession(id);
    }
    return session;
}

function switchSession(id) {
    const container = document.getElementById('chatMessages');

    // 保存当前会话的 DOM 到缓存（包含正在流式的内容）
    if (activeSessionId && activeSessionId !== id) {
        const fragment = document.createDocumentFragment();
        while (container.firstChild) {
            fragment.appendChild(container.firstChild);
        }
        sessionDOMCache[activeSessionId] = fragment;
    }

    activeSessionId = id;
    const session = getActiveSession();
    if (!session) return;

    // 更新标题
    document.getElementById('chatTitle').textContent = `🤖 ${session.title}`;

    // 清空容器
    container.innerHTML = '';

    // 如果 DOM 缓存中有该会话的内容，直接恢复（保留流式输出中的节点）
    if (sessionDOMCache[id]) {
        container.appendChild(sessionDOMCache[id]);
        delete sessionDOMCache[id];
        container.scrollTop = container.scrollHeight;
    } else if (session.messages.length === 0) {
        // 新会话，显示欢迎消息
        container.innerHTML = `
            <div class="message assistant">
                <div class="message-avatar">🎓</div>
                <div class="message-content">
                    <div class="message-text">
                        <p>你好！我是深圳中考全科 AI 教师。有什么想问的？直接说吧！💪</p>
                    </div>
                </div>
            </div>
        `;
    } else {
        // 从消息历史重建 DOM
        session.messages.forEach(msg => {
            appendMessage(msg.role, msg.content, false, false);
        });

        // 如果该会话正在流式，追加一个流式占位节点并重新绑定
        const rt = getSessionRuntime(id);
        if (rt.isStreaming && rt.fullContent) {
            const msgDiv = appendMessage('assistant', '', true, false);
            updateStreamMessage(msgDiv, rt.fullContent);
            rt.streamingMsgDiv = msgDiv; // 重新绑定到新 DOM 节点
        }
    }

    // 恢复 artifact 缩略图
    renderArtifactThumbnails();

    // 更新会话列表高亮
    renderSessionList();

    // 更新发送按钮状态（基于当前会话的流式状态）
    updateSendButton();

    // 更新模型显示
    updateModelDisplay();

    saveSessions();
}

function getActiveSession() {
    return sessions.find(s => s.id === activeSessionId);
}

function getSessionById(id) {
    return sessions.find(s => s.id === id);
}

function deleteSession(id) {
    if (sessions.length <= 1) {
        showToast('至少保留一个会话', 'warning');
        return;
    }

    const rt = getSessionRuntime(id);
    if (rt.isStreaming) {
        showToast('该会话正在生成中，请先停止', 'warning');
        return;
    }

    if (!confirm('确定删除此会话？')) return;

    const idx = sessions.findIndex(s => s.id === id);
    sessions.splice(idx, 1);

    // 清理运行时和 DOM 缓存
    delete sessionRuntime[id];
    delete sessionDOMCache[id];

    if (activeSessionId === id) {
        switchSession(sessions[0].id);
    }

    saveSessions();
    renderSessionList();
    showToast('会话已删除', 'success');
}

function renameSession(id) {
    const session = sessions.find(s => s.id === id);
    if (!session) return;
    const newName = prompt('输入会话名称：', session.title);
    if (newName && newName.trim()) {
        session.title = newName.trim();
        session.updatedAt = Date.now();
        if (id === activeSessionId) {
            document.getElementById('chatTitle').textContent = `🤖 ${session.title}`;
        }
        saveSessions();
        renderSessionList();
    }
}

function createNewSession() {
    createSession();
    showToast('已创建新会话', 'success');
}

function renderSessionList(filter = '') {
    const list = document.getElementById('sessionList');
    const filtered = filter
        ? sessions.filter(s => s.title.toLowerCase().includes(filter.toLowerCase()))
        : sessions;

    list.innerHTML = filtered.map(s => {
        const isActive = s.id === activeSessionId;
        const msgCount = s.messages.length;
        const time = formatSessionTime(s.updatedAt);
        const rt = getSessionRuntime(s.id);
        const streaming = rt.isStreaming;
        const modelInfo = streaming && rt.assignedModel
            ? MODEL_POOL.find(m => m.id === rt.assignedModel)
            : null;
        const statusIcon = streaming ? '⏳' : (msgCount > 0 ? '💬' : '📝');
        const modelBadge = modelInfo ? `<span class="session-model-badge">${modelInfo.label}</span>` : '';

        return `
            <div class="session-item ${isActive ? 'active' : ''} ${streaming ? 'streaming' : ''}" onclick="switchSession('${s.id}')">
                <span class="session-item-icon">${statusIcon}</span>
                <div class="session-item-info">
                    <div class="session-item-title">${escapeHtml(s.title)} ${modelBadge}</div>
                    <div class="session-item-meta">${msgCount} 条消息 · ${time}${streaming ? ' · <span class="streaming-dot">●</span> 生成中' : ''}</div>
                </div>
                <div class="session-item-actions">
                    <button class="btn btn-icon" onclick="event.stopPropagation();renameSession('${s.id}')" title="重命名">✏️</button>
                    <button class="btn btn-icon" onclick="event.stopPropagation();deleteSession('${s.id}')" title="删除" style="color:var(--danger);">🗑️</button>
                </div>
            </div>
        `;
    }).join('');

    // 更新迷你条计数
    const streamingCount = sessions.filter(s => getSessionRuntime(s.id).isStreaming).length;
    document.getElementById('miniBarCount').textContent = streamingCount > 0
        ? `${sessions.length}/${streamingCount}⏳`
        : sessions.length;
}

// 更新当前会话的模型显示
function updateModelDisplay() {
    const rt = getSessionRuntime(activeSessionId);
    const modelSelect = document.getElementById('modelSelect');
    if (rt.assignedModel && rt.isStreaming) {
        modelSelect.value = rt.assignedModel;
    }
}

function filterSessions(query) {
    renderSessionList(query);
}

function formatSessionTime(ts) {
    const d = new Date(ts);
    const now = new Date();
    const diff = now - d;
    if (diff < 60000) return '刚刚';
    if (diff < 3600000) return Math.floor(diff / 60000) + ' 分钟前';
    if (diff < 86400000) return Math.floor(diff / 3600000) + ' 小时前';
    if (diff < 604800000) return Math.floor(diff / 86400000) + ' 天前';
    return `${d.getMonth() + 1}/${d.getDate()}`;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function toggleSessionPanel() {
    sessionPanelOpen = !sessionPanelOpen;
    const panel = document.getElementById('sessionPanel');
    const mini = document.getElementById('sessionMiniBar');
    const toggleBtn = document.getElementById('sessionToggleBtn');

    if (sessionPanelOpen) {
        panel.style.display = 'flex';
        mini.style.display = 'none';
        toggleBtn.style.display = 'none';
    } else {
        panel.style.display = 'none';
        mini.style.display = 'flex';
        toggleBtn.style.display = 'inline-flex';
    }
}

// ============================
// 会话持久化（localStorage）
// ============================
function saveSessions() {
    try {
        const data = {
            sessions,
            activeSessionId,
        };
        localStorage.setItem('szzkSessions', JSON.stringify(data));
    } catch (e) {
        console.warn('保存会话失败:', e);
    }
}

function loadSessions() {
    try {
        const raw = localStorage.getItem('szzkSessions');
        if (raw) {
            const data = JSON.parse(raw);
            sessions = data.sessions || [];
            activeSessionId = data.activeSessionId;

            if (sessions.length > 0) {
                renderSessionList();
                if (activeSessionId && sessions.find(s => s.id === activeSessionId)) {
                    switchSession(activeSessionId);
                } else {
                    switchSession(sessions[0].id);
                }
                return;
            }
        }
    } catch (e) {
        console.warn('加载会话失败:', e);
    }

    // 无历史，创建默认会话
    createSession('全科 AI 教师', true);
}

// ============================
// 会话导出
// ============================
function exportCurrentSession() {
    const session = getActiveSession();
    if (!session || session.messages.length === 0) {
        showToast('当前会话为空，无法导出', 'warning');
        return;
    }
    downloadSessionFile(session);
    showToast('会话已导出', 'success');
}

function exportAllSessions() {
    if (sessions.length === 0) {
        showToast('没有会话可导出', 'warning');
        return;
    }

    const exportData = {
        exportTime: new Date().toISOString(),
        sessionCount: sessions.length,
        sessions: sessions.map(s => ({
            title: s.title,
            createdAt: new Date(s.createdAt).toISOString(),
            messageCount: s.messages.length,
            messages: s.messages.map(m => ({
                role: m.role,
                content: m.content,
                time: m.timestamp ? new Date(m.timestamp).toISOString() : null,
            })),
        })),
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `中考AI会话_全部_${formatDate(new Date())}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast(`已导出 ${sessions.length} 个会话`, 'success');
}

function downloadSessionFile(session) {
    // 导出为 Markdown 格式，可读性更好
    let md = `# ${session.title}\n\n`;
    md += `> 导出时间: ${new Date().toLocaleString('zh-CN')}\n`;
    md += `> 消息数: ${session.messages.length}\n\n---\n\n`;

    session.messages.forEach(msg => {
        const role = msg.role === 'user' ? '👤 用户' : '🎓 AI教师';
        const time = msg.timestamp ? new Date(msg.timestamp).toLocaleString('zh-CN') : '';
        md += `### ${role} ${time ? `(${time})` : ''}\n\n`;
        md += `${msg.content}\n\n---\n\n`;
    });

    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${session.title}_${formatDate(new Date())}.md`;
    a.click();
    URL.revokeObjectURL(url);
}

function formatDate(d) {
    return `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
}

// ============================
// Artifact 系统
// ============================
let currentArtifactIndex = -1; // 当前打开的 artifact 在 session.artifacts 中的索引

function detectArtifact(content) {
    // 检测 AI 回复中是否包含可预览的代码块
    // 匹配 HTML 代码块
    const htmlMatch = content.match(/```html\s*\n([\s\S]*?)```/i);
    if (htmlMatch) {
        return { type: 'html', code: htmlMatch[1].trim(), icon: '🌐', label: 'HTML' };
    }

    // 匹配 SVG 代码块
    const svgMatch = content.match(/```svg\s*\n([\s\S]*?)```/i);
    if (svgMatch) {
        return { type: 'svg', code: svgMatch[1].trim(), icon: '🎨', label: 'SVG' };
    }

    // 匹配 Mermaid 图
    const mermaidMatch = content.match(/```mermaid\s*\n([\s\S]*?)```/i);
    if (mermaidMatch) {
        return { type: 'mermaid', code: mermaidMatch[1].trim(), icon: '📊', label: 'Diagram' };
    }

    // 匹配大段 JS 代码（超过10行可能是可运行的）
    const jsMatch = content.match(/```(?:javascript|js)\s*\n([\s\S]*?)```/i);
    if (jsMatch && jsMatch[1].split('\n').length > 10) {
        return { type: 'javascript', code: jsMatch[1].trim(), icon: '⚡', label: 'JS' };
    }

    // 匹配 Python 代码
    const pyMatch = content.match(/```python\s*\n([\s\S]*?)```/i);
    if (pyMatch && pyMatch[1].split('\n').length > 5) {
        return { type: 'python', code: pyMatch[1].trim(), icon: '🐍', label: 'Python' };
    }

    return null;
}

function addArtifact(title, type, code, icon) {
    const session = getActiveSession();
    if (!session) return;

    const artifact = {
        id: generateId(),
        title: title || `Artifact ${session.artifacts.length + 1}`,
        type,
        code,
        icon: icon || '📦',
        createdAt: Date.now(),
    };

    session.artifacts.push(artifact);
    saveSessions();
    renderArtifactThumbnails();

    // 自动打开
    openArtifact(session.artifacts.length - 1);
    return artifact;
}

function openArtifact(index) {
    const session = getActiveSession();
    if (!session || !session.artifacts[index]) return;

    const artifact = session.artifacts[index];
    currentArtifactIndex = index;

    // 显示面板
    const panel = document.getElementById('artifactPanel');
    panel.style.display = 'flex';

    // 设置标题
    document.getElementById('artifactTitle').textContent = `${artifact.icon} ${artifact.title}`;

    // 设置代码
    const codeEl = document.getElementById('artifactCode');
    codeEl.textContent = artifact.code;

    // 语法高亮（如果 hljs 可用）
    if (typeof hljs !== 'undefined') {
        try { hljs.highlightElement(codeEl); } catch (e) {}
    }

    // 默认显示预览
    switchArtifactTab('preview');
    renderArtifactPreview(artifact);
    renderArtifactThumbnails();
}

function renderArtifactPreview(artifact) {
    const frame = document.getElementById('artifactPreviewFrame');

    if (artifact.type === 'html') {
        frame.srcdoc = artifact.code;
    } else if (artifact.type === 'svg') {
        frame.srcdoc = `<!DOCTYPE html><html><body style="margin:0;display:flex;align-items:center;justify-content:center;min-height:100vh;background:#f5f5f5;">${artifact.code}</body></html>`;
    } else if (artifact.type === 'mermaid') {
        frame.srcdoc = `<!DOCTYPE html><html><head><script src="https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js"></script></head><body style="margin:20px;background:#fff;"><pre class="mermaid">${escapeHtml(artifact.code)}</pre><script>mermaid.initialize({startOnLoad:true,theme:'default'});</script></body></html>`;
    } else if (artifact.type === 'javascript') {
        frame.srcdoc = `<!DOCTYPE html><html><head><style>body{font-family:monospace;padding:20px;background:#1a1d28;color:#e8e8ef;}</style></head><body><pre id="output"></pre><script>
const origLog = console.log;
console.log = function(...args) {
    document.getElementById('output').textContent += args.join(' ') + '\\n';
    origLog.apply(console, args);
};
try { ${artifact.code} } catch(e) { document.getElementById('output').textContent += 'Error: ' + e.message; }
</script></body></html>`;
    } else {
        // 纯代码展示
        frame.srcdoc = `<!DOCTYPE html><html><head><style>body{font-family:monospace;padding:20px;background:#1a1d28;color:#e8e8ef;white-space:pre-wrap;}</style></head><body>${escapeHtml(artifact.code)}</body></html>`;
    }
}

function switchArtifactTab(tab) {
    const codeView = document.getElementById('artifactCodeView');
    const previewView = document.getElementById('artifactPreviewView');
    const codeTab = document.getElementById('artifactTabCode');
    const previewTab = document.getElementById('artifactTabPreview');

    if (tab === 'code') {
        codeView.style.display = 'block';
        previewView.style.display = 'none';
        codeTab.classList.add('active');
        previewTab.classList.remove('active');
    } else {
        codeView.style.display = 'none';
        previewView.style.display = 'block';
        codeTab.classList.remove('active');
        previewTab.classList.add('active');
    }
}

function closeArtifactPanel() {
    document.getElementById('artifactPanel').style.display = 'none';
    currentArtifactIndex = -1;
    renderArtifactThumbnails();
}

function copyArtifactCode() {
    const session = getActiveSession();
    if (!session || currentArtifactIndex < 0) return;
    const code = session.artifacts[currentArtifactIndex].code;
    navigator.clipboard.writeText(code).then(() => {
        showToast('代码已复制', 'success');
    });
}

function deleteArtifact(index) {
    const session = getActiveSession();
    if (!session) return;
    session.artifacts.splice(index, 1);
    saveSessions();

    if (currentArtifactIndex === index) {
        closeArtifactPanel();
    } else if (currentArtifactIndex > index) {
        currentArtifactIndex--;
    }
    renderArtifactThumbnails();
}

function renderArtifactThumbnails() {
    const session = getActiveSession();
    const container = document.getElementById('artifactThumbnails');
    if (!session || session.artifacts.length === 0) {
        container.innerHTML = '';
        return;
    }

    // 只在面板关闭时显示缩略图
    const panelOpen = document.getElementById('artifactPanel').style.display !== 'none';

    container.innerHTML = session.artifacts.map((a, i) => {
        const isOpen = panelOpen && currentArtifactIndex === i;
        return `
            <div class="artifact-thumb ${isOpen ? 'active' : ''}" onclick="openArtifact(${i})" title="${escapeHtml(a.title)}">
                <span class="artifact-thumb-icon">${a.icon}</span>
                <span class="artifact-thumb-label">${escapeHtml(a.title.slice(0, 8))}</span>
                <button class="artifact-thumb-close" onclick="event.stopPropagation();deleteArtifact(${i})">✕</button>
            </div>
        `;
    }).join('');
}

// 从预览弹窗打开本地文件的辅助函数
function openLocalFileFromPreview() {
    // 找到当前预览的文件（通过标题匹配）
    const titleEl = document.querySelector('#filePreviewModal .preview-title');
    if (!titleEl) return;
    const titleText = titleEl.textContent;
    // 去掉 emoji 前缀
    const fileName = titleText.replace(/^[^\s]+\s/, '');
    const fileIndex = KB_DATA.findIndex(f => f.name === fileName);
    if (fileIndex >= 0) {
        openLocalFile(fileIndex);
    }
}

// ============================
// 页面导航
// ============================
function switchPage(page) {
    // 切换页面显示
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(`page-${page}`).classList.add('active');

    // 切换导航高亮
    document.querySelectorAll('.nav-item[data-page]').forEach(n => n.classList.remove('active'));
    document.querySelector(`.nav-item[data-page="${page}"]`)?.classList.add('active');

    // 页面初始化
    if (page === 'geometry' && !geometryBoard) {
        loadGeometry('basic');
    }
    if (page === 'knowledge') {
        renderKBStats();
        renderKBTable();
    }
    // 中考数据页面已改为iframe嵌入，无需初始化
}

// ============================
// Marked.js 配置
// ============================
function initMarked() {
    if (typeof marked === 'undefined') return;

    marked.setOptions({
        highlight: function (code, lang) {
            if (typeof hljs !== 'undefined' && lang && hljs.getLanguage(lang)) {
                try { return hljs.highlight(code, { language: lang }).value; } catch (e) { }
            }
            return code;
        },
        breaks: true,
        gfm: true,
    });
}

// ============================
// 消息渲染（Markdown + KaTeX）
// ============================
function renderMessageContent(text) {
    if (!text) return '';

    // 先保护 LaTeX 公式不被 Markdown 解析破坏
    const latexBlocks = [];
    const latexInlines = [];

    // 保护块级公式 $$...$$
    let processed = text.replace(/\$\$([\s\S]*?)\$\$/g, (match, p1) => {
        latexBlocks.push(p1);
        return `%%LATEX_BLOCK_${latexBlocks.length - 1}%%`;
    });

    // 保护行内公式 $...$
    processed = processed.replace(/\$([^\$\n]+?)\$/g, (match, p1) => {
        latexInlines.push(p1);
        return `%%LATEX_INLINE_${latexInlines.length - 1}%%`;
    });

    // Markdown 渲染
    if (typeof marked !== 'undefined') {
        processed = marked.parse(processed);
    }

    // 恢复块级公式
    processed = processed.replace(/%%LATEX_BLOCK_(\d+)%%/g, (match, idx) => {
        try {
            return katex.renderToString(latexBlocks[parseInt(idx)], { displayMode: true, throwOnError: false });
        } catch (e) {
            return `<pre class="katex-error">${latexBlocks[parseInt(idx)]}</pre>`;
        }
    });

    // 恢复行内公式
    processed = processed.replace(/%%LATEX_INLINE_(\d+)%%/g, (match, idx) => {
        try {
            return katex.renderToString(latexInlines[parseInt(idx)], { displayMode: false, throwOnError: false });
        } catch (e) {
            return `<code>${latexInlines[parseInt(idx)]}</code>`;
        }
    });

    return processed;
}

// ============================
// 聊天功能
// ============================
function appendMessage(role, content, isStreamingMsg = false, addToSession = true) {
    const container = document.getElementById('chatMessages');
    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${role}`;

    const avatar = role === 'user' ? '👤' : '🎓';
    const renderedContent = isStreamingMsg
        ? '<div class="typing-indicator"><span></span><span></span><span></span></div>'
        : renderMessageContent(content);

    msgDiv.innerHTML = `
        <div class="message-avatar">${avatar}</div>
        <div class="message-content">
            <div class="message-text">${renderedContent}</div>
        </div>
    `;

    container.appendChild(msgDiv);
    container.scrollTop = container.scrollHeight;

    // 保存到当前会话
    if (addToSession && !isStreamingMsg && content) {
        const session = getActiveSession();
        if (session) {
            session.messages.push({ role, content, timestamp: Date.now() });
            session.updatedAt = Date.now();

            // 自动用第一条用户消息作为会话标题
            if (role === 'user' && session.messages.length <= 2 && session.title.startsWith('新会话')) {
                session.title = content.slice(0, 30) + (content.length > 30 ? '...' : '');
                document.getElementById('chatTitle').textContent = `🤖 ${session.title}`;
                renderSessionList();
            }

            saveSessions();
        }
    }

    return msgDiv;
}

function updateStreamMessage(msgDiv, content) {
    const textDiv = msgDiv.querySelector('.message-text');
    if (textDiv) {
        textDiv.innerHTML = renderMessageContent(content);
        const container = document.getElementById('chatMessages');
        container.scrollTop = container.scrollHeight;
    }
}

async function sendChat() {
    const input = document.getElementById('chatInput');
    const userMsg = input.value.trim();
    if (!userMsg) return;

    const session = getActiveSession();
    if (!session) return;

    const rt = getSessionRuntime(session.id);

    // 当前会话正在流式中，不允许重复发送
    if (rt.isStreaming) {
        showToast('当前会话正在生成中，请等待或切换到其他会话', 'warning');
        return;
    }

    // 显示用户消息
    appendMessage('user', userMsg);
    input.value = '';
    autoResizeTextarea(input);

    // 检查是否需要触发几何画板
    const geoMatch = detectGeometryRequest(userMsg);
    if (geoMatch) {
        const geoMsg = appendMessage('assistant', '', true, false);
        setTimeout(() => {
            const replyContent = `已为你加载几何场景：**${getGeometryTitle(geoMatch)}**\n\n请在左侧几何画板中查看和交互。你可以拖拽点位来观察变化。`;
            switchPage('geometry');
            loadGeometry(geoMatch);
            updateStreamMessage(geoMsg, replyContent);
            // 保存到会话
            session.messages.push({ role: 'assistant', content: replyContent, timestamp: Date.now() });
            session.updatedAt = Date.now();
            saveSessions();
        }, 500);
        return;
    }

    // 为当前会话分配模型
    const assignedModel = assignModelForSession(session.id);
    rt.assignedModel = assignedModel;
    rt.isStreaming = true;
    rt.fullContent = '';

    updateSendButton();
    renderSessionList();

    // 创建流式占位消息
    const assistantMsg = appendMessage('assistant', '', true, false);
    rt.streamingMsgDiv = assistantMsg;

    // 捕获发送时的 sessionId，用于闭包（用户可能中途切换会话）
    const sendSessionId = session.id;

    try {
        // 构建上下文：使用当前会话的消息历史
        const contextMsgs = session.messages.slice(-20).map(m => ({
            role: m.role,
            content: m.content,
        }));

        const messages = [
            { role: 'system', content: SYSTEM_PROMPT },
            ...contextMsgs,
        ];

        rt.controller = new AbortController();

        const modelLabel = MODEL_POOL.find(m => m.id === assignedModel)?.name || assignedModel;
        console.log(`[会话 ${session.title}] 使用模型: ${modelLabel}`);

        const response = await fetch(CONFIG.apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${CONFIG.apiToken}`,
            },
            body: JSON.stringify({
                model: assignedModel,
                messages: messages,
                temperature: CONFIG.temperature,
                max_tokens: CONFIG.maxTokens,
                stream: true,
            }),
            signal: rt.controller.signal,
        });

        if (!response.ok) {
            throw new Error(`API 错误: ${response.status} ${response.statusText}`);
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop() || '';

            for (const line of lines) {
                const trimmed = line.trim();
                if (!trimmed || !trimmed.startsWith('data:')) continue;

                const data = trimmed.slice(5).trim();
                if (data === '[DONE]') continue;

                try {
                    const json = JSON.parse(data);
                    const delta = json.choices?.[0]?.delta?.content;
                    if (delta) {
                        rt.fullContent += delta;

                        // 只有当该会话是当前活跃会话时，才更新 DOM
                        // 否则内容只累积在 rt.fullContent 中，切回时通过 switchSession 恢复
                        if (activeSessionId === sendSessionId && rt.streamingMsgDiv) {
                            updateStreamMessage(rt.streamingMsgDiv, rt.fullContent);
                        }
                    }
                } catch (e) {
                    // 忽略解析错误
                }
            }
        }

        // 流式完成
        const targetSession = getSessionById(sendSessionId);
        if (targetSession && rt.fullContent) {
            // 保存到会话消息
            targetSession.messages.push({ role: 'assistant', content: rt.fullContent, timestamp: Date.now() });
            targetSession.updatedAt = Date.now();
            saveSessions();

            // 最终渲染（确保完整内容显示）
            if (activeSessionId === sendSessionId && rt.streamingMsgDiv) {
                updateStreamMessage(rt.streamingMsgDiv, rt.fullContent);
            }

            // 检测 Artifact
            const artifact = detectArtifact(rt.fullContent);
            if (artifact) {
                const firstLine = rt.fullContent.split('\n')[0].replace(/[#*`]/g, '').trim();
                const artTitle = firstLine.slice(0, 30) || artifact.label;
                // 只有当活跃会话才自动打开 artifact
                if (activeSessionId === sendSessionId) {
                    addArtifact(artTitle, artifact.type, artifact.code, artifact.icon);
                } else {
                    // 非活跃会话，静默保存 artifact
                    targetSession.artifacts.push({
                        id: generateId(),
                        title: artTitle,
                        type: artifact.type,
                        code: artifact.code,
                        icon: artifact.icon,
                        createdAt: Date.now(),
                    });
                    saveSessions();
                }
            }

            renderSessionList();
        } else if (activeSessionId === sendSessionId && rt.streamingMsgDiv) {
            updateStreamMessage(rt.streamingMsgDiv, '*（模型未返回内容，请重试）*');
        }

    } catch (error) {
        if (error.name === 'AbortError') {
            if (activeSessionId === sendSessionId && rt.streamingMsgDiv) {
                updateStreamMessage(rt.streamingMsgDiv, rt.fullContent ? rt.fullContent + '\n\n*（已停止生成）*' : '*（已停止生成）*');
            }
            // 保存已生成的部分内容
            const targetSession = getSessionById(sendSessionId);
            if (targetSession && rt.fullContent) {
                targetSession.messages.push({ role: 'assistant', content: rt.fullContent, timestamp: Date.now() });
                targetSession.updatedAt = Date.now();
                saveSessions();
            }
        } else {
            console.error('Chat error:', error);
            if (activeSessionId === sendSessionId && rt.streamingMsgDiv) {
                updateStreamMessage(rt.streamingMsgDiv, `⚠️ **请求出错**: ${error.message}\n\n请检查网络连接和 API 设置。`);
            }
        }
    } finally {
        rt.isStreaming = false;
        rt.controller = null;
        rt.streamingMsgDiv = null;
        rt.fullContent = '';
        rt.assignedModel = null;
        renderSessionList();

        // 如果该会话仍然是活跃的，更新按钮
        if (activeSessionId === sendSessionId) {
            updateSendButton();
        }
    }
}

function stopChat() {
    const rt = getSessionRuntime(activeSessionId);
    if (rt.controller) {
        rt.controller.abort();
    }
}

function clearChat() {
    const session = getActiveSession();
    if (!session || session.messages.length === 0) return;

    const rt = getSessionRuntime(session.id);
    if (rt.isStreaming) {
        showToast('当前会话正在生成中，请先停止', 'warning');
        return;
    }

    if (!confirm('确定要清空当前会话的对话记录吗？')) return;

    session.messages = [];
    session.artifacts = [];
    session.updatedAt = Date.now();
    saveSessions();

    const container = document.getElementById('chatMessages');
    container.innerHTML = `
        <div class="message assistant">
            <div class="message-avatar">🎓</div>
            <div class="message-content">
                <div class="message-text">
                    <p>对话已清空。有什么新问题？💪</p>
                </div>
            </div>
        </div>
    `;

    // 清空 DOM 缓存
    delete sessionDOMCache[session.id];

    // 关闭 artifact 面板
    closeArtifactPanel();
    renderSessionList();
    showToast('对话已清空', 'success');
}

function updateSendButton() {
    const btn = document.getElementById('sendBtn');
    const icon = document.getElementById('sendIcon');
    const rt = getSessionRuntime(activeSessionId);

    if (rt.isStreaming) {
        btn.onclick = stopChat;
        icon.textContent = '⏹';
        btn.title = '停止生成';
        btn.classList.add('btn-danger');
        btn.classList.remove('btn-primary');
    } else {
        btn.onclick = sendChat;
        icon.textContent = '➤';
        btn.title = '发送';
        btn.classList.remove('btn-danger');
        btn.classList.add('btn-primary');
    }
}

// ============================
// 输入框辅助
// ============================
function autoResizeTextarea(el) {
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 150) + 'px';
}

function insertPrompt(text) {
    const input = document.getElementById('chatInput');
    input.value = text;
    input.focus();
    autoResizeTextarea(input);
}

function handleImageUpload(input) {
    const file = input.files?.[0];
    if (!file) return;
    // TODO: 图片上传与多模态对话
    showToast('图片上传功能开发中...', 'info');
    input.value = '';
}

// 键盘快捷键
document.addEventListener('keydown', (e) => {
    if (e.target.id === 'chatInput') {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendChat();
        }
    }
});

// ============================
// 几何图形检测
// ============================
function detectGeometryRequest(text) {
    const patterns = {
        'drinking_horse': /将军饮马|饮马问题|对称.*最短/i,
        'fermat': /费马点|三角形.*最小.*距离和/i,
        'hubugui': /胡不归|折射.*最短/i,
        'apollonius': /阿[波氏].*圆|阿氏圆|比值.*轨迹/i,
        'quadratic': /二次函数|抛物线|y\s*=\s*ax/i,
        'circle': /圆.*[性质定理]|弦|切线|圆心角|圆周角/i,
        'similar': /相似三角形|相似比|位似/i,
        'basic': /基础作图|画.*三角形|角平分线|垂直平分/i,
    };

    for (const [key, regex] of Object.entries(patterns)) {
        if (regex.test(text)) return key;
    }
    return null;
}

function getGeometryTitle(key) {
    const titles = {
        basic: '基础作图',
        drinking_horse: '将军饮马',
        fermat: '费马点',
        hubugui: '胡不归',
        apollonius: '阿氏圆',
        quadratic: '二次函数',
        circle: '圆的性质',
        similar: '相似三角形',
    };
    return titles[key] || key;
}

// ============================
// JSXGraph 几何引擎
// ============================
function loadGeometry(topic) {
    // 更新按钮状态
    document.querySelectorAll('.topic-btn').forEach(btn => {
        btn.classList.toggle('active', btn.textContent.trim() === getGeometryTitle(topic));
    });

    // 清除旧画板
    if (geometryBoard) {
        JXG.JSXGraph.freeBoard(geometryBoard);
    }

    // 创建新画板
    geometryBoard = JXG.JSXGraph.initBoard('jxgbox', {
        boundingbox: [-6, 6, 6, -6],
        axis: true,
        grid: true,
        showCopyright: false,
        showNavigation: true,
        keepAspectRatio: true,
    });

    // 设置暗色主题
    geometryBoard.containerObj.style.backgroundColor = '#1a1d28';

    const info = document.getElementById('geometryInfo');
    const title = document.getElementById('geoTitle');
    const desc = document.getElementById('geoDesc');
    const measure = document.getElementById('geoMeasure');

    switch (topic) {
        case 'basic':
            drawBasicGeometry(title, desc, measure);
            break;
        case 'drinking_horse':
            drawDrinkingHorse(title, desc, measure);
            break;
        case 'fermat':
            drawFermatPoint(title, desc, measure);
            break;
        case 'hubugui':
            drawHubugui(title, desc, measure);
            break;
        case 'apollonius':
            drawApollonius(title, desc, measure);
            break;
        case 'quadratic':
            drawQuadratic(title, desc, measure);
            break;
        case 'circle':
            drawCircleProperties(title, desc, measure);
            break;
        case 'similar':
            drawSimilarTriangles(title, desc, measure);
            break;
    }
}

// ------ 基础作图 ------
function drawBasicGeometry(title, desc, measure) {
    title.textContent = '📐 基础作图';
    desc.innerHTML = '<p>展示基本的几何作图：三角形、角平分线、中位线等。</p><p><strong>操作：</strong>拖拽红色点改变三角形形状，观察中点和中位线变化。</p>';

    const b = geometryBoard;
    const A = b.create('point', [-3, -2], { name: 'A', color: '#f87171', size: 4 });
    const B = b.create('point', [3, -2], { name: 'B', color: '#f87171', size: 4 });
    const C = b.create('point', [0, 3], { name: 'C', color: '#f87171', size: 4 });

    // 三角形
    b.create('polygon', [A, B, C], { fillColor: '#6c8cff20', borders: { strokeColor: '#6c8cff', strokeWidth: 2 } });

    // 中点
    const M_AB = b.create('midpoint', [A, B], { name: 'M₁', color: '#4ade80', size: 3 });
    const M_BC = b.create('midpoint', [B, C], { name: 'M₂', color: '#4ade80', size: 3 });
    const M_AC = b.create('midpoint', [A, C], { name: 'M₃', color: '#4ade80', size: 3 });

    // 中位线
    b.create('segment', [M_AB, M_BC], { strokeColor: '#fbbf24', strokeWidth: 2, dash: 2 });
    b.create('segment', [M_BC, M_AC], { strokeColor: '#fbbf24', strokeWidth: 2, dash: 2 });
    b.create('segment', [M_AB, M_AC], { strokeColor: '#fbbf24', strokeWidth: 2, dash: 2 });

    // 动态测量
    b.on('update', () => {
        const ab = A.Dist(B).toFixed(2);
        const bc = B.Dist(C).toFixed(2);
        const ac = A.Dist(C).toFixed(2);
        const area = (0.5 * Math.abs(
            A.X() * (B.Y() - C.Y()) + B.X() * (C.Y() - A.Y()) + C.X() * (A.Y() - B.Y())
        )).toFixed(2);
        measure.innerHTML = `AB = ${ab} | BC = ${bc} | AC = ${ac}<br>面积 S = ${area}`;
    });
    b.update();
}

// ------ 将军饮马 ------
function drawDrinkingHorse(title, desc, measure) {
    title.textContent = '🐴 将军饮马问题';
    desc.innerHTML = `
        <p><strong>问题：</strong>将军从 A 点出发，到河边(直线 l)饮马，再到 B 点扎营，求最短路径。</p>
        <p><strong>方法：</strong>作 A 关于 l 的对称点 A\'，则 A\'B 与 l 的交点 P 即为饮马点。</p>
        <p><strong>原理：</strong>对称性保证 AP = A\'P，故 AP + PB = A\'P + PB ≥ A\'B</p>
        <p>👉 拖拽 <span style="color:#f87171">A</span> 和 <span style="color:#38bdf8">B</span> 观察最短路径变化</p>
    `;

    const b = geometryBoard;

    // 河（x轴）
    b.create('line', [[0, 0], [1, 0]], { strokeColor: '#38bdf8', strokeWidth: 3, fixed: true, name: 'l (河)' });

    const A = b.create('point', [-3, 3], { name: 'A', color: '#f87171', size: 4 });
    const B = b.create('point', [3, 2], { name: 'B', color: '#38bdf8', size: 4 });

    // A 的对称点 A'（关于 x 轴对称）
    const Ap = b.create('point', [() => A.X(), () => -A.Y()], {
        name: "A'", color: '#f8717180', size: 3, fixed: true
    });

    // 对称虚线
    b.create('segment', [A, Ap], { strokeColor: '#f8717140', dash: 3, strokeWidth: 1 });

    // 饮马点 P = A'B 与 x 轴的交点
    const lineApB = b.create('line', [Ap, B], { visible: false });
    const P = b.create('intersection', [lineApB, b.create('line', [[0, 0], [1, 0]], { visible: false }), 0], {
        name: 'P', color: '#4ade80', size: 4
    });

    // 路径
    b.create('segment', [A, P], { strokeColor: '#fbbf24', strokeWidth: 2 });
    b.create('segment', [P, B], { strokeColor: '#fbbf24', strokeWidth: 2 });
    // 最短路径参考线
    b.create('segment', [Ap, B], { strokeColor: '#4ade8060', dash: 2, strokeWidth: 1 });

    b.on('update', () => {
        const ap = A.Dist(P).toFixed(2);
        const pb = P.Dist(B).toFixed(2);
        const total = (A.Dist(P) + P.Dist(B)).toFixed(2);
        const shortest = Ap.Dist(B).toFixed(2);
        measure.innerHTML = `AP = ${ap} | PB = ${pb}<br>总路程 = ${total}<br>最短路程 A'B = ${shortest}`;
    });
    b.update();
}

// ------ 费马点 ------
function drawFermatPoint(title, desc, measure) {
    title.textContent = '📍 费马点';
    desc.innerHTML = `
        <p><strong>问题：</strong>在三角形 ABC 内找一点 P，使 PA + PB + PC 最小。</p>
        <p><strong>性质：</strong>若三角形各角均 < 120°，则费马点处 ∠APB = ∠BPC = ∠CPA = 120°。</p>
        <p><strong>作法：</strong>分别以各边为底向外作等边三角形，三条连线交于费马点。</p>
        <p>👉 拖拽三角形顶点，观察费马点位置和距离和变化</p>
    `;

    const b = geometryBoard;
    const A = b.create('point', [-3, -2], { name: 'A', color: '#f87171', size: 4 });
    const B = b.create('point', [3, -1], { name: 'B', color: '#38bdf8', size: 4 });
    const C = b.create('point', [0, 3], { name: 'C', color: '#4ade80', size: 4 });

    b.create('polygon', [A, B, C], { fillColor: '#6c8cff10', borders: { strokeColor: '#6c8cff', strokeWidth: 2 } });

    // 向外作等边三角形 — 在AB外侧
    function rotatePoint(px, py, cx, cy, angle) {
        const cos = Math.cos(angle), sin = Math.sin(angle);
        return [cx + (px - cx) * cos - (py - cy) * sin, cy + (px - cx) * sin + (py - cy) * cos];
    }

    const D = b.create('point', [
        () => rotatePoint(B.X(), B.Y(), A.X(), A.Y(), -Math.PI / 3)[0],
        () => rotatePoint(B.X(), B.Y(), A.X(), A.Y(), -Math.PI / 3)[1]
    ], { name: 'D', color: '#a78bfa60', size: 2, fixed: true });

    const E = b.create('point', [
        () => rotatePoint(C.X(), C.Y(), B.X(), B.Y(), -Math.PI / 3)[0],
        () => rotatePoint(C.X(), C.Y(), B.X(), B.Y(), -Math.PI / 3)[1]
    ], { name: 'E', color: '#a78bfa60', size: 2, fixed: true });

    const F = b.create('point', [
        () => rotatePoint(A.X(), A.Y(), C.X(), C.Y(), -Math.PI / 3)[0],
        () => rotatePoint(A.X(), A.Y(), C.X(), C.Y(), -Math.PI / 3)[1]
    ], { name: 'F', color: '#a78bfa60', size: 2, fixed: true });

    // 连线
    const l1 = b.create('line', [C, D], { strokeColor: '#fbbf2440', dash: 2, strokeWidth: 1 });
    const l2 = b.create('line', [A, E], { strokeColor: '#fbbf2440', dash: 2, strokeWidth: 1 });

    // 费马点
    const Fermat = b.create('intersection', [l1, l2, 0], {
        name: 'F*', color: '#fbbf24', size: 5
    });

    // 到三顶点的连线
    b.create('segment', [Fermat, A], { strokeColor: '#f8717180', strokeWidth: 1.5 });
    b.create('segment', [Fermat, B], { strokeColor: '#38bdf880', strokeWidth: 1.5 });
    b.create('segment', [Fermat, C], { strokeColor: '#4ade8080', strokeWidth: 1.5 });

    b.on('update', () => {
        const fa = Fermat.Dist(A).toFixed(2);
        const fb = Fermat.Dist(B).toFixed(2);
        const fc = Fermat.Dist(C).toFixed(2);
        const sum = (Fermat.Dist(A) + Fermat.Dist(B) + Fermat.Dist(C)).toFixed(2);
        measure.innerHTML = `FA = ${fa} | FB = ${fb} | FC = ${fc}<br>距离和 = ${sum}`;
    });
    b.update();
}

// ------ 胡不归 ------
function drawHubugui(title, desc, measure) {
    title.textContent = '🏃 胡不归问题';
    desc.innerHTML = `
        <p><strong>问题：</strong>A 到直线 l 上某点 P，再从 P 到 B，在 l 上和 l 外的速度不同，求最短时间路径。</p>
        <p><strong>类比：</strong>光的折射——斯涅尔定律（Snell's Law）</p>
        <p><strong>关键：</strong>入射角与折射角的正弦之比等于速度之比</p>
        <p>👉 拖拽 A、B 点观察最优折射路径</p>
    `;

    const b = geometryBoard;

    // 直线 l（y = -1）
    b.create('line', [[-5, -1], [5, -1]], { strokeColor: '#38bdf8', strokeWidth: 3, fixed: true, name: 'l' });

    // 区域标注
    b.create('text', [4, 2, '快区 v₁'], { fontSize: 14, color: '#4ade80' });
    b.create('text', [4, -3, '慢区 v₂'], { fontSize: 14, color: '#fbbf24' });

    const A = b.create('point', [-3, 3], { name: 'A', color: '#f87171', size: 4 });
    const B = b.create('point', [3, -4], { name: 'B', color: '#38bdf8', size: 4 });

    // 折射点 P（可拖拽）
    const P = b.create('glider', [0, -1, b.create('line', [[-5, -1], [5, -1]], { visible: false })], {
        name: 'P', color: '#4ade80', size: 4
    });

    b.create('segment', [A, P], { strokeColor: '#4ade80', strokeWidth: 2 });
    b.create('segment', [P, B], { strokeColor: '#fbbf24', strokeWidth: 2 });

    // 法线
    b.create('segment', [[() => P.X(), -1], [() => P.X(), 2]], { strokeColor: '#ffffff30', dash: 3, strokeWidth: 1 });

    b.on('update', () => {
        const v1 = 2, v2 = 1; // 速度比
        const ap = A.Dist(P).toFixed(2);
        const pb = P.Dist(B).toFixed(2);
        const t = (A.Dist(P) / v1 + P.Dist(B) / v2).toFixed(2);
        measure.innerHTML = `v₁ = ${v1}, v₂ = ${v2}<br>AP = ${ap} | PB = ${pb}<br>总时间 T = AP/v₁ + PB/v₂ = ${t}`;
    });
    b.update();
}

// ------ 阿氏圆 ------
function drawApollonius(title, desc, measure) {
    title.textContent = '⭕ 阿氏圆（Apollonius Circle）';
    desc.innerHTML = `
        <p><strong>定义：</strong>到两定点距离之比为常数 k (k≠1) 的点的轨迹是一个圆。</p>
        <p><strong>公式：</strong>PA/PB = k，其中 A、B 为定点</p>
        <p>👉 拖拽 P 点观察距离比，拖拽 A、B 改变定点</p>
    `;

    const b = geometryBoard;
    const A = b.create('point', [-2, 0], { name: 'A', color: '#f87171', size: 4 });
    const B = b.create('point', [2, 0], { name: 'B', color: '#38bdf8', size: 4 });

    const k = 2; // 距离比

    // 内分点和外分点
    const D = b.create('point', [
        () => (A.X() + k * B.X()) / (1 + k),
        () => (A.Y() + k * B.Y()) / (1 + k)
    ], { name: 'D(内分)', color: '#fbbf2480', size: 2, fixed: true });

    const E = b.create('point', [
        () => (A.X() - k * B.X()) / (1 - k),
        () => (A.Y() - k * B.Y()) / (1 - k)
    ], { name: 'E(外分)', color: '#fbbf2480', size: 2, fixed: true });

    // 阿氏圆
    const center = b.create('midpoint', [D, E], { visible: false });
    const radius = () => D.Dist(E) / 2;
    b.create('circle', [center, () => radius()], { strokeColor: '#a78bfa', strokeWidth: 2, fillColor: '#a78bfa10' });

    // 动点 P
    const P = b.create('glider', [0, 2, b.create('circle', [center, () => radius()], { visible: false })], {
        name: 'P', color: '#4ade80', size: 4
    });

    b.create('segment', [P, A], { strokeColor: '#f8717160', dash: 2, strokeWidth: 1 });
    b.create('segment', [P, B], { strokeColor: '#38bdf860', dash: 2, strokeWidth: 1 });

    b.on('update', () => {
        const pa = P.Dist(A).toFixed(2);
        const pb = P.Dist(B).toFixed(2);
        const ratio = (P.Dist(A) / P.Dist(B)).toFixed(3);
        measure.innerHTML = `PA = ${pa} | PB = ${pb}<br>PA/PB = ${ratio} (理论值 k = ${k})`;
    });
    b.update();
}

// ------ 二次函数 ------
function drawQuadratic(title, desc, measure) {
    title.textContent = '📈 二次函数';
    desc.innerHTML = `
        <p><strong>一般式：</strong>y = ax² + bx + c</p>
        <p><strong>顶点式：</strong>y = a(x - h)² + k，顶点 (h, k)</p>
        <p><strong>性质：</strong>a > 0 开口向上，a < 0 开口向下</p>
        <p>👉 拖拽红色控制点改变抛物线形状</p>
    `;

    const b = geometryBoard;

    // 控制参数的滑块
    const sa = b.create('slider', [[-5, -5], [-1, -5], [-3, 1, 3]], { name: 'a', snapWidth: 0.1 });
    const sh = b.create('slider', [[-5, -5.8], [-1, -5.8], [-5, 0, 5]], { name: 'h', snapWidth: 0.1 });
    const sk = b.create('slider', [[-5, -6.6], [-1, -6.6], [-5, 0, 5]], { name: 'k', snapWidth: 0.1 });

    // 抛物线
    b.create('functiongraph', [(x) => {
        const a = sa.Value(), h = sh.Value(), k = sk.Value();
        return a * (x - h) * (x - h) + k;
    }], { strokeColor: '#6c8cff', strokeWidth: 2.5 });

    // 顶点
    const vertex = b.create('point', [() => sh.Value(), () => sk.Value()], {
        name: '顶点', color: '#f87171', size: 4, fixed: true
    });

    // 对称轴
    b.create('line', [[() => sh.Value(), 0], [() => sh.Value(), 1]], {
        strokeColor: '#fbbf2440', dash: 3, strokeWidth: 1, name: '对称轴'
    });

    b.on('update', () => {
        const a = sa.Value().toFixed(1);
        const h = sh.Value().toFixed(1);
        const k = sk.Value().toFixed(1);
        const direction = parseFloat(a) > 0 ? '开口向上 ↑' : parseFloat(a) < 0 ? '开口向下 ↓' : '退化为直线';
        measure.innerHTML = `y = ${a}(x - ${h})² + ${k}<br>顶点: (${h}, ${k})<br>对称轴: x = ${h}<br>${direction}`;
    });

    // 调整 boundingbox
    JXG.JSXGraph.freeBoard(geometryBoard);
    geometryBoard = JXG.JSXGraph.initBoard('jxgbox', {
        boundingbox: [-8, 8, 8, -8],
        axis: true, grid: true, showCopyright: false, showNavigation: true, keepAspectRatio: true
    });
    geometryBoard.containerObj.style.backgroundColor = '#1a1d28';
    drawQuadratic.__inited = true;

    // 重新绘制
    const b2 = geometryBoard;
    const sa2 = b2.create('slider', [[-7, -6.5], [-2, -6.5], [-3, 1, 3]], { name: 'a', snapWidth: 0.1 });
    const sh2 = b2.create('slider', [[-7, -7.2], [-2, -7.2], [-5, 0, 5]], { name: 'h', snapWidth: 0.1 });
    const sk2 = b2.create('slider', [[-7, -7.9], [-2, -7.9], [-5, 0, 5]], { name: 'k', snapWidth: 0.1 });

    b2.create('functiongraph', [(x) => {
        return sa2.Value() * (x - sh2.Value()) * (x - sh2.Value()) + sk2.Value();
    }], { strokeColor: '#6c8cff', strokeWidth: 2.5 });

    b2.create('point', [() => sh2.Value(), () => sk2.Value()], {
        name: '顶点', color: '#f87171', size: 4, fixed: true
    });

    b2.create('line', [[() => sh2.Value(), 0], [() => sh2.Value(), 1]], {
        strokeColor: '#fbbf2440', dash: 3, strokeWidth: 1
    });

    b2.on('update', () => {
        const a = sa2.Value().toFixed(1);
        const h = sh2.Value().toFixed(1);
        const k = sk2.Value().toFixed(1);
        const dir = parseFloat(a) > 0 ? '↑ 开口向上' : parseFloat(a) < 0 ? '↓ 开口向下' : '— 退化';
        measure.innerHTML = `y = ${a}(x − ${h})² + ${k}<br>顶点: (${h}, ${k}) | 对称轴: x = ${h}<br>${dir}`;
    });
    b2.update();
}

// ------ 圆的性质 ------
function drawCircleProperties(title, desc, measure) {
    title.textContent = '⭕ 圆的性质';
    desc.innerHTML = `
        <p><strong>圆周角定理：</strong>同弧上的圆周角等于圆心角的一半</p>
        <p><strong>切线性质：</strong>过切点的半径垂直于切线</p>
        <p>👉 拖拽圆上的点观察角度变化</p>
    `;

    const b = geometryBoard;

    // 圆
    const O = b.create('point', [0, 0], { name: 'O', color: '#fbbf24', size: 3 });
    const circle = b.create('circle', [O, 3], { strokeColor: '#6c8cff', strokeWidth: 2, fillColor: '#6c8cff08' });

    // 弧上两端点
    const A = b.create('glider', [-2, 2.24, circle], { name: 'A', color: '#f87171', size: 4 });
    const B = b.create('glider', [2, 2.24, circle], { name: 'B', color: '#38bdf8', size: 4 });

    // 圆周角点
    const C = b.create('glider', [0, -3, circle], { name: 'C', color: '#4ade80', size: 4 });

    // 弦 AB
    b.create('segment', [A, B], { strokeColor: '#a78bfa', strokeWidth: 2 });

    // 圆心角
    b.create('segment', [O, A], { strokeColor: '#fbbf2480', strokeWidth: 1.5 });
    b.create('segment', [O, B], { strokeColor: '#fbbf2480', strokeWidth: 1.5 });
    b.create('angle', [A, O, B], { radius: 0.8, fillColor: '#fbbf2430', name: 'α' });

    // 圆周角
    b.create('segment', [C, A], { strokeColor: '#4ade8080', strokeWidth: 1.5 });
    b.create('segment', [C, B], { strokeColor: '#4ade8080', strokeWidth: 1.5 });
    b.create('angle', [A, C, B], { radius: 0.8, fillColor: '#4ade8030', name: 'β' });

    b.on('update', () => {
        // 计算角度
        const angO = JXG.Math.Geometry.rad(A, O, B) * 180 / Math.PI;
        const angC = JXG.Math.Geometry.rad(A, C, B) * 180 / Math.PI;
        measure.innerHTML = `圆心角 α = ${angO.toFixed(1)}°<br>圆周角 β = ${angC.toFixed(1)}°<br>α/β = ${(angO / angC).toFixed(2)} (理论值 ≈ 2.00)`;
    });
    b.update();
}

// ------ 相似三角形 ------
function drawSimilarTriangles(title, desc, measure) {
    title.textContent = '🔺 相似三角形';
    desc.innerHTML = `
        <p><strong>AA 相似：</strong>两角对应相等的三角形相似</p>
        <p><strong>性质：</strong>对应边成比例，对应角相等</p>
        <p>👉 拖拽右侧三角形的缩放控制点，观察相似比变化</p>
    `;

    const b = geometryBoard;

    // 大三角形（固定形状）
    const A = b.create('point', [-4, -2], { name: 'A', color: '#f87171', size: 4 });
    const B = b.create('point', [-1, -2], { name: 'B', color: '#f87171', size: 4 });
    const C = b.create('point', [-3, 2], { name: 'C', color: '#f87171', size: 4 });
    b.create('polygon', [A, B, C], { fillColor: '#f8717115', borders: { strokeColor: '#f87171', strokeWidth: 2 } });

    // 小三角形（可缩放）
    const scale = b.create('slider', [[1, -5], [5, -5], [0.3, 0.6, 1.5]], { name: 'k (缩放)', snapWidth: 0.05 });

    const D = b.create('point', [
        () => 2,
        () => -2
    ], { name: 'D', color: '#38bdf8', size: 4, fixed: true });

    const E = b.create('point', [
        () => 2 + (B.X() - A.X()) * scale.Value(),
        () => -2 + (B.Y() - A.Y()) * scale.Value()
    ], { name: 'E', color: '#38bdf8', size: 3, fixed: true });

    const F = b.create('point', [
        () => 2 + (C.X() - A.X()) * scale.Value(),
        () => -2 + (C.Y() - A.Y()) * scale.Value()
    ], { name: 'F', color: '#38bdf8', size: 3, fixed: true });

    b.create('polygon', [D, E, F], { fillColor: '#38bdf815', borders: { strokeColor: '#38bdf8', strokeWidth: 2 } });

    b.on('update', () => {
        const ab = A.Dist(B).toFixed(2);
        const de = D.Dist(E).toFixed(2);
        const ratio = (D.Dist(E) / A.Dist(B)).toFixed(3);
        measure.innerHTML = `AB = ${ab} | DE = ${de}<br>相似比 k = DE/AB = ${ratio}<br>面积比 k² = ${(ratio * ratio).toFixed(3)}`;
    });
    b.update();
}

// ============================
// 搜索引擎（Tavily 真实搜索 + Opus 4.6 智能综合）
// ============================
const TAVILY_API_KEY = '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';
const BRAVE_API_KEY = 'YOUR_BRAVE_API_KEY';

// Tavily 搜索
async function searchTavily(query, maxResults = 8) {
    const resp = await fetch('https://api.tavily.com/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            api_key: TAVILY_API_KEY,
            query: query,
            max_results: maxResults,
            include_images: true,
            include_image_descriptions: true,
            search_depth: 'advanced',
        }),
    });
    if (!resp.ok) throw new Error(`Tavily 搜索失败: ${resp.status}`);
    return resp.json();
}

// Brave 搜索
async function searchBrave(query, count = 8) {
    const params = new URLSearchParams({ q: query, count: count });
    const resp = await fetch(`https://api.search.brave.com/res/v1/web/search?${params}`, {
        headers: { 'X-Subscription-Token': BRAVE_API_KEY, 'Accept': 'application/json' },
    });
    if (!resp.ok) throw new Error(`Brave 搜索失败: ${resp.status}`);
    return resp.json();
}

// 搜索结果去重
function deduplicateResults(results) {
    const seen = new Set();
    return results.filter(r => {
        const key = r.url;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
    });
}

async function doSearch() {
    const input = document.getElementById('searchInput');
    const query = input.value.trim();
    if (!query) return;

    const resultsDiv = document.getElementById('searchResults');
    resultsDiv.innerHTML = '<div class="search-placeholder"><div class="loading-spinner"></div><p>🔍 正在全网搜索...</p></div>';

    // 获取选中的搜索引擎
    const engines = [];
    document.querySelectorAll('.engine-chip input:checked').forEach(cb => engines.push(cb.value));

    if (engines.length === 0) {
        resultsDiv.innerHTML = '<div class="search-placeholder"><p>请至少选择一个搜索引擎</p></div>';
        return;
    }

    try {
        // ====== 第1步：并行调用搜索 API ======
        const searchPromises = [];
        if (engines.includes('tavily')) {
            searchPromises.push(
                searchTavily(query).then(data => ({ engine: 'tavily', data })).catch(e => ({ engine: 'tavily', error: e.message }))
            );
        }
        if (engines.includes('brave')) {
            searchPromises.push(
                searchBrave(query).then(data => ({ engine: 'brave', data })).catch(e => ({ engine: 'brave', error: e.message }))
            );
        }

        const searchResults = await Promise.all(searchPromises);

        // 合并搜索结果
        let allResults = [];
        let allImages = [];

        for (const sr of searchResults) {
            if (sr.error) {
                console.warn(`${sr.engine} 搜索失败:`, sr.error);
                continue;
            }
            if (sr.engine === 'tavily') {
                const tavilyResults = (sr.data.results || []).map(r => ({
                    title: r.title,
                    url: r.url,
                    snippet: r.content,
                    source: 'Tavily',
                    score: r.score || 0,
                }));
                allResults.push(...tavilyResults);
                // Tavily 图片
                if (sr.data.images && sr.data.images.length > 0) {
                    for (const img of sr.data.images) {
                        if (typeof img === 'string') {
                            allImages.push({ url: img, description: '' });
                        } else if (img.url) {
                            allImages.push({ url: img.url, description: img.description || '' });
                        }
                    }
                }
            }
            if (sr.engine === 'brave') {
                const braveResults = (sr.data.web?.results || []).map(r => ({
                    title: r.title,
                    url: r.url,
                    snippet: r.description,
                    source: 'Brave',
                    score: 0,
                }));
                allResults.push(...braveResults);
                // Brave 视频结果
                if (sr.data.videos?.results) {
                    const videoResults = sr.data.videos.results.map(v => ({
                        title: v.title,
                        url: v.url,
                        snippet: v.description || '视频内容',
                        source: 'Brave-Video',
                        score: 0.8,
                        thumbnail: v.thumbnail?.src,
                        isVideo: true,
                    }));
                    allResults.push(...videoResults);
                }
            }
        }

        // 去重
        allResults = deduplicateResults(allResults);

        // ====== 第2步：如果没有真实搜索结果，仍旧显示提示 ======
        if (allResults.length === 0 && searchPromises.length === 0) {
            // 没有选中 Tavily/Brave，用 AI 直接回答
            resultsDiv.innerHTML = '<div class="search-placeholder"><div class="loading-spinner"></div><p>🤖 AI 分析中...</p></div>';
        } else if (allResults.length === 0) {
            resultsDiv.innerHTML = '<div class="search-placeholder"><p>未找到相关搜索结果，请尝试其他关键词</p></div>';
            return;
        }

        // 先展示搜索结果卡片
        resultsDiv.innerHTML = '<div class="search-placeholder"><div class="loading-spinner"></div><p>🤖 Opus 4.6 正在智能综合分析...</p></div>';

        // ====== 第3步：用 Opus 4.6 综合分析 ======
        const searchContext = allResults.slice(0, 12).map((r, i) =>
            `[${i + 1}] 标题: ${r.title}\n    链接: ${r.url}\n    摘要: ${r.snippet || '无'}${r.isVideo ? '\n    类型: 视频' : ''}`
        ).join('\n\n');

        const imageContext = allImages.slice(0, 5).map((img, i) =>
            `图片${i + 1}: ${img.url}${img.description ? ` (${img.description})` : ''}`
        ).join('\n');

        const searchSystemPrompt = `你是深圳中考学习资源搜索专家。基于以下真实搜索结果，为用户提供高质量的回答。

## 严格要求
1. **必须给出真实可点击的链接**：从搜索结果中选取最相关的链接，用 Markdown 链接格式 [标题](URL) 给出
2. **视频链接**：如果用户要求视频，优先给出 B站(bilibili.com)、YouTube 等视频网站的直接链接，格式：🎬 [视频标题](视频URL)
3. **图片/图示**：如果有相关图片，用 Markdown 图片格式 ![描述](图片URL) 嵌入
4. **不要虚构链接**：只使用搜索结果中真实存在的 URL，不要编造
5. **中文回答**：所有内容用中文
6. **结构清晰**：使用标题、列表、加粗等 Markdown 格式

## 搜索结果
${searchContext}

${imageContext ? `## 相关图片\n${imageContext}` : ''}

## 回答格式
先给出简明扼要的知识要点，然后列出推荐资源（附真实链接）。如果有视频资源，单独列一个"📺 推荐视频"板块。如果有图片，在合适位置嵌入。`;

        const messages = [
            { role: 'system', content: searchSystemPrompt },
            { role: 'user', content: `搜索：${query}` }
        ];

        const response = await fetch(CONFIG.apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${CONFIG.apiToken}`,
            },
            body: JSON.stringify({
                model: 'claude-opus-4-6',
                messages,
                temperature: 0.3,
                max_tokens: 8192,
                stream: true,
            }),
        });

        if (!response.ok) throw new Error(`AI 分析失败: ${response.status}`);

        // 流式渲染
        let aiContent = '';
        resultsDiv.innerHTML = `
            <div class="search-result-item">
                <div class="result-title">🤖 AI 智能搜索结果</div>
                <div class="result-snippet" id="searchAIContent"><div class="typing-indicator"><span></span><span></span><span></span></div></div>
                <div class="result-meta">
                    <span class="result-source">引擎: ${engines.join(', ')}</span>
                    <span>模型: Claude Opus 4.6</span>
                </div>
            </div>
            ${renderSearchResultCards(allResults.slice(0, 10))}
        `;

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';
        const aiContentDiv = document.getElementById('searchAIContent');

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop() || '';

            for (const line of lines) {
                const trimmed = line.trim();
                if (!trimmed || !trimmed.startsWith('data:')) continue;
                const data = trimmed.slice(5).trim();
                if (data === '[DONE]') continue;

                try {
                    const json = JSON.parse(data);
                    const delta = json.choices?.[0]?.delta?.content;
                    if (delta) {
                        aiContent += delta;
                        if (aiContentDiv) {
                            aiContentDiv.innerHTML = renderMessageContent(aiContent);
                        }
                    }
                } catch (e) {}
            }
        }

        // 最终渲染
        if (aiContentDiv) {
            aiContentDiv.innerHTML = renderMessageContent(aiContent || '未能生成分析结果');
        }

    } catch (error) {
        resultsDiv.innerHTML = `
            <div class="search-placeholder">
                <p>⚠️ 搜索出错: ${error.message}</p>
                <p>请检查网络连接和 API 设置</p>
            </div>
        `;
    }
}

// 渲染搜索结果卡片
function renderSearchResultCards(results) {
    if (!results || results.length === 0) return '';

    const cards = results.map(r => {
        const isVideo = r.isVideo || /bilibili\.com|youtube\.com|youtu\.be|v\.qq\.com|ixigua\.com/.test(r.url);
        const icon = isVideo ? '🎬' : (r.source === 'Brave' ? '🦁' : '🌐');
        const domain = new URL(r.url).hostname.replace('www.', '');
        const thumbnail = r.thumbnail ? `<img class="result-card-thumb" src="${r.thumbnail}" onerror="this.style.display='none'" alt="">` : '';

        return `
            <div class="search-result-card" onclick="window.open('${r.url}', '_blank')">
                ${thumbnail}
                <div class="result-card-body">
                    <div class="result-card-title">${icon} ${escapeHtml(r.title)}</div>
                    <div class="result-card-snippet">${escapeHtml((r.snippet || '').slice(0, 120))}</div>
                    <div class="result-card-meta">
                        <span class="result-card-domain">${domain}</span>
                        <span class="result-card-source">${r.source}</span>
                    </div>
                </div>
            </div>
        `;
    }).join('');

    return `<div class="search-result-cards">${cards}</div>`;
}

// 搜索引擎芯片切换
document.querySelectorAll('.engine-chip').forEach(chip => {
    chip.addEventListener('click', () => {
        const cb = chip.querySelector('input[type="checkbox"]');
        cb.checked = !cb.checked;
        chip.classList.toggle('active', cb.checked);
    });
});

// ============================
// 设置管理
// ============================
function showSettings() {
    document.getElementById('settingApiUrl').value = CONFIG.apiUrl;
    document.getElementById('settingApiToken').value = CONFIG.apiToken;
    document.getElementById('settingModel').value = CONFIG.model;
    document.getElementById('settingRagPath').value = CONFIG.ragPath;
    document.getElementById('settingTemp').value = CONFIG.temperature;
    document.getElementById('settingTemp').nextElementSibling.textContent = CONFIG.temperature;
    document.getElementById('settingMaxTokens').value = CONFIG.maxTokens;
    document.getElementById('settingsModal').classList.add('show');
}

function hideSettings() {
    document.getElementById('settingsModal').classList.remove('show');
}

function saveSettings() {
    CONFIG.apiUrl = document.getElementById('settingApiUrl').value;
    CONFIG.apiToken = document.getElementById('settingApiToken').value;
    CONFIG.model = document.getElementById('settingModel').value;
    CONFIG.ragPath = document.getElementById('settingRagPath').value;
    CONFIG.temperature = parseFloat(document.getElementById('settingTemp').value);
    CONFIG.maxTokens = parseInt(document.getElementById('settingMaxTokens').value);

    // 同步到模型选择器
    document.getElementById('modelSelect').value = CONFIG.model;

    // 保存到 localStorage
    try {
        localStorage.setItem('szzkConfig', JSON.stringify(CONFIG));
    } catch (e) { }

    hideSettings();
    showToast('设置已保存', 'success');
}

function loadSettings() {
    try {
        const saved = localStorage.getItem('szzkConfig');
        if (saved) {
            const cfg = JSON.parse(saved);
            // 兼容修复：去掉旧版的 venus/ 前缀
            if (cfg.model && cfg.model.startsWith('venus/')) {
                cfg.model = cfg.model.replace('venus/', '');
            }
            if (cfg.imageModel && cfg.imageModel.startsWith('venus/')) {
                cfg.imageModel = cfg.imageModel.replace('venus/', '');
            }
            Object.assign(CONFIG, cfg);
            document.getElementById('modelSelect').value = CONFIG.model;
        }
    } catch (e) { }
}

// 模型选择联动
document.getElementById('modelSelect')?.addEventListener('change', (e) => {
    CONFIG.model = e.target.value;
});

// ============================
// Toast 通知
// ============================
function showToast(msg, type = 'info') {
    const container = document.getElementById('toastContainer');
    const icons = { success: '✅', error: '❌', info: 'ℹ️', warning: '⚠️' };
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<span>${icons[type] || ''}</span> ${msg}`;
    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(20px)';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// ============================
// 初始化
// ============================
window.addEventListener('DOMContentLoaded', () => {
    initMarked();
    loadSettings();
    loadSessions(); // 加载多会话
    switchPage('chat');
    console.log('🎓 深圳中考专家系统 v0.9.1 已启动');
    console.log('📐 JSXGraph 几何引擎就绪');
    console.log('🤖 Venus LLM 对话引擎就绪');
    console.log(`📚 知识库: ${KB_DATA.length} 个文件`);
    console.log('💬 多会话系统就绪');
    console.log('📦 Artifact 系统就绪');
});
