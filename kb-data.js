/**
 * 深圳中考专家系统 — 知识库数据
 * RAG 源目录: /Users/friendsun/Documents/乐天/c初三
 * 7 学科 222 文件
 */

const KB_DATA_RAW = [
    // ====== 语文 ======
    { subject: '语文', name: '中考语文基础知识手册.pdf', type: 'PDF', size: '5.3MB', status: 'indexed', desc: '涵盖初中语文全部基础知识体系，包括字音字形、词语运用、病句修改、文学常识、名著导读等，是语文复习的核心参考资料。', tags: ['全面', '基础'] },
    { subject: '语文', name: '初中文言文翻译汇总.pdf', type: 'PDF', size: '4.1MB', status: 'indexed', desc: '收录初中阶段所有必考文言文篇目的原文、注释、翻译和重点句赏析，便于系统复习文言文知识。', tags: ['全面', '文言文'] },
    { subject: '语文', name: '语文课内古诗词赏析.pptx', type: 'PPTX', size: '6.2MB', status: 'indexed', desc: '课件形式呈现初中阶段所有必背古诗词，含意境分析、手法鉴赏和考点归纳。', tags: ['全面', '古诗词'] },
    { subject: '语文', name: '作文素材与范文精选.docx', type: 'DOCX', size: '2.7MB', status: 'indexed', desc: '精选中考高分作文范文和万能素材，按主题分类整理，附点评和写作技巧指导。', tags: ['全面', '作文'] },
    { subject: '语文', name: '深圳中考语文真题2024.pdf', type: 'PDF', size: '2.9MB', status: 'indexed', desc: '2024年深圳中考语文真题完整版，含答案解析和评分标准，是考前必练的核心资料。', tags: ['真题'] },
    { subject: '语文', name: '现代文阅读真题汇编.pdf', type: 'PDF', size: '3.8MB', status: 'indexed', desc: '近五年深圳中考现代文阅读真题精选，含记叙文、说明文、议论文三大文体。', tags: ['真题', '阅读'] },
    { subject: '语文', name: '中考语文阅读理解答题技巧.docx', type: 'DOCX', size: '1.8MB', status: 'indexed', desc: '系统归纳阅读理解各类题型的答题模板和得分技巧，含标题含义、句子赏析、人物分析等。', tags: ['技巧', '阅读'] },
    { subject: '语文', name: '初三语文复习-古诗文默写.pdf', type: 'PDF', size: '2.4MB', status: 'indexed', desc: '中考必背古诗文篇目的默写训练与易错字整理，附情境默写专项练习。', tags: ['专题', '默写'] },
    { subject: '语文', name: '名著导读-红星照耀中国.pdf', type: 'PDF', size: '3.2MB', status: 'indexed', desc: '《红星照耀中国》名著导读专项，含人物分析、情节梳理和常考题型。', tags: ['专题', '名著'] },
    { subject: '语文', name: '名句名篇默写训练.docx', type: 'DOCX', size: '1.2MB', status: 'indexed', desc: '高频考试默写题目训练，含理解性默写和直接性默写两种题型。', tags: ['训练', '默写'] },

    // ====== 数学 ======
    { subject: '数学', name: '中考数学知识点全汇总.pdf', type: 'PDF', size: '8.5MB', status: 'indexed', desc: '覆盖初中数学全部知识体系，按章节梳理考点、公式、定理，是数学复习的总纲领。', tags: ['全面', '基础'] },
    { subject: '数学', name: '中考数学公式大全.pdf', type: 'PDF', size: '1.8MB', status: 'indexed', desc: '初中数学所有必记公式、定理、性质的完整汇总，含几何、代数、统计三大板块。', tags: ['全面', '公式'] },
    { subject: '数学', name: '数学思维导图全册.pptx', type: 'PPTX', size: '12.4MB', status: 'indexed', desc: '以思维导图形式串联初中数学全册知识点，清晰展现各知识模块间的逻辑关系。', tags: ['全面', '导图'] },
    { subject: '数学', name: '几何模型大全手册.pdf', type: 'PDF', size: '6.8MB', status: 'indexed', desc: '系统收录初中几何常用模型：中点模型、角平分线模型、旋转模型、相似模型等，含例题详解。', tags: ['全面', '几何'] },
    { subject: '数学', name: '深圳中考数学真题2024.pdf', type: 'PDF', size: '3.4MB', status: 'indexed', desc: '2024年深圳中考数学真题完整版，含详细解题过程和评分标准。', tags: ['真题'] },
    { subject: '数学', name: '几何专题-全等与相似.pdf', type: 'PDF', size: '5.7MB', status: 'indexed', desc: '全等三角形和相似三角形的判定与性质专项训练，含辅助线构造方法。', tags: ['专题', '几何'] },
    { subject: '数学', name: '二次函数压轴题精讲.pdf', type: 'PDF', size: '4.3MB', status: 'indexed', desc: '中考数学压轴题核心——二次函数综合题的分类精讲，含存在性问题和最值问题。', tags: ['专题', '函数'] },
    { subject: '数学', name: '将军饮马模型专题.pdf', type: 'PDF', size: '1.9MB', status: 'indexed', desc: '将军饮马问题的对称模型详解，含单次对称、双次对称和多维延伸。', tags: ['专题', '模型'] },
    { subject: '数学', name: '费马点与胡不归问题.pdf', type: 'PDF', size: '2.3MB', status: 'indexed', desc: '费马点最值问题和胡不归折射模型的原理分析与解题方法。', tags: ['专题', '模型'] },
    { subject: '数学', name: '阿氏圆与角平分线.pdf', type: 'PDF', size: '1.7MB', status: 'indexed', desc: '阿波罗尼斯圆的性质及其在角平分线问题中的应用。', tags: ['专题', '模型'] },
    { subject: '数学', name: '动点问题与最值专题.pdf', type: 'PDF', size: '3.1MB', status: 'indexed', desc: '动态几何中的最值问题专项，含动点轨迹分析和函数建模方法。', tags: ['专题', '动点'] },
    { subject: '数学', name: '概率统计专题复习.pdf', type: 'PDF', size: '2.1MB', status: 'indexed', desc: '概率计算和统计分析的系统复习，含频率估计概率、树状图和列表法。', tags: ['专题', '统计'] },
    { subject: '数学', name: '旋转变换与对称专题.pdf', type: 'PDF', size: '2.6MB', status: 'indexed', desc: '旋转变换的性质和应用，含旋转全等、旋转相似等常见模型。', tags: ['专题', '变换'] },
    { subject: '数学', name: '辅助线添加技巧.pdf', type: 'PDF', size: '3.5MB', status: 'indexed', desc: '几何证明中常见辅助线的添加思路和方法总结，含截长补短、倍长中线等经典技巧。', tags: ['技巧', '辅助线'] },
    { subject: '数学', name: '代数综合专项突破.docx', type: 'DOCX', size: '2.8MB', status: 'indexed', desc: '代数板块综合训练，含方程组、不等式组、分式方程的复杂应用题。', tags: ['专题', '代数'] },
    { subject: '数学', name: '圆的综合题型训练.docx', type: 'DOCX', size: '3.6MB', status: 'indexed', desc: '圆的综合题型训练集，含切线证明、弦长计算、圆周角定理应用等。', tags: ['训练', '圆'] },
    { subject: '数学', name: '初三数学错题集锦.docx', type: 'DOCX', size: '4.2MB', status: 'indexed', desc: '常见易错题整理分析，帮助识别思维误区和计算陷阱。', tags: ['训练', '错题'] },
    { subject: '数学', name: '数学讲解视频-二次函数.mp4', type: 'MP4', size: '156MB', status: 'indexed', desc: '二次函数从基础到压轴的完整视频讲解，含图像变换和综合应用。', tags: ['视频', '函数'] },
    { subject: '数学', name: '数学讲解视频-圆.mp4', type: 'MP4', size: '142MB', status: 'indexed', desc: '圆的基本概念、性质定理到综合应用的系统视频讲解。', tags: ['视频', '圆'] },
    { subject: '数学', name: '数学讲解视频-几何证明.mp4', type: 'MP4', size: '128MB', status: 'indexed', desc: '几何证明题的解题思路和辅助线方法视频教程。', tags: ['视频', '证明'] },

    // ====== 英语 ======
    { subject: '英语', name: '中考英语高频词汇1600.pdf', type: 'PDF', size: '3.2MB', status: 'indexed', desc: '中考英语必考1600个核心词汇完整版，按主题和频率排序，含例句和用法辨析。', tags: ['全面', '词汇'] },
    { subject: '英语', name: '英语语法专项复习.pdf', type: 'PDF', size: '4.5MB', status: 'indexed', desc: '初中英语全部语法知识系统梳理，含时态、语态、从句、非谓语动词等核心考点。', tags: ['全面', '语法'] },
    { subject: '英语', name: '英语时态语态大全.pptx', type: 'PPTX', size: '4.8MB', status: 'indexed', desc: '以课件形式详解英语八大时态和主被动语态转换，含对比表格和练习。', tags: ['全面', '时态'] },
    { subject: '英语', name: '中考英语作文高分范文.pdf', type: 'PDF', size: '1.9MB', status: 'indexed', desc: '中考英语书面表达各话题高分范文精选，含写作框架和高级句型。', tags: ['全面', '写作'] },
    { subject: '英语', name: '深圳中考英语真题2024.pdf', type: 'PDF', size: '2.9MB', status: 'indexed', desc: '2024年深圳中考英语真题完整版，含听力材料、答案解析和评分标准。', tags: ['真题'] },
    { subject: '英语', name: '完形填空技巧与真题.docx', type: 'DOCX', size: '2.8MB', status: 'indexed', desc: '完形填空解题技巧总结和近年真题精练，含逻辑推理和词义辨析训练。', tags: ['专题', '完形'] },
    { subject: '英语', name: '阅读理解分类训练.pdf', type: 'PDF', size: '5.1MB', status: 'indexed', desc: '阅读理解按文体分类训练（记叙文、说明文、应用文、议论文），含主旨大意和推理判断题。', tags: ['专题', '阅读'] },
    { subject: '英语', name: '书面表达万能模板.docx', type: 'DOCX', size: '1.6MB', status: 'indexed', desc: '各类书面表达的万能模板（书信、看图、话题、通知等），含过渡词和亮点句型。', tags: ['技巧', '写作'] },
    { subject: '英语', name: '听力训练材料合集.pdf', type: 'PDF', size: '3.7MB', status: 'indexed', desc: '听力训练配套材料，含听力技巧指导和常见场景对话。', tags: ['专题', '听力'] },
    { subject: '英语', name: '短文填空专题训练.docx', type: 'DOCX', size: '2.2MB', status: 'indexed', desc: '短文填空题型专项训练，含语法填空和选词填空两种形式。', tags: ['训练', '填空'] },
    { subject: '英语', name: '英语听力音频01.mp4', type: 'MP4', size: '45MB', status: 'indexed', desc: '中考英语听力模拟训练音频，含对话理解和独白理解。', tags: ['视频', '听力'] },

    // ====== 物理 ======
    { subject: '物理', name: '初三物理复习百科全书.pdf', type: 'PDF', size: '7.2MB', status: 'indexed', desc: '覆盖初中物理声、光、热、力、电五大板块的完整知识体系，是物理复习的核心参考。', tags: ['全面', '基础'] },
    { subject: '物理', name: '物理公式汇总表.pdf', type: 'PDF', size: '1.2MB', status: 'indexed', desc: '初中物理所有公式、单位换算和常用物理量速查表。', tags: ['全面', '公式'] },
    { subject: '物理', name: '物理实验操作指导.pptx', type: 'PPTX', size: '8.3MB', status: 'indexed', desc: '中考必考实验的操作步骤、注意事项和数据处理方法完整指导。', tags: ['全面', '实验'] },
    { subject: '物理', name: '深圳中考物理真题2024.pdf', type: 'PDF', size: '3.1MB', status: 'indexed', desc: '2024年深圳中考物理真题完整版，含详细解析和实验题评分标准。', tags: ['真题'] },
    { subject: '物理', name: '电路分析方法详解.pdf', type: 'PDF', size: '4.1MB', status: 'indexed', desc: '串并联电路识别与分析方法，含等效电路法、电流走向法等实用技巧。', tags: ['专题', '电学'] },
    { subject: '物理', name: '力学专题训练.pdf', type: 'PDF', size: '4.3MB', status: 'indexed', desc: '力学板块专项训练，含力的分析、牛顿定律应用和功能关系。', tags: ['专题', '力学'] },
    { subject: '物理', name: '电学实验专项.pdf', type: 'PDF', size: '3.8MB', status: 'indexed', desc: '电学实验的设计、操作和故障分析，含伏安法测电阻和测小灯泡电功率。', tags: ['专题', '实验'] },
    { subject: '物理', name: '光学折射反射专题.docx', type: 'DOCX', size: '2.5MB', status: 'indexed', desc: '光的折射和反射定律详解，含透镜成像规律和作图方法。', tags: ['专题', '光学'] },
    { subject: '物理', name: '热学与内能专题.pdf', type: 'PDF', size: '2.7MB', status: 'indexed', desc: '热学基本概念和内能变化规律，含比热容计算和热量传递问题。', tags: ['专题', '热学'] },
    { subject: '物理', name: '浮力与压强计算.docx', type: 'DOCX', size: '3.4MB', status: 'indexed', desc: '浮力和压强的计算方法及综合应用，含液体压强、大气压强和阿基米德原理。', tags: ['训练', '力学'] },
    { subject: '物理', name: '物理讲解视频-电学.mp4', type: 'MP4', size: '167MB', status: 'indexed', desc: '电学从基础概念到综合计算的完整视频教程。', tags: ['视频', '电学'] },
    { subject: '物理', name: '物理讲解视频-力学.mp4', type: 'MP4', size: '134MB', status: 'indexed', desc: '力学体系完整讲解视频，含运动学和动力学核心内容。', tags: ['视频', '力学'] },

    // ====== 化学 ======
    { subject: '化学', name: '初三化学全册知识点.pdf', type: 'PDF', size: '5.6MB', status: 'indexed', desc: '初三化学上下册全部知识点系统梳理，覆盖物质分类、化学反应、元素化合物三大主线。', tags: ['全面', '基础'] },
    { subject: '化学', name: '化学方程式大全.pdf', type: 'PDF', size: '2.1MB', status: 'indexed', desc: '初中化学所有必记化学方程式汇总，按反应类型分类整理，含配平方法。', tags: ['全面', '方程式'] },
    { subject: '化学', name: '元素周期表与化合价.pdf', type: 'PDF', size: '1.5MB', status: 'indexed', desc: '常见元素的化合价规律和元素周期表速记方法。', tags: ['全面', '元素'] },
    { subject: '化学', name: '深圳中考化学真题2024.pdf', type: 'PDF', size: '2.8MB', status: 'indexed', desc: '2024年深圳中考化学真题完整版，含实验探究题详细解析。', tags: ['真题'] },
    { subject: '化学', name: '酸碱盐复习专题.pdf', type: 'PDF', size: '4.2MB', status: 'indexed', desc: '酸碱盐的性质、反应规律和除杂鉴别方法系统复习。', tags: ['专题', '酸碱盐'] },
    { subject: '化学', name: '气体制取与检验.pptx', type: 'PPTX', size: '5.7MB', status: 'indexed', desc: '氧气、二氧化碳、氢气的制取装置选择和气体检验方法详解。', tags: ['专题', '气体'] },
    { subject: '化学', name: '金属与金属材料.pdf', type: 'PDF', size: '3.6MB', status: 'indexed', desc: '金属的性质、活动性顺序和合金知识专题复习。', tags: ['专题', '金属'] },
    { subject: '化学', name: '化学实验安全操作.pdf', type: 'PDF', size: '2.3MB', status: 'indexed', desc: '化学实验的安全操作规范和常见仪器使用方法。', tags: ['专题', '实验'] },
    { subject: '化学', name: '实验探究题专项.docx', type: 'DOCX', size: '3.4MB', status: 'indexed', desc: '实验探究题的解题思路和答题规范训练，含控制变量法和对照实验设计。', tags: ['训练', '实验'] },
    { subject: '化学', name: '化学计算题解法.docx', type: 'DOCX', size: '1.9MB', status: 'indexed', desc: '化学计算题常用解题方法：差量法、守恒法、关系式法等。', tags: ['训练', '计算'] },
    { subject: '化学', name: '化学讲解视频-酸碱盐.mp4', type: 'MP4', size: '123MB', status: 'indexed', desc: '酸碱盐核心内容的系统视频讲解，含实验演示。', tags: ['视频', '酸碱盐'] },

    // ====== 道法（道德与法治） ======
    { subject: '道法', name: '道法中考知识点汇总.pdf', type: 'PDF', size: '4.8MB', status: 'indexed', desc: '道德与法治全册知识点系统梳理，涵盖个人成长、社会生活、国家制度三大模块。', tags: ['全面', '基础'] },
    { subject: '道法', name: '核心素养与价值观.pptx', type: 'PPTX', size: '6.5MB', status: 'indexed', desc: '核心素养培养目标和社会主义核心价值观的全面解读课件。', tags: ['全面', '价值观'] },
    { subject: '道法', name: '深圳中考道法真题2024.pdf', type: 'PDF', size: '2.4MB', status: 'indexed', desc: '2024年深圳中考道德与法治真题完整版，含选择题和材料分析题详解。', tags: ['真题'] },
    { subject: '道法', name: '法治专题复习.pdf', type: 'PDF', size: '3.1MB', status: 'indexed', desc: '宪法、法律和公民权利义务等法治板块的专项复习。', tags: ['专题', '法治'] },
    { subject: '道法', name: '宪法与基本制度.pdf', type: 'PDF', size: '2.9MB', status: 'indexed', desc: '宪法的地位、基本原则和国家基本制度（经济制度、人民代表大会制度等）。', tags: ['专题', '宪法'] },
    { subject: '道法', name: '社会主义核心价值观.pdf', type: 'PDF', size: '1.8MB', status: 'indexed', desc: '社会主义核心价值观24字的内涵解读和在中考中的考查方式。', tags: ['专题', '价值观'] },
    { subject: '道法', name: '时事热点专题分析.docx', type: 'DOCX', size: '2.6MB', status: 'indexed', desc: '近期时事热点与道法知识点的结合分析，含热点素材和答题角度。', tags: ['专题', '时事'] },
    { subject: '道法', name: '开放性试题答题模板.docx', type: 'DOCX', size: '1.7MB', status: 'indexed', desc: '道法开放性试题的答题框架和模板，含建议类、评析类、实践类题型。', tags: ['技巧', '模板'] },

    // ====== 历史 ======
    { subject: '历史', name: '历史思维导图全册.pptx', type: 'PPTX', size: '9.2MB', status: 'indexed', desc: '以思维导图形式串联中国史和世界史全部知识点，展现历史发展脉络和因果关系。', tags: ['全面', '导图'] },
    { subject: '历史', name: '中国近现代史复习纲要.pdf', type: 'PDF', size: '6.3MB', status: 'indexed', desc: '从鸦片战争到新时代的完整知识梳理，中考历史最核心板块。', tags: ['全面', '近代史'] },
    { subject: '历史', name: '世界史大事年表.pdf', type: 'PDF', size: '3.7MB', status: 'indexed', desc: '世界历史重大事件时间线汇总，含资本主义兴起、两次世界大战和冷战等。', tags: ['全面', '世界史'] },
    { subject: '历史', name: '深圳中考历史真题2024.pdf', type: 'PDF', size: '2.5MB', status: 'indexed', desc: '2024年深圳中考历史真题完整版，含材料题详细解析。', tags: ['真题'] },
    { subject: '历史', name: '古代史专题复习.pdf', type: 'PDF', size: '4.4MB', status: 'indexed', desc: '中国古代史和世界古代史的专题复习，含文明起源、制度变革和文化成就。', tags: ['专题', '古代史'] },
    { subject: '历史', name: '两次世界大战专题.pdf', type: 'PDF', size: '2.8MB', status: 'indexed', desc: '一战和二战的起因、经过、结果和影响的对比分析。', tags: ['专题', '战争'] },
    { subject: '历史', name: '改革开放与现代化建设.pdf', type: 'PDF', size: '3.3MB', status: 'indexed', desc: '改革开放以来中国现代化建设的重大成就和历史意义。', tags: ['专题', '改革'] },
    { subject: '历史', name: '历史材料题答题技巧.docx', type: 'DOCX', size: '2.1MB', status: 'indexed', desc: '历史材料分析题的解题步骤和答题规范，含审题方法和组织答案技巧。', tags: ['技巧', '材料题'] },

    // ====== 综合资料 ======
    { subject: '综合', name: '深圳中考考试说明2025.pdf', type: 'PDF', size: '1.5MB', status: 'indexed', desc: '2025年深圳中考官方考试说明，含各科考试范围、题型设置和分值分布。', tags: ['全面', '考纲'] },
    { subject: '综合', name: '中考志愿填报指南.pdf', type: 'PDF', size: '2.1MB', status: 'indexed', desc: '深圳中考志愿填报策略指南，含批次设置、录取规则和填报技巧。', tags: ['全面', '志愿'] },
    { subject: '综合', name: '深圳高中学校介绍.docx', type: 'DOCX', size: '3.8MB', status: 'indexed', desc: '深圳各区主要高中学校的全面介绍，含办学特色、师资力量和录取情况。', tags: ['全面', '学校'] },
    { subject: '综合', name: '各科复习时间规划表.xlsx', type: 'XLSX', size: '0.3MB', status: 'indexed', desc: '中考各科复习时间分配建议表，含每周计划模板和重点任务清单。', tags: ['规划'] },
    { subject: '综合', name: '体育中考训练计划.pdf', type: 'PDF', size: '1.2MB', status: 'indexed', desc: '体育中考各项目的训练计划和提分技巧，含跑步、跳绳、游泳等。', tags: ['专题', '体育'] },
    { subject: '综合', name: '中考心理调适指南.pdf', type: 'PDF', size: '0.9MB', status: 'indexed', desc: '中考前心理调适方法和考试焦虑缓解技巧，帮助保持良好应考状态。', tags: ['专题', '心理'] },
];

/**
 * 知识库智能排序
 * 排序优先级：全面介绍类 > 真题类 > 专题类 > 技巧类 > 训练类 > 视频类 > 规划类
 * 同级按学科分组内顺序保持
 */
function getFileSortWeight(file) {
    const tags = file.tags || [];
    if (tags.includes('全面')) return 1;
    if (tags.includes('真题')) return 2;
    if (tags.includes('专题')) return 3;
    if (tags.includes('技巧')) return 4;
    if (tags.includes('训练')) return 5;
    if (tags.includes('规划')) return 5;
    if (tags.includes('视频')) return 6;
    return 7;
}

const KB_DATA = [...KB_DATA_RAW].sort((a, b) => {
    // 先按学科分组（保持学科顺序）
    const subjectOrder = ['语文', '数学', '英语', '物理', '化学', '道法', '历史', '综合'];
    const sa = subjectOrder.indexOf(a.subject);
    const sb = subjectOrder.indexOf(b.subject);
    if (sa !== sb) return sa - sb;
    // 同学科内按权重排序
    return getFileSortWeight(a) - getFileSortWeight(b);
});

// 中考学校数据（复用 shenzhen_zhongkao 项目）
const SCHOOL_DATA = [
    // ====== 公办高中（按AC类分数线降序）======
    { rank: 1, name: '深圳中学', type: 'public', ac: 572, d: 574, enrollment: 1800, boarding: '全寄宿' },
    { rank: 2, name: '深圳实验学校高中部', type: 'public', ac: 571, d: 572, enrollment: 900, boarding: '全寄宿' },
    { rank: 3, name: '深圳外国语学校', type: 'public', ac: 569, d: 571, enrollment: 960, boarding: '全寄宿' },
    { rank: 4, name: '深圳高级中学中心校区', type: 'public', ac: 567, d: 569, enrollment: 1100, boarding: '全寄宿' },
    { rank: 5, name: '红岭中学', type: 'public', ac: 562, d: 564, enrollment: 1200, boarding: '全寄宿' },
    { rank: 6, name: '宝安中学', type: 'public', ac: 558, d: 560, enrollment: 1000, boarding: '全寄宿' },
    { rank: 7, name: '南山外国语学校高中部', type: 'public', ac: 555, d: 557, enrollment: 500, boarding: '全寄宿' },
    { rank: 8, name: '育才中学', type: 'public', ac: 553, d: 555, enrollment: 600, boarding: '全寄宿' },
    { rank: 9, name: '翠园中学', type: 'public', ac: 550, d: 553, enrollment: 800, boarding: '全寄宿' },
    { rank: 10, name: '深圳大学附属中学', type: 'public', ac: 548, d: 550, enrollment: 550, boarding: '全寄宿' },
    { rank: 11, name: '新安中学', type: 'public', ac: 545, d: 547, enrollment: 700, boarding: '全寄宿' },
    { rank: 12, name: '深圳第二高级中学', type: 'public', ac: 543, d: 546, enrollment: 1100, boarding: '全寄宿' },
    { rank: 13, name: '深圳科学高中', type: 'public', ac: 541, d: 543, enrollment: 900, boarding: '全寄宿' },
    { rank: 14, name: '龙城高级中学', type: 'public', ac: 538, d: 540, enrollment: 850, boarding: '全寄宿' },
    { rank: 15, name: '北师大南山附属学校', type: 'public', ac: 536, d: 538, enrollment: 450, boarding: '部分寄宿' },
    { rank: 16, name: '深圳第二实验学校', type: 'public', ac: 534, d: 537, enrollment: 700, boarding: '全寄宿' },
    { rank: 17, name: '深圳第三高级中学', type: 'public', ac: 531, d: 533, enrollment: 600, boarding: '全寄宿' },
    { rank: 18, name: '人大附中深圳学校', type: 'public', ac: 529, d: 531, enrollment: 500, boarding: '全寄宿' },
    { rank: 19, name: '南头中学', type: 'public', ac: 526, d: 529, enrollment: 600, boarding: '部分寄宿' },
    { rank: 20, name: '华侨城中学', type: 'public', ac: 523, d: 526, enrollment: 500, boarding: '部分寄宿' },
    { rank: 21, name: '福田中学', type: 'public', ac: 520, d: 522, enrollment: 650, boarding: '部分寄宿' },
    { rank: 22, name: '梅林中学', type: 'public', ac: 517, d: 520, enrollment: 500, boarding: '走读' },
    { rank: 23, name: '布吉高级中学', type: 'public', ac: 514, d: 517, enrollment: 600, boarding: '全寄宿' },
    { rank: 24, name: '坪山高级中学', type: 'public', ac: 511, d: 513, enrollment: 700, boarding: '全寄宿' },
    { rank: 25, name: '光明高级中学', type: 'public', ac: 508, d: 511, enrollment: 650, boarding: '全寄宿' },
    { rank: 26, name: '龙华高级中学', type: 'public', ac: 506, d: 508, enrollment: 750, boarding: '全寄宿' },
    { rank: 27, name: '观澜中学', type: 'public', ac: 503, d: 505, enrollment: 500, boarding: '全寄宿' },
    { rank: 28, name: '平冈中学', type: 'public', ac: 500, d: 503, enrollment: 550, boarding: '全寄宿' },
    { rank: 29, name: '松岗中学', type: 'public', ac: 497, d: 500, enrollment: 450, boarding: '全寄宿' },
    { rank: 30, name: '西乡中学', type: 'public', ac: 494, d: 497, enrollment: 500, boarding: '全寄宿' },

    // ====== 民办高中 ======
    { rank: 1, name: '深圳百合外国语学校', type: 'private', ac: 540, d: 542, enrollment: 400, boarding: '全寄宿' },
    { rank: 2, name: '深圳亚迪学校', type: 'private', ac: 530, d: 533, enrollment: 350, boarding: '全寄宿' },
    { rank: 3, name: '深圳万科梅沙书院', type: 'private', ac: 525, d: 528, enrollment: 300, boarding: '全寄宿' },
    { rank: 4, name: '深圳富源学校', type: 'private', ac: 515, d: 518, enrollment: 500, boarding: '全寄宿' },
    { rank: 5, name: '深圳北大附中南山分校', type: 'private', ac: 510, d: 513, enrollment: 350, boarding: '全寄宿' },
    { rank: 6, name: '深圳耀华实验学校', type: 'private', ac: 505, d: 508, enrollment: 300, boarding: '全寄宿' },
    { rank: 7, name: '深圳东方英文书院', type: 'private', ac: 495, d: 498, enrollment: 400, boarding: '全寄宿' },
    { rank: 8, name: '深圳明德外语实验学校', type: 'private', ac: 488, d: 491, enrollment: 350, boarding: '全寄宿' },
    { rank: 9, name: '深圳建文外国语学校', type: 'private', ac: 480, d: 483, enrollment: 300, boarding: '全寄宿' },
    { rank: 10, name: '深圳奥斯翰外语学校', type: 'private', ac: 472, d: 476, enrollment: 250, boarding: '全寄宿' },

    // ====== 中职技校 ======
    { rank: 1, name: '深圳市第一职业技术学校', type: 'vocational', ac: 460, d: 463, enrollment: 1200, boarding: '全寄宿' },
    { rank: 2, name: '深圳市第二职业技术学校', type: 'vocational', ac: 450, d: 453, enrollment: 1000, boarding: '全寄宿' },
    { rank: 3, name: '深圳职业技术学院附属中专', type: 'vocational', ac: 445, d: 448, enrollment: 800, boarding: '全寄宿' },
    { rank: 4, name: '深圳市电子技术学校', type: 'vocational', ac: 438, d: 441, enrollment: 600, boarding: '全寄宿' },
    { rank: 5, name: '深圳市行知职业技术学校', type: 'vocational', ac: 430, d: 434, enrollment: 500, boarding: '全寄宿' },
];
