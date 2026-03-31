/**
 * 深圳中考专家系统 — 知识库管理模块
 */

let currentKBFilter = 'all';
let pendingUploadFiles = [];

// ====== 知识库统计渲染 ======
function renderKBStats() {
    const stats = {
        total: KB_DATA.length,
        indexed: KB_DATA.filter(f => f.status === 'indexed').length,
        pending: KB_DATA.filter(f => f.status === 'pending').length,
        subjects: [...new Set(KB_DATA.map(f => f.subject))].length,
    };

    const totalSize = KB_DATA.reduce((sum, f) => {
        const num = parseFloat(f.size);
        const unit = f.size.replace(/[\d.]/g, '').toUpperCase();
        if (unit === 'GB') return sum + num * 1024;
        if (unit === 'MB') return sum + num;
        if (unit === 'KB') return sum + num / 1024;
        return sum;
    }, 0);

    document.getElementById('kbStats').innerHTML = `
        <div class="stat-card">
            <div class="stat-value">${stats.total}</div>
            <div class="stat-label">总文件数</div>
        </div>
        <div class="stat-card">
            <div class="stat-value">${stats.indexed}</div>
            <div class="stat-label">已索引</div>
        </div>
        <div class="stat-card">
            <div class="stat-value">${stats.pending}</div>
            <div class="stat-label">待索引</div>
        </div>
        <div class="stat-card">
            <div class="stat-value">${stats.subjects}</div>
            <div class="stat-label">覆盖学科</div>
        </div>
        <div class="stat-card">
            <div class="stat-value">${totalSize >= 1024 ? (totalSize / 1024).toFixed(1) + 'GB' : totalSize.toFixed(0) + 'MB'}</div>
            <div class="stat-label">总大小</div>
        </div>
    `;
}

// ====== 知识库表格渲染 ======
function renderKBTable() {
    const filtered = currentKBFilter === 'all'
        ? KB_DATA
        : KB_DATA.filter(f => f.subject === currentKBFilter);

    const tbody = document.getElementById('kbTableBody');
    tbody.innerHTML = filtered.map((f, i) => {
        const realIndex = KB_DATA.indexOf(f);
        const typeIcon = {
            'PDF': '📄', 'DOCX': '📝', 'PPTX': '📊', 'XLSX': '📈',
            'MP4': '🎬', 'JPG': '🖼️', 'PNG': '🖼️', 'TXT': '📋'
        }[f.type] || '📁';

        const statusClass = f.status === 'indexed' ? 'status-indexed'
            : f.status === 'pending' ? 'status-pending' : 'status-error';
        const statusText = f.status === 'indexed' ? '✓ 已索引'
            : f.status === 'pending' ? '⏳ 待索引' : '✗ 错误';

        // 标签徽章
        const tagBadges = (f.tags || []).map(t => {
            const tagClass = t === '全面' ? 'tag-overview' : t === '真题' ? 'tag-exam' : t === '专题' ? 'tag-topic' : t === '技巧' ? 'tag-skill' : t === '训练' ? 'tag-practice' : t === '视频' ? 'tag-video' : 'tag-other';
            return `<span class="file-tag ${tagClass}">${t}</span>`;
        }).join('');

        return `<tr ondblclick="openLocalFile(${realIndex})" class="kb-row-clickable" title="双击打开文件">
            <td><span class="subject-tag subject-${f.subject}">${f.subject}</span></td>
            <td><span class="file-name-cell">${typeIcon} ${f.name}</span>${tagBadges ? '<div class="file-tags-row">' + tagBadges + '</div>' : ''}</td>
            <td>${f.type}</td>
            <td>${f.size}</td>
            <td><span class="status-badge ${statusClass}">${statusText}</span></td>
            <td>
                <button class="btn btn-ghost" onclick="event.stopPropagation();openLocalFile(${realIndex})" title="打开文件" style="padding:4px 8px;">
                    📂
                </button>
                <button class="btn btn-ghost" onclick="event.stopPropagation();openFilePreview(${realIndex})" title="查看详情" style="padding:4px 8px;">
                    👁️
                </button>
                <button class="btn btn-ghost" onclick="event.stopPropagation();deleteKBFile(${realIndex})" title="删除文件" style="color:var(--danger);padding:4px 8px;">
                    🗑️
                </button>
            </td>
        </tr>`;
    }).join('');
}

// ====== 打开本地文件（用系统默认应用 / WPS） ======
function openLocalFile(index) {
    const file = KB_DATA[index];
    if (!file) return;

    // 构建本地文件路径：RAG根目录/学科/文件名
    const subjectDir = file.subject === '道法' ? '道德与法治' : file.subject;
    const filePath = `${KB_RAG_ROOT}/${subjectDir}/${file.name}`;

    // 提示用户正在打开
    showToast(`正在打开「${file.name}」...`, 'info');

    // 使用自定义协议或提示用户
    // 在纯浏览器环境中，无法直接调用系统命令打开文件
    // 方案：尝试 file:// 协议 + 提供复制路径功能
    try {
        // 尝试通过 file:// 协议打开（部分浏览器支持）
        const fileUrl = 'file://' + encodeURI(filePath);
        
        // 由于浏览器安全限制，file:// 协议可能被阻止
        // 我们用一个 iframe trick 或者 window.open
        const opened = window.open(fileUrl, '_blank');
        
        if (!opened || opened.closed) {
            // 浏览器阻止了，显示路径供用户手动打开
            showFilePathDialog(file, filePath);
        }
    } catch (e) {
        // 回退方案：显示路径对话框
        showFilePathDialog(file, filePath);
    }
}

// 显示文件路径对话框（当无法直接打开时）
function showFilePathDialog(file, filePath) {
    const typeIcon = {
        'PDF': '📄', 'DOCX': '📝', 'PPTX': '📊', 'XLSX': '📈',
        'MP4': '🎬', 'JPG': '🖼️', 'PNG': '🖼️', 'TXT': '📋'
    }[file.type] || '📁';

    const modal = document.getElementById('filePreviewModal');
    modal.querySelector('.preview-title').textContent = `${typeIcon} ${file.name}`;
    modal.querySelector('.preview-meta').innerHTML = `
        <span class="subject-tag subject-${file.subject}">${file.subject}</span>
        <span class="preview-meta-item">📦 ${file.size}</span>
        <span class="preview-meta-item">📋 ${file.type}</span>
    `;
    modal.querySelector('.preview-desc').textContent = file.desc || '暂无描述';
    modal.querySelector('.preview-content').innerHTML = `
        <div class="file-open-section">
            <div class="file-open-icon">📂</div>
            <h4 class="file-open-title">打开本地文件</h4>
            <p class="file-open-hint">浏览器安全限制无法直接打开本地文件，请用以下方式打开：</p>
            <div class="file-path-box" id="filePathBox">
                <code>${filePath}</code>
                <button class="btn btn-primary btn-sm" onclick="copyFilePath('${filePath.replace(/'/g, "\\'")}')">📋 复制路径</button>
            </div>
            <div class="file-open-methods">
                <div class="open-method">
                    <span class="method-icon">🖥️</span>
                    <div>
                        <strong>方法一：Finder 直接打开</strong>
                        <p>复制路径 → 打开 Finder → ⌘+Shift+G → 粘贴路径 → 回车</p>
                    </div>
                </div>
                <div class="open-method">
                    <span class="method-icon">⌨️</span>
                    <div>
                        <strong>方法二：终端命令打开</strong>
                        <p>打开终端，运行：<code class="cmd-code" onclick="copyFilePath('open &quot;${filePath.replace(/"/g, '\\\\"')}&quot;')">open "${filePath}"</code></p>
                    </div>
                </div>
                <div class="open-method">
                    <span class="method-icon">📎</span>
                    <div>
                        <strong>方法三：WPS Office 打开</strong>
                        <p>打开 WPS → 文件 → 打开 → 粘贴路径</p>
                    </div>
                </div>
            </div>
        </div>
    `;
    modal.classList.add('show');
}

// 复制文件路径到剪贴板
function copyFilePath(path) {
    navigator.clipboard.writeText(path).then(() => {
        showToast('路径已复制到剪贴板 ✓', 'success');
    }).catch(() => {
        // 降级方案
        const textArea = document.createElement('textarea');
        textArea.value = path;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showToast('路径已复制到剪贴板 ✓', 'success');
    });
}

// ====== 文件预览弹窗（信息预览，保留作为按钮功能） ======
function openFilePreview(index) {
    const file = KB_DATA[index];
    if (!file) return;

    const typeIcon = {
        'PDF': '📄', 'DOCX': '📝', 'PPTX': '📊', 'XLSX': '📈',
        'MP4': '🎬', 'JPG': '🖼️', 'PNG': '🖼️', 'TXT': '📋'
    }[file.type] || '📁';

    const tagBadges = (file.tags || []).map(t => {
        const tagClass = t === '全面' ? 'tag-overview' : t === '真题' ? 'tag-exam' : t === '专题' ? 'tag-topic' : t === '技巧' ? 'tag-skill' : t === '训练' ? 'tag-practice' : t === '视频' ? 'tag-video' : 'tag-other';
        return `<span class="file-tag ${tagClass}">${t}</span>`;
    }).join('');

    // 生成模拟文件内容预览
    const preview = generateFilePreview(file);

    const modal = document.getElementById('filePreviewModal');
    modal.querySelector('.preview-title').textContent = `${typeIcon} ${file.name}`;
    modal.querySelector('.preview-meta').innerHTML = `
        <span class="subject-tag subject-${file.subject}">${file.subject}</span>
        <span class="preview-meta-item">📦 ${file.size}</span>
        <span class="preview-meta-item">📋 ${file.type}</span>
        <span class="preview-meta-item status-badge ${file.status === 'indexed' ? 'status-indexed' : 'status-pending'}">${file.status === 'indexed' ? '✓ 已索引' : '⏳ 待索引'}</span>
        ${tagBadges}
    `;
    modal.querySelector('.preview-desc').textContent = file.desc || '暂无描述';
    modal.querySelector('.preview-content').innerHTML = preview;
    modal.classList.add('show');
}

function closeFilePreview() {
    document.getElementById('filePreviewModal').classList.remove('show');
}

// 生成文件内容预览（模拟）
function generateFilePreview(file) {
    const type = file.type;
    const name = file.name;

    if (type === 'MP4') {
        return `
            <div class="preview-video-placeholder">
                <span class="preview-placeholder-icon">🎬</span>
                <p class="preview-placeholder-text">视频文件预览</p>
                <p class="preview-placeholder-hint">${name}</p>
                <div class="preview-video-bar">
                    <div class="preview-video-progress"></div>
                </div>
                <p class="preview-placeholder-hint">文件大小: ${file.size} · 格式: MP4</p>
            </div>
        `;
    }

    if (type === 'JPG' || type === 'PNG') {
        return `
            <div class="preview-image-placeholder">
                <span class="preview-placeholder-icon">🖼️</span>
                <p class="preview-placeholder-text">图片文件预览</p>
                <p class="preview-placeholder-hint">${name} · ${file.size}</p>
            </div>
        `;
    }

    if (type === 'XLSX') {
        return `
            <div class="preview-table-mock">
                <table class="preview-mock-table">
                    <thead><tr><th>学科</th><th>周一</th><th>周二</th><th>周三</th><th>周四</th><th>周五</th><th>周六</th><th>周日</th></tr></thead>
                    <tbody>
                        <tr><td>语文</td><td>古诗文</td><td>阅读</td><td>作文</td><td>基础</td><td>真题</td><td>综合</td><td>休息</td></tr>
                        <tr><td>数学</td><td>函数</td><td>几何</td><td>代数</td><td>压轴</td><td>真题</td><td>综合</td><td>休息</td></tr>
                        <tr><td>英语</td><td>词汇</td><td>语法</td><td>阅读</td><td>写作</td><td>真题</td><td>综合</td><td>休息</td></tr>
                    </tbody>
                </table>
                <p class="preview-mock-hint">📊 表格文件预览（示意）</p>
            </div>
        `;
    }

    // PDF / DOCX / PPTX / TXT — 展示文件描述和模拟内容结构
    const desc = file.desc || '';
    const tags = file.tags || [];

    // 根据文件类型和标签生成结构化预览
    let contentPreview = '';

    if (tags.includes('全面')) {
        contentPreview = `
            <div class="preview-doc-section">
                <div class="preview-doc-badge">📖 全面性资料</div>
                <p class="preview-doc-intro">${desc}</p>
                <div class="preview-doc-toc">
                    <h4>📑 内容目录（预览）</h4>
                    ${generateMockTOC(file)}
                </div>
            </div>
        `;
    } else if (tags.includes('真题')) {
        contentPreview = `
            <div class="preview-doc-section">
                <div class="preview-doc-badge preview-badge-exam">📝 真题资料</div>
                <p class="preview-doc-intro">${desc}</p>
                <div class="preview-doc-toc">
                    <h4>📋 试卷结构（预览）</h4>
                    ${generateMockExam(file)}
                </div>
            </div>
        `;
    } else {
        contentPreview = `
            <div class="preview-doc-section">
                <div class="preview-doc-badge preview-badge-topic">📌 专项资料</div>
                <p class="preview-doc-intro">${desc}</p>
                <div class="preview-doc-toc">
                    <h4>📋 内容概要（预览）</h4>
                    ${generateMockContent(file)}
                </div>
            </div>
        `;
    }

    return contentPreview;
}

// 生成全面类资料的模拟目录
function generateMockTOC(file) {
    const tocMap = {
        '中考数学知识点全汇总': ['第一章 数与式', '第二章 方程与不等式', '第三章 函数', '第四章 图形的认识', '第五章 图形的变换', '第六章 统计与概率'],
        '中考语文基础知识手册': ['第一部分 字音字形', '第二部分 词语运用', '第三部分 病句修改', '第四部分 文学常识', '第五部分 名著导读', '第六部分 文言文基础'],
        '初三物理复习百科全书': ['第一篇 声学', '第二篇 光学', '第三篇 热学', '第四篇 力学', '第五篇 电学', '第六篇 电磁学'],
        '初三化学全册知识点': ['第一单元 走进化学世界', '第二单元 我们周围的空气', '第三单元 物质构成的奥秘', '第四单元 自然界的水', '第五单元 化学方程式', '第六单元 碳和碳的氧化物', '第七单元 燃料及其利用', '第八单元 金属和金属材料', '第九单元 溶液', '第十单元 酸和碱', '第十一单元 盐 化肥', '第十二单元 化学与生活'],
    };

    // 模糊匹配
    let items = null;
    for (const [key, val] of Object.entries(tocMap)) {
        if (file.name.includes(key)) { items = val; break; }
    }
    if (!items) {
        items = ['第一部分 基础概念', '第二部分 核心考点', '第三部分 重点难点', '第四部分 综合训练', '第五部分 真题精练'];
    }

    return `<ol class="preview-toc-list">${items.map(item => `<li>${item}</li>`).join('')}</ol>`;
}

// 生成真题类的模拟试卷结构
function generateMockExam(file) {
    const subject = file.subject;
    const examMap = {
        '语文': ['一、积累与运用（24分）', '二、阅读与鉴赏（46分）', '　（一）古诗文阅读', '　（二）现代文阅读', '三、写作（40分）'],
        '数学': ['一、选择题（共12题，每题3分，共36分）', '二、填空题（共4题，每题4分，共16分）', '三、解答题（共7题，共68分）', '　（含压轴题25分）'],
        '英语': ['一、听力理解（15分）', '二、语法选择（10分）', '三、完形填空（10分）', '四、阅读理解（30分）', '五、短文填空（10分）', '六、书面表达（15分）'],
        '物理': ['一、选择题（共7题，21分）', '二、填空题（共7题，21分）', '三、作图题（共2题，4分）', '四、实验题（共3题，18分）', '五、计算题（共3题，21分）'],
        '化学': ['一、选择题（共15题，30分）', '二、填空与简答题（共4题，28分）', '三、实验探究题（共2题，17分）', '四、计算题（共1题，5分）'],
        '道法': ['一、选择题（共24题，48分）', '二、非选择题（共3题，52分）', '　材料分析题', '　探究实践题'],
        '历史': ['一、选择题（共23题，46分）', '二、非选择题（共3题，54分）', '　材料解析题', '　综合探究题'],
    };

    const items = examMap[subject] || ['一、基础题', '二、综合题', '三、应用题'];
    return `<ol class="preview-toc-list">${items.map(item => `<li>${item}</li>`).join('')}</ol>`;
}

// 生成专题类的模拟内容
function generateMockContent(file) {
    const tags = file.tags || [];
    let items;

    if (tags.includes('技巧')) {
        items = ['📌 解题思路总结', '📌 常见题型分类', '📌 答题模板与框架', '📌 典型例题精解', '📌 易错点提醒'];
    } else if (tags.includes('训练')) {
        items = ['📝 基础巩固练习', '📝 能力提升训练', '📝 综合应用题', '📝 参考答案与详解'];
    } else {
        items = ['📖 知识点梳理', '📖 重点概念解析', '📖 经典例题讲解', '📖 变式训练题组', '📖 方法技巧归纳'];
    }

    return `<ul class="preview-toc-list">${items.map(item => `<li>${item}</li>`).join('')}</ul>`;
}

// ====== 学科筛选 ======
function filterKB(subject) {
    currentKBFilter = subject;
    // 更新按钮状态
    document.querySelectorAll('.kb-filter .filter-btn').forEach(btn => {
        btn.classList.toggle('active', btn.textContent.trim() === (subject === 'all' ? '全部' : subject));
    });
    renderKBTable();
}

// ====== 删除文件 ======
function deleteKBFile(index) {
    const file = KB_DATA[index];
    if (!file) return;
    if (!confirm(`确定要删除「${file.name}」吗？\n\n删除后需要重建索引才能生效。`)) return;

    KB_DATA.splice(index, 1);
    renderKBTable();
    renderKBStats();
    showToast(`已删除「${file.name}」`, 'success');
}

// ====== 上传对话框 ======
function showUploadDialog() {
    pendingUploadFiles = [];
    document.getElementById('uploadFileList').innerHTML = '';
    document.getElementById('uploadModal').classList.add('show');
}

function hideUploadDialog() {
    document.getElementById('uploadModal').classList.remove('show');
    pendingUploadFiles = [];
}

// ====== 文件选择处理 ======
function handleFileSelect(files) {
    if (!files || files.length === 0) return;
    for (const file of files) {
        pendingUploadFiles.push(file);
    }
    renderUploadFileList();
}

function handleFileDrop(event) {
    event.preventDefault();
    event.target.closest('.kb-dropzone')?.classList.remove('dragover');
    const files = event.dataTransfer.files;
    if (files.length === 0) return;

    // 直接添加到知识库（使用默认学科"综合"）
    for (const file of files) {
        const ext = file.name.split('.').pop().toUpperCase();
        const size = file.size > 1024 * 1024
            ? (file.size / (1024 * 1024)).toFixed(1) + 'MB'
            : (file.size / 1024).toFixed(0) + 'KB';

        KB_DATA.push({
            subject: '综合',
            name: file.name,
            type: ext,
            size: size,
            status: 'pending'
        });
    }

    renderKBTable();
    renderKBStats();
    showToast(`已添加 ${files.length} 个文件，请重建索引`, 'info');
}

function renderUploadFileList() {
    const list = document.getElementById('uploadFileList');
    list.innerHTML = pendingUploadFiles.map((f, i) => {
        const size = f.size > 1024 * 1024
            ? (f.size / (1024 * 1024)).toFixed(1) + 'MB'
            : (f.size / 1024).toFixed(0) + 'KB';
        return `<div class="upload-file-item">
            <span class="file-name">${f.name}</span>
            <span class="file-size">${size}</span>
            <button class="btn btn-icon" onclick="removePendingFile(${i})" style="color:var(--danger);">✕</button>
        </div>`;
    }).join('');
}

function removePendingFile(index) {
    pendingUploadFiles.splice(index, 1);
    renderUploadFileList();
}

// ====== 确认上传 ======
function confirmUpload() {
    if (pendingUploadFiles.length === 0) {
        showToast('请先选择文件', 'warning');
        return;
    }

    const subject = document.getElementById('uploadSubject').value;

    for (const file of pendingUploadFiles) {
        const ext = file.name.split('.').pop().toUpperCase();
        const size = file.size > 1024 * 1024
            ? (file.size / (1024 * 1024)).toFixed(1) + 'MB'
            : (file.size / 1024).toFixed(0) + 'KB';

        KB_DATA.push({
            subject: subject,
            name: file.name,
            type: ext,
            size: size,
            status: 'pending'
        });
    }

    hideUploadDialog();
    renderKBTable();
    renderKBStats();
    showToast(`成功上传 ${pendingUploadFiles.length} 个文件到「${subject}」，请重建索引`, 'success');
}

// ====== 重建索引 ======
function rebuildIndex() {
    const pendingFiles = KB_DATA.filter(f => f.status === 'pending');
    if (pendingFiles.length === 0) {
        showToast('所有文件已索引，无需重建', 'info');
        return;
    }

    showToast(`开始索引 ${pendingFiles.length} 个文件...`, 'info');

    // 模拟索引过程
    let processed = 0;
    const interval = setInterval(() => {
        if (processed < pendingFiles.length) {
            pendingFiles[processed].status = 'indexed';
            processed++;
            renderKBTable();
            renderKBStats();
        } else {
            clearInterval(interval);
            showToast(`索引完成！共处理 ${pendingFiles.length} 个文件`, 'success');
        }
    }, 500);
}

// ====== 中考数据模块 ======
// 已改为 iframe 嵌入 http://81.71.84.242:8012/，无需前端代码
