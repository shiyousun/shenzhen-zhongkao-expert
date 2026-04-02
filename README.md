# 🎓 深圳中考专家系统 | Shenzhen Zhongkao Expert System

<p align="center">
  <img src="https://img.shields.io/badge/JavaScript-ES6+-yellow.svg" alt="JavaScript">
  <img src="https://img.shields.io/badge/PWA-Ready-blue.svg" alt="PWA">
  <img src="https://img.shields.io/badge/AI-Powered-green.svg" alt="AI">
  <img src="https://img.shields.io/badge/License-MIT-orange.svg" alt="License">
</p>

<p align="center"><b>📖 <a href="#中文">中文</a> | <a href="#english">English</a></b></p>

---

<a name="中文"></a>

## 🇨🇳 中文

> **全科 AI 教师 + 中考数据中心**，专为深圳中考考生打造的智能备考助手。覆盖语文、数学、英语、物理、化学、历史、道法全科目，内置知识库管理与历年考试数据分析。

### ✨ 核心功能

- 🤖 **AI 全科教师**：基于 AI 大模型的智能问答，覆盖中考全部 7 个科目，针对深圳中考特点定制
- 📊 **中考数据中心**：历年分数线、录取数据、学校排名等核心数据集中展示
- 📚 **知识库管理**：内置知识库管理器（kb-manager），支持添加/编辑/分类管理各科知识点
- 🔍 **智能检索**：基于关键词和语义的知识点快速检索
- 📱 **PWA 支持**：可安装到手机桌面，离线可用（manifest.json 配置）
- 🔄 **自动更新**：内置更新检测器（update_checker.js），确保数据时效性
- 🎨 **响应式设计**：适配桌面端和移动端的现代 UI

### 🛠️ 技术栈

| 技术 | 用途 |
|------|------|
| Vanilla JavaScript (ES6+) | 核心逻辑与 AI 交互 |
| HTML5 + CSS3 | 界面与响应式布局 |
| PWA (manifest.json) | 渐进式 Web 应用支持 |
| LocalStorage / IndexedDB | 本地数据持久化 |
| AI API | 智能问答后端 |

### 📁 项目结构

```
shenzhen-zhongkao-expert/
├── index.html              # 主页面入口
├── app.js                  # 应用核心逻辑（AI问答、路由、状态管理）
├── data.js                 # 中考数据集（分数线、录取数据等）
├── kb-data.js              # 知识库数据（各科知识点）
├── kb-manager.js           # 知识库管理器（增删改查）
├── style.css               # 全局样式（响应式设计）
├── manifest.json           # PWA 配置文件
├── update_checker.js       # 版本更新检测
└── article_images/         # 信息图资源
```

### 🚀 快速开始

1. 克隆仓库：
```bash
git clone https://github.com/shiyousun/shenzhen-zhongkao-expert.git
cd shenzhen-zhongkao-expert
```

2. 启动本地服务器（任选其一）：
```bash
# Python
python3 -m http.server 8080

# Node.js
npx serve .
```

3. 打开浏览器访问 `http://localhost:8080`

### 🎯 适用人群

- 深圳中考考生及家长
- 需要 AI 辅导的初中生
- 关注深圳中考政策和数据的教育工作者

---

<a name="english"></a>

## 🇬🇧 English

> **All-Subject AI Tutor + Exam Data Center** — An intelligent study assistant built specifically for Shenzhen High School Entrance Exam (Zhongkao) candidates. Covers all 7 subjects: Chinese, Math, English, Physics, Chemistry, History, and Civics, with built-in knowledge base management and historical exam data analysis.

### ✨ Key Features

- 🤖 **AI All-Subject Tutor**: Intelligent Q&A powered by AI large language models, covering all 7 Zhongkao subjects, customized for Shenzhen exam characteristics
- 📊 **Exam Data Center**: Centralized display of historical score cutoffs, admission data, school rankings, and other critical metrics
- 📚 **Knowledge Base Manager**: Built-in KB manager (kb-manager) supporting add/edit/categorize operations for subject knowledge points
- 🔍 **Smart Search**: Fast knowledge retrieval based on keywords and semantic understanding
- 📱 **PWA Support**: Installable on mobile home screen, works offline (via manifest.json)
- 🔄 **Auto Updates**: Built-in update checker (update_checker.js) ensures data freshness
- 🎨 **Responsive Design**: Modern UI adapted for both desktop and mobile

### 🛠️ Tech Stack

| Technology | Purpose |
|-----------|---------|
| Vanilla JavaScript (ES6+) | Core logic & AI interaction |
| HTML5 + CSS3 | UI & responsive layout |
| PWA (manifest.json) | Progressive Web App support |
| LocalStorage / IndexedDB | Local data persistence |
| AI API | Intelligent Q&A backend |

### 📁 Project Structure

```
shenzhen-zhongkao-expert/
├── index.html              # Main page entry
├── app.js                  # Core app logic (AI Q&A, routing, state)
├── data.js                 # Exam datasets (score cutoffs, admissions)
├── kb-data.js              # Knowledge base data (subject knowledge)
├── kb-manager.js           # KB manager (CRUD operations)
├── style.css               # Global styles (responsive design)
├── manifest.json           # PWA configuration
├── update_checker.js       # Version update checker
└── article_images/         # Infographic assets
```

### 🚀 Quick Start

1. Clone the repository:
```bash
git clone https://github.com/shiyousun/shenzhen-zhongkao-expert.git
cd shenzhen-zhongkao-expert
```

2. Start a local server:
```bash
# Python
python3 -m http.server 8080

# Node.js
npx serve .
```

3. Open `http://localhost:8080` in your browser

### 🎯 Target Users

- Shenzhen Zhongkao candidates and parents
- Middle school students seeking AI tutoring
- Educators tracking Shenzhen exam policies and data

---

## 📄 License

MIT License - 自由使用 | Free to use

## 👨‍💻 Author / 作者

**友哥 (YooGe)** · 友哥 & AI 创造 | Created by YooGe & AI
