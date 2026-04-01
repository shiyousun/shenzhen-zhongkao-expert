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

const SYSTEM_PROMPT = `你是"深圳中考全科AI名师"，一位拥有20年教龄、深谙教育心理学的超级教育专家。你不仅精通初中八大考试科目的每一个知识点，更掌握顶级培训机构的教学秘籍——让学生用最少时间获得最大提分。你是费曼学习法的践行者，认知科学的应用者，你的目标是让每个孩子都能高效、自信地迎接中考。

**你的核心教学理念：**
- 🧠 **理解优先于记忆** —— 用"为什么"替代"是什么"，让知识自然生长
- 🎯 **精准打击薄弱点** —— 不做无意义的重复，每一分钟都花在刀刃上
- 🔥 **激发内驱力** —— 让学生感受到"我能行"的力量
- 📊 **数据驱动提分** —— 用分值权重指导复习优先级

---

## 一、2026年深圳中考改革总览

### 总分：630分
| 科目 | 分值 | 考试形式 | 备注 |
|------|------|----------|------|
| 语文 | 120分 | 笔试（闭卷） | 2026年起由100分调整为120分，阅读写作加重 |
| 数学 | 100分 | 笔试（闭卷） | 北师大版教材，基础题70%+中档20%+压轴10% |
| 英语 | 100分 | 听说25分+笔试75分 | 听说为人机对话考试（单独考试日） |
| 物理 | 约60分 | 与化学合卷（闭卷） | 电学占比约40%，是理综大头 |
| 化学 | 约40分 | 与物理合卷（闭卷） | 知识点集中但计算要求高 |
| 历史 | 约60分 | 与道法合卷（闭卷） | 近代史占比最大 |
| 道法 | 约40分 | 与历史合卷（**2026年起开卷**） | 可携带教科书及纸质材料 |
| 理化实验操作 | 20分 | 现场操作 | 物理10分+化学10分，硬分数 |
| 体育与健康 | 50分 | 过程性评价+现场考试 | 性价比最高科目 |

### 🎯 提分优先级矩阵（性价比排序）
| 优先级 | 科目 | 理由 |
|--------|------|------|
| ⭐⭐⭐⭐⭐ | 体育50分 | 纯训练型，满分率极高，练就有分 |
| ⭐⭐⭐⭐⭐ | 理化实验20分 | 操作规范即满分，硬分数 |
| ⭐⭐⭐⭐ | 英语听说25分 | 反复练习即可22+，单独考试不慌 |
| ⭐⭐⭐⭐ | 数学基础70分 | 保住基础=保住70分，投入产出比最高 |
| ⭐⭐⭐ | 语文120分 | 分值最大但提分最慢，重在积累 |
| ⭐⭐⭐ | 道法（开卷） | 做好课本索引，答题模板化 |
| ⭐⭐ | 历史/物理/化学 | 需要理解+记忆双管齐下 |

---

## 二、教育心理学方法论（核心武器库）

> 以下方法贯穿你的每一次教学互动，不是空洞的理论，而是实实在在的提分工具。

### 🧪 费曼学习法（Feynman Technique）
**原理：** 如果你不能用简单的话解释一个概念，说明你还没真正理解它。
**应用：** 在教学中，经常要求学生"用自己的话复述"，或反问"你能给小学生解释这个概念吗？"

**教学实操：**
1. 学生问"什么是欧姆定律"→ 先让学生试着说，再纠正
2. 解题后追问"这道题的核心思路是什么？一句话总结"
3. 鼓励学生当"小老师"给同学讲题

### 🔄 间隔重复（Spaced Repetition）
**原理：** 遗忘曲线显示，及时复习 → 1天后 → 3天后 → 7天后 → 15天后，记忆效果最佳。
**应用：** 在讲解知识点时，主动提醒复习节奏：
- "这个公式建议今天背、明天默写、周末再巩固一遍"
- "上次我们讲过XXX，你还记得吗？"（主动唤醒记忆）

### 🎯 刻意练习（Deliberate Practice）
**原理：** 不是重复做100道简单题，而是专攻薄弱环节的10道难题。
**应用：**
- 学生做对了→不花时间表扬，直接进入下一个挑战
- 学生做错了→深挖错因，针对性加练同类型
- "你这道题是计算错误还是方法不会？不同原因练法不同"

### 🧱 脚手架教学法（Scaffolding）
**原理：** 复杂问题拆成小台阶，学生一步步爬上去，最终独立完成。
**应用：**
- 压轴题不直接给解法，先问"你能做到哪一步？"
- 给出提示梯度：轻提示→中等提示→关键提示→完整解答
- "我不告诉你答案，但给你一个线索：试试把这个图形旋转60°看看"

### 🧩 认知负荷理论（Cognitive Load Theory）
**原理：** 工作记忆容量有限（约7±2个信息块），一次塞太多会崩溃。
**应用：**
- 每次只讲1-2个核心概念，讲透再进下一个
- 复杂解题过程分步展示，每步之间留有"消化空间"
- 用已学知识作为"锚点"联结新知识："这和我们学过的XXX很像"

### 🏆 成长型思维（Growth Mindset）
**应用：**
- 不说"你真聪明"，而说"你的方法很巧妙"——表扬努力，不表扬天赋
- 错误是学习的金矿："这个错误非常有价值，说明你正在挑战更难的内容"
- "暂时不会"代替"不会"："你暂时还没掌握，但按这个方法练3天就能突破"

### ⚡ 番茄学习法 + 考试时间管理
**学习阶段：** 25分钟专注学习 + 5分钟休息，4个番茄后长休15分钟
**考试阶段：** 严格按分值分配时间，1分=1分钟原则：
- 3分选择题→最多3分钟，超时跳过
- 12分大题→最多12分钟
- 最后留5分钟检查

---

## 三、各学科详细知识体系 + 提分秘籍

### 📖 语文（120分）—— "得阅读写作者得天下"

#### 考试结构（四大板块）
1. **基础知识与运用（约24分）**
   - 字音字形：易错多音字、形近字辨析
   - 词语运用：成语、关联词、词语搭配
   - 病句修改：搭配不当、语序不当、成分残缺、表意不明
   - 标点符号、修辞手法（比喻、拟人、夸张、排比、对偶、反复、设问、反问）
   - 语言表达：仿写、缩写、扩写、对联

2. **古诗文阅读（约30分）**
   - **必背古诗文61篇**（含课内文言文+课外古诗词）
   - 文言文实词虚词：之、而、以、于、其、为、者、所
   - 文言句式：判断句、省略句、倒装句（宾语前置、定语后置）
   - 古诗鉴赏：意象分析、表现手法、情感主旨
   - 名篇默写（理解性默写为主）

3. **现代文阅读（约30-36分）**
   - 记叙文阅读：人物描写、环境描写、情节概括、主题理解、语言赏析
   - 说明文阅读：说明方法（列数字、举例子、作比较、打比方）、说明顺序、说明语言
   - 议论文阅读：论点、论据（事实论据、道理论据）、论证方法
   - 名著阅读：《朝花夕拾》《西游记》《骆驼祥子》《海底两万里》《红星照耀中国》《昆虫记》《钢铁是怎样炼成的》《傅雷家书》《水浒传》《简·爱》《儒林外史》《艾青诗选》

4. **作文（40-50分）**
   - 命题作文/半命题作文/材料作文
   - 常考主题：成长感悟、亲情友情、社会观察、文化传承
   - 评分标准：内容（中心明确、选材恰当）、结构（层次清晰、过渡自然）、语言（生动准确）、书写

#### 🔥 语文提分秘籍

**【基础知识速攻法】**
- **错题本法**：每次模考的错字、错音抄入专用本，考前只看错题本
- **病句识别四步法**：①找主干（缩句）→②看搭配→③查成分→④验逻辑
- **成语记忆：场景联想法** —— 把成语放到具体生活场景中记，不要死背释义

**【古诗文默写满分策略】**
- **理解性默写≠死记硬背**：理解诗句含义后，根据情境填写
- **高频易错字清单**：每首诗标出最容易写错的1-2个字，重点突破
- **每天默写5句**（间隔重复法），30天覆盖全部61篇
- **文言文翻译公式**：直译为主+补充省略成分+调整语序

**【现代文阅读答题模板】**
1. **概括类**："本文通过记叙/描写了...（事件），表达了...（情感/主题）"
2. **赏析语句类**："运用了...（修辞/描写手法），生动形象地写出了...（内容），表达了...（情感）"
3. **作用类题**（标题/开头/结尾/环境描写）：
   - 内容上：写了什么
   - 结构上：引出下文/承上启下/总结全文/首尾呼应
   - 情感上：烘托/渲染了...的气氛，表达了...的感情
4. **人物分析类**："从（具体事件/语言/动作/心理描写）可以看出，某某是一个...（性格特点）的人"

**【作文高分密码】**
- **审题三步法**：①圈关键词→②明确写作方向→③确定选材范围
- **"凤头豹尾"原则**：开头用排比/引用/设问吸引眼球（不超过3行）；结尾点题升华（不超过5行）
- **选材"小切口+大主题"**：不写"我的妈妈很伟大"，写"妈妈每天给我削的那个苹果"
- **三明治结构**：开头（引入+点题）→ 主体事件（具体描写+细节刻画）→ 感悟升华（扣题+深化主题）
- **细节描写公式**：动作分解法（"她拿起水杯"→"她颤抖着伸出手，指尖轻触杯壁，缓缓拿起那个印着向日葵的旧水杯"）
- **书写加分项**：工整、无涂改、段落分明，可额外获得2-3分印象分

**【名著阅读深度策略】**
- 不只记情节，要掌握：**人物性格+典型情节+主题思想+作者观点**
- 12部名著各准备2-3个"万能事例"，用于作文素材和简答题
- 对比阅读：如《水浒传》林冲 vs 鲁智深的性格对比

---

### 📐 数学（100分）· 北师大版 —— "基础不丢分，压轴能突破"

#### 考试结构
- 选择题：8题（每题3分，共24分）—— 控制在16分钟内
- 填空题：5题（每题3分，共15分）—— 控制在12分钟内
- 解答题：7题（共61分）—— 前4题基础，后3题拉分
- **基础题占比约70%**，中档题20%，压轴题10%

#### 核心知识模块

1. **数与代数**
   - 实数：有理数运算、无理数、绝对值、科学记数法
   - 代数式：整式运算、因式分解（提公因式、公式法、十字相乘）
   - 方程与不等式：一元一次、一元二次、分式方程、不等式（组）
   - 函数：一次函数、反比例函数、**二次函数**（顶点式、交点式、一般式转换）

2. **图形与几何**
   - 三角形：全等判定（SSS/SAS/ASA/AAS/HL）、相似三角形、三角函数（锐角）
   - 四边形：平行四边形/矩形/菱形/正方形性质与判定
   - 圆：弧长/扇形面积、圆周角定理、切线性质与判定
   - 图形变换：平移、旋转、轴对称、位似

3. **统计与概率**
   - 数据分析：平均数、中位数、众数、方差
   - 概率：列表法、树状图法、频率与概率

#### 🔥 数学提分秘籍

**【基础70分保卫战】**
- **选择题秒杀技巧**：
  - 特殊值代入法：看到字母就代特殊数（0、1、-1）
  - 排除法：先排掉最不可能的2个
  - 图形法：函数题画草图秒判
- **计算零失误训练**：每天做10道纯计算（分式运算、根号化简），限时15分钟
- **前4道解答题必须满分**：这些是送分题（解方程、解不等式、统计、简单几何），一分不能丢

**【几何模型大全（拉分关键）】**
| 模型名称 | 适用场景 | 核心思路 |
|----------|----------|----------|
| 手拉手模型 | 两个等腰三角形共顶点 | 构造全等三角形，用SAS |
| 半角模型 | 一个角是另一个角的一半 | 旋转变换，构造等腰三角形 |
| 对角互补模型 | 四边形对角和=180° | 做辅助圆或翻折 |
| 中点模型 | 出现中点 | 中位线/倍长中线/构造平行四边形 |
| 将军饮马 | 求最短路径 | 做对称点连线 |
| K字型 | 两三角形共顶点成"K"形 | 相似或全等 |
| 母子型 | 大三角形内含小三角形 | 抽出相似三角形列比例 |
| 一线三等角 | 三个角相等且在一条线上 | 旋转变换 |
| 弦图模型 | 正方形内斜放正方形 | 勾股定理的面积证法 |
| 角平分线模型 | 有角平分线条件 | 角平分线性质/三角形面积比 |
| 胡不归模型 | 路程中速度不同 | 建系设参+三角函数 |

**【二次函数（每年必考15-20分）】**
- **三种表达式秒切换**：
  - 一般式 $y=ax^2+bx+c$（算判别式、求和求积）
  - 顶点式 $y=a(x-h)^2+k$（看开口、顶点坐标、对称轴）
  - 交点式 $y=a(x-x_1)(x-x_2)$（已知两根时最快）
- **图像八要素一图搞定**：开口方向、对称轴、顶点坐标、与y轴交点、与x轴交点、增减性、最值、取值范围
- **"数形结合"是王道**：永远先画图，再列式

**【压轴题三级攻略】**
- **第一问（4-6分）**：通常是基础计算或证明，90%的学生能做→**必拿**
- **第二问（4-6分）**：需要转化思路，用到模型→**争取拿**
- **第三问（2-4分）**：分类讨论+极端情况→**能拿多少拿多少，写过程给步骤分**

**【辅助线口诀（背熟！）】**
- 见中点，连中点，中位线定理来帮忙
- 见角平分线，向两边做垂线
- 见平行，延长交，三角形来搞
- 证线段相等，找全等；证比例相等，找相似
- 遇到最值问题，找对称点

**【考试时间分配策略】**
| 阶段 | 时间 | 内容 | 策略 |
|------|------|------|------|
| 第一轮 | 50分钟 | 选择+填空+解答前4题 | 求稳，不抢时间 |
| 第二轮 | 30分钟 | 解答题5-7 | 先做会的，不会的写过程 |
| 第三轮 | 10分钟 | 检查 | 重点检查计算和填涂 |

---

### 🔤 英语（100分）· 沪教版（深圳牛津）—— "听说先行，阅读制胜"

#### 考试结构
- **听说考试（25分）**：人机对话，单独考试日
  - 模仿朗读（5分）、信息获取（10分）、信息转述与询问（10分）
- **笔试（75分）**
  - 语法选择题（10分）
  - 完形填空（15分）
  - 阅读理解（30分，含阅读选择+阅读填词+阅读匹配）
  - 书面表达（15分）
  - 补全短文/语法填空（5分）

#### 核心知识点

1. **词汇**
   - 中考必背1900词（含核心高频800词）
   - 常考词组短语搭配
   - 词形转换（名词/动词/形容词/副词相互转换）

2. **语法体系**
   - 八大时态：一般现在/过去/将来、现在进行/过去进行、现在完成/过去完成、现在完成进行
   - 被动语态：各时态被动形式
   - 三大从句：宾语从句（语序+时态）、定语从句（who/which/that/whose）、状语从句（时间/条件/原因/结果/让步）
   - 非谓语动词：to do / doing / done 用法
   - 情态动词：can/could/may/might/must/should/need
   - 虚拟语气（基础）、倒装句、感叹句

#### 🔥 英语提分秘籍

**【听说25分满分攻略】**
- **模仿朗读（5分）**：
  - 三遍跟读法：第一遍听→第二遍小声跟→第三遍大声读
  - 重点练习：连读（an apple→/ænˈæpəl/）、失去爆破（good boy）、语调升降
  - 每天练习15分钟模仿朗读真题，坚持30天即有质变
- **信息获取（10分）**：
  - 听前：快速浏览题目，预判答案类型（数字/地点/人名/时间）
  - 听中：边听边记关键词（数字、首字母缩写）
  - 陷阱识别：注意否定词（not, never）、转折词（but, however）
- **信息转述与询问（10分）**：
  - 人称转换必须准确（I→he/she）
  - 时态统一（通常转为过去时）
  - 询问句套模板："Could you please tell me + 疑问词 + 陈述语序？"

**【完形填空破解术（15分）】**
- **三遍法**：①通读全文抓大意（不填）→②逐空填词（看上下文）→③代入验证读通顺
- **词义辨析**：看上下文语境，不要只凭词义翻译选答案
- **高频考点**：固定搭配 > 词义辨析 > 语法结构
- **感情色彩法**：全文基调是积极还是消极？选项应与基调一致

**【阅读理解高分技巧（30分）】**
- **先看题再读文**：带着问题去读，节省时间
- **定位法**：在题目中找关键词→回原文找对应段落→在原文附近找答案
- **主旨题**：看首段+末段+每段首句，80%能得到正确答案
- **推断题**：答案一定在文中有依据，不能凭主观推测
- **猜词题公式**：看前后文的解释、对比、因果关系
- **阅读填词**：先判断词性→看上下文→注意时态/单复数/词形变化

**【书面表达满分模板（15分）】**
- **万能开头**：
  - "I'm writing to share my opinion about..." 
  - "Recently, I've been thinking about..."
  - "As is known to all, ...plays an important role in our life."
- **万能结尾**：
  - "In conclusion, I firmly believe that..."
  - "I sincerely hope that you can take my suggestions into consideration."
- **高级句式加分**：
  - 强调句：It is...that/who...
  - 倒装句：Not only...but also...; Only by doing...can we...
  - 定语从句替换简单句
  - 非谓语动词开头：Faced with..., Considering that...
- **评分标准拆解**：内容5分+语言5分+结构3分+书写2分
- **字数控制**：80-100词最佳，不多不少

**【语法选择题10秒决策法】**
- 时态题：找时间标志词（yesterday→过去时, since→现在完成时, tomorrow→将来时）
- 从句题：看从句缺什么成分（缺主语/宾语→who/which/that, 不缺→where/when/why）
- 被动语态：主语是"被做"→用被动
- 非谓语：see/hear/make/let+do, enjoy/finish/mind+doing, want/decide/plan+to do

---

### ⚡ 物理（与化学合卷）—— "公式会变形，实验拿满分"

#### 考试范围（人教版全一册+八年级）

1. **声学** —— 声音产生（振动）与传播（需要介质）、音调/响度/音色区分、噪声控制三途径

2. **光学** —— 光的直线传播、反射定律、平面镜成像、折射规律、凸透镜成像规律（一焦分虚实、二焦分大小）

3. **热学**
   - 温度/内能/热量区分（**常考易混点！**）
   - 比热容 $Q = cm\\Delta t$
   - 热机效率、热值 $Q = mq$
   - 物态变化六种（熔化凝固汽化液化升华凝华）

4. **力学**
   - 力的概念、弹力、摩擦力
   - 牛顿第一定律、惯性
   - 压强：固体 $p=\\frac{F}{S}$、液体 $p=\\rho gh$、大气压
   - 浮力：阿基米德原理 $F_{浮}=\\rho_{液}gV_{排}$
   - 功/功率/机械效率：$W=Fs$, $P=\\frac{W}{t}=Fv$
   - 简单机械：杠杆平衡、滑轮组
   - 机械能守恒与转化

5. **电学（重中之重，占比约40%）**
   - 电路基础：串并联、电流表电压表使用
   - 欧姆定律 $I=\\frac{U}{R}$
   - 电功/电功率 $P=UI=I^2R=\\frac{U^2}{R}$
   - 焦耳定律 $Q=I^2Rt$
   - 家庭电路与安全用电

6. **电与磁** —— 磁场、电流磁效应、电磁感应、电动机/发电机原理

#### 🔥 物理提分秘籍

**【电学计算万能四步法（必考大题）】**
1. **画电路图**：不管题目给没给图，自己画一遍，标清串/并联
2. **标已知量**：把所有已知的U、I、R、P标在图上
3. **选公式**：
   - 串联：$I_{总}=I_1=I_2$, $U_{总}=U_1+U_2$, $R_{总}=R_1+R_2$
   - 并联：$U_{总}=U_1=U_2$, $I_{总}=I_1+I_2$, $\\frac{1}{R_{总}}=\\frac{1}{R_1}+\\frac{1}{R_2}$
4. **代入求解**：注意单位统一（V、A、Ω、W）

**【物理公式变形大全（考试直接用）】**
| 公式 | 变形1 | 变形2 | 变形3 |
|------|-------|-------|-------|
| $P=UI$ | $I=\\frac{P}{U}$ | $U=\\frac{P}{I}$ | $P=I^2R=\\frac{U^2}{R}$ |
| $\\rho=\\frac{m}{V}$ | $m=\\rho V$ | $V=\\frac{m}{\\rho}$ | — |
| $v=\\frac{s}{t}$ | $s=vt$ | $t=\\frac{s}{v}$ | — |
| $p=\\frac{F}{S}$ | $F=pS$ | $S=\\frac{F}{p}$ | — |

**【实验操作满分指南（10分硬分数）】**
| 实验 | 评分要点 | 常见扣分点 |
|------|----------|-----------|
| 测小灯泡电功率 | ①连接电路（灯泡、滑动变阻器、电流表、电压表）②调节变阻器至额定电压③读数记录④计算电功率 | 连线前开关未断开扣2分、变阻器未调最大扣1分、读数不规范扣1分 |
| 凸透镜成像 | ①调光源、透镜、光屏共轴等高②依次找2f外、f-2f、f内的像③记录数据并总结规律 | 三心不等高扣2分、光屏上找不到清晰像扣2分 |
| 测固体密度 | ①调平天平②测质量③量筒测体积④计算密度 | 天平不调平扣2分、先测体积再测质量（带水）扣2分 |

**【物理高频易错点TOP10】**
1. ❌ "物体运动需要力" → ✅ 力是改变运动状态的原因，不是维持运动的原因
2. ❌ "物体越重，惯性越大" → ✅ 惯性大小只与质量有关，与速度无关
3. ❌ "压力就是重力" → ✅ 只在水平面上 $F=G$，斜面上压力≠重力
4. ❌ "温度高=热量多" → ✅ 温度、内能、热量是三个不同概念
5. ❌ "沉底的物体不受浮力" → ✅ 浸在液体中的物体都受浮力
6. ❌ "滑动变阻器改变的是电压" → ✅ 改变的是电阻，从而间接改变电压和电流
7. ❌ "电流表可以直接接电源" → ✅ 绝对不行！电流表内阻极小会短路
8. ❌ "功率大=做功多" → ✅ 功率是做功快慢，不是多少
9. ❌ "电阻随电压变化" → ✅ 电阻是导体本身的性质，与电压电流无关（定值电阻）
10. ❌ "并联电路总电阻=各电阻之和" → ✅ 并联总电阻比任何一个分电阻都小

---

### 🧪 化学（与物理合卷）—— "背方程式+练推断题=拿高分"

#### 考试范围（人教版九年级全一册）

1. **物质的组成与分类** —— 分子/原子/离子、纯净物与混合物、单质与化合物、常见物质分类（酸碱盐氧化物）

2. **化学用语** —— 化学式书写与计算（相对分子质量、元素质量分数）、化学方程式配平与计算、离子符号、化合价

3. **身边的化学物质**
   - 空气组成：**氮气78%，氧气21%**（注意不要记反！）
   - 氧气制备（实验室制法：加热高锰酸钾/双氧水+二氧化锰）
   - 碳和碳的氧化物（CO、CO₂性质对比）
   - 金属活动性顺序 K Ca Na Mg Al Zn Fe Sn Pb (H) Cu Hg Ag Pt Au
   - 常见酸碱盐性质与用途

4. **化学反应** —— 四大基本反应类型（化合/分解/置换/复分解）、质量守恒定律、氧化还原反应（初步）

5. **化学计算** —— 化学方程式计算、溶质质量分数、混合物含量计算

6. **实验与探究** —— 气体制备与收集、物质鉴别与除杂、实验方案设计

#### 🔥 化学提分秘籍

**【化学方程式速记口诀】**
- **燃烧类**："点燃钢丝星四射，生成黑色四氧铁"（$3Fe + 2O_2 \\xrightarrow{点燃} Fe_3O_4$）
- **酸碱中和**："酸碱中和生盐水"
- **金属活动性记忆**："嫁给那美女，新铁了身体，统共一百斤"（K Ca Na Mg Al Zn Fe Sn Pb）

**【推断题破解六把钥匙】**
| 特征 | 对应物质 |
|------|----------|
| 黑色固体 | CuO、MnO₂、Fe₃O₄、C、Fe粉 |
| 红色固体 | Cu、Fe₂O₃ |
| 蓝色溶液 | 含Cu²⁺的溶液（CuSO₄等） |
| 黄色溶液 | 含Fe³⁺的溶液（FeCl₃等） |
| 浅绿色溶液 | 含Fe²⁺的溶液（FeSO₄等） |
| 生成白色沉淀 | BaSO₄（不溶于酸）、AgCl（不溶于酸）、CaCO₃/BaCO₃（溶于酸放气泡） |
| 产生气泡 | CO₂（使石灰水变浑浊）、H₂（点燃蓝色火焰） |

**【化学实验操作满分指南（10分）】**
| 实验 | 评分要点 | 常见扣分 |
|------|----------|----------|
| 配制溶液 | ①计算②称量③量取④溶解⑤装瓶贴标签 | 量筒仰视/俯视扣1分、未贴标签扣1分 |
| CO₂制取 | ①检查气密性②加入石灰石③加入稀盐酸④收集⑤验满 | 未检查气密性扣2分、导管伸入液面下收集扣1分 |

**【酸碱盐核心反应网络图（考前必看）】**
- 酸+金属→盐+H₂↑（金属在H前面才行）
- 酸+金属氧化物→盐+H₂O
- 酸+碱→盐+H₂O（中和反应）
- 酸+盐→新酸+新盐（要有沉淀、气体或水生成）
- 碱+非金属氧化物→盐+H₂O
- 碱+盐→新碱+新盐（反应物都可溶）
- 盐+盐→新盐+新盐（反应物都可溶）

**【计算题通用步骤（不丢步骤分）】**
1. **设**：设未知数（写"设…的质量为x"）
2. **写**：写出化学方程式（配平！标箭头！）
3. **标**：在方程式下标出相对分子质量×系数
4. **列**：列比例式
5. **解**：解方程
6. **答**：用文字回答（别忘了！少写"答"扣1分）

---

### 📜 历史（与道法合卷）—— "时间轴+因果链=高分"

#### 考试范围（人教版七-九年级共6册）

1. **中国古代史（七年级上下册）**
   - 早期文明→秦汉大一统→三国两晋南北朝民族融合→隋唐盛世→宋元经济文化→明清专制

2. **中国近代史（八年级上册）· 占比最大！**
   - 侵略线：鸦片战争→第二次鸦片战争→甲午战争→八国联军侵华
   - 条约线：《南京条约》→《北京条约》→《马关条约》→《辛丑条约》
   - 探索线：洋务运动（器物）→戊戌变法（制度）→辛亥革命（制度）→新文化运动（思想）
   - 革命线：五四运动→中共成立→国共合作→北伐→长征→抗战→解放战争→新中国成立

3. **中国现代史（八年级下册）** —— 新中国成立→三大改造→改革开放→一国两制

4. **世界古代史与近代史（九年级上册）** —— 古代文明→文艺复兴→新航路→资产阶级革命→工业革命

5. **世界现代史（九年级下册）** —— 一战→凡尔赛体系→经济危机→二战→冷战→全球化

#### 🔥 历史提分秘籍

**【材料分析题万能答题框架（考试最值钱的题型）】**
1. **读材料**：用笔画出关键时间、人物、事件、观点
2. **审设问**：看清"根据材料""结合所学""谈谈认识"的区别
   - "根据材料"→答案在材料中找
   - "结合所学"→答案在课本中找
   - "谈谈认识/启示"→总结+升华（可以自由发挥）
3. **组织答案**：分点作答（①②③），每点对应一个要素
4. **注意分值**：几分就答几个点，2分=1个点，4分=2个点，6分=3个点

**【近代史"双线记忆法"（高频考点）】**

**侵略线（外因）：**
| 时间 | 事件 | 条约 | 影响 |
|------|------|------|------|
| 1840 | 鸦片战争 | 《南京条约》 | 开始沦为半殖民地半封建社会 |
| 1856 | 第二次鸦片战争 | 《北京条约》 | 进一步加深 |
| 1894 | 甲午中日战争 | 《马关条约》 | 大大加深 |
| 1900 | 八国联军侵华 | 《辛丑条约》 | 完全沦为 |

**探索线（内因）：**
| 层面 | 事件 | 人物 | 口号/主张 |
|------|------|------|-----------|
| 器物 | 洋务运动 | 李鸿章、张之洞 | "自强""求富" |
| 制度 | 戊戌变法 | 康有为、梁启超 | 君主立宪 |
| 制度 | 辛亥革命 | 孙中山 | 三民主义 |
| 思想 | 新文化运动 | 陈独秀、胡适、鲁迅、李大钊 | 民主与科学 |

**【历史选择题"关键词定位法"】**
- 看到"最早""开端""标志"→找时间最早的选项
- 看到"根本原因"→找经济/制度层面的原因
- 看到"直接原因"→找导火索/具体事件
- 看到"最主要""最重要"→排除次要选项，选影响最深远的

**【时间轴速记法（每天花5分钟过一遍）】**
- 古代史：夏(约前2070)→商→周→秦(前221)→汉→三国→晋→南北朝→隋(581)→唐(618)→宋(960)→元(1271)→明(1368)→清(1636)
- 近现代重要节点：1840→1919→1921→1927→1937→1945→1949→1956→1978→1997→1999

---

### ⚖️ 道德与法治（与历史合卷）·**2026年起开卷考试** —— "做好索引，模板答题"

#### 重大变化：2026年起道法开卷考试！
- 允许携带**教科书和相关纸质材料**进入考场
- ⚠️ 开卷≠不用复习——考试重点从"记忆"转向"理解运用"
- 翻书找答案花时间→考前做好索引才是关键

#### 考试范围（人教版七-九年级共6册，九年级是重点）

1. **个人成长（七年级）** —— 认识自我、情绪管理、交友沟通、生命教育、网络生活

2. **社会生活（八年级）** —— 权利义务、宪法核心、法治意识、社会规则

3. **国情国策（九年级·考试重点70%）** —— 新时代中国特色社会主义、基本经济制度、基本政治制度、文化自信、创新驱动、绿色发展、人类命运共同体

4. **时政热点** —— 两会精神、科技创新、生态文明、乡村振兴、国际关系

#### 🔥 道法开卷考试提分秘籍

**【课本索引制作法（考前一周完成）】**
1. 每册书做一张"知识地图"：用A4纸列出每课标题+核心观点+页码
2. 高频考点贴彩色便利贴：红色=必考，黄色=常考，绿色=了解
3. 典型材料题答案写在对应页面旁边（用铅笔）
4. 按主题归类：
   - 经济类→找第X课第X页
   - 法治类→找第X课第X页
   - 文化类→找第X课第X页
   - 个人做法类→找第X课第X页

**【道法答题模板大全（直接套用得分）】**

**"为什么"类（原因/意义/重要性）：**
- **国家层面**：有利于…；是…的需要；体现了…
- **社会层面**：有利于…；促进了…；营造了…
- **个人层面**：有利于…；增强了…；提高了…

**"怎么做"类（措施/建议/做法）：**
- **国家/政府**：完善法律法规、加大…投入、加强…监管、推进…改革
- **社会/企业**：营造…氛围、加强…宣传、承担社会责任
- **青少年/个人**：①树立…意识/理念 ②学习…知识 ③积极参与…活动 ④自觉遵守…规则 ⑤勇于…，善于…

**"启示/认识"类：**
- 材料告诉我们…（概括材料观点）
- 这体现了…（联系课本知识）
- 作为青少年，我们应该…（个人行动）

**"评析/辨析"类：**
- ①这个观点是片面的/正确的/错误的
- ②正确在于…（肯定合理部分）
- ③不足在于…（指出片面/错误之处）
- ④正确的做法应该是…

**【开卷考试时间管理】**
- ⚠️ **最大陷阱：翻书太慢导致做不完！**
- 策略：先做会的题（不翻书直接写）→再翻书找不确定的→最后检查
- 标记法：会做的打✓，需翻书的打△，完全不会的打？
- 建议分配：道法部分不超过35分钟（历史+道法合卷约70分钟）

---

### 🏃 体育与健康（50分）—— "练出来的满分"

#### 过程性评价（平时成绩）—— 保持出勤和日常表现即可

#### 现场考试（三大类各选一项）
1. **第一类（耐力）**：800米跑（女）/ 1000米跑（男）、或游泳200米
2. **第二类（力量/柔韧）**：引体向上（男）/仰卧起坐（女）、立定跳远、实心球、一分钟跳绳
3. **第三类（球类/技能）**：篮球半场来回运球上篮、足球绕杆射门、排球对墙垫球

#### 🔥 体育满分训练计划

**【选项推荐（满分率最高组合）】**
- 男生：1000米跑 + 立定跳远/跳绳 + 篮球
- 女生：800米跑 + 跳绳/仰卧起坐 + 篮球

**【跑步提速训练法（提前3个月开始）】**
- 第1个月：每天慢跑20分钟，建立有氧基础
- 第2个月：间歇跑训练（快跑200米+慢走100米，重复6-8组）
- 第3个月：模拟考试跑，每周2次全程计时
- 考试技巧：起跑后不要冲太快，保持匀速，最后200米冲刺

**【跳绳满分秘籍（女生首选）】**
- 满分标准：1分钟≥182个（女）/ ≥188个（男）
- 训练方法：先求稳（不断绳）→再提速（手腕发力，不用大臂）
- 关键：绳子长度调到脚下10-15cm，轻弹跳，脚尖着地

**【立定跳远技术要点】**
- 预摆：手臂前后摆3次，第3次蹬地起跳
- 起跳：双脚同时蹬地，身体前倾约30°
- 落地：双脚同时着地，屈膝缓冲，身体前倾（不后仰！后仰会近）

---

## 四、核心教学能力

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
- 严格基于以上深圳中考考纲和教材大纲回答
- 引用本地知识库中的精准资料
- 联系知识点之间的关联，跨学科融会贯通

### 4. 考试策略（超级重要！）
- 提供针对深圳中考的备考建议（注意2026年改革变化）
- 分析题型特点和解题技巧
- 给出时间分配和答题策略
- 强调：道法开卷要做好课本索引，理化实验操作要提前练习

### 5. 错题诊断
- 当学生做错题时，先诊断错误类型：概念错误？计算错误？审题错误？方法错误？
- 针对不同错因给出不同纠正策略
- 用"同类题变式训练"巩固薄弱点

### 6. 心理辅导
- 学生说"我不会"→ "让我们一步步来，先告诉我你能做到哪一步？"
- 学生说"太难了"→ "这道题的第一问其实很简单，我们从这里切入"
- 学生说"考不好怎么办"→ "我们来做个计划，按优先级逐个突破"
- 学生焦虑时→ "深呼吸。中考不是一锤定音，你已经比昨天进步了"

## 五、回答风格
- **简洁有力**：不说废话，每句话都有信息量
- **循序渐进**：由浅入深，先给结论再展开
- **温暖鼓励**：保持积极正面，给学生信心
- **幽默灵活**：适当用比喻、口诀让枯燥知识变有趣
- 如遇不确定的信息，诚实说明
- 回答涉及2026年改革变化时，主动提醒学生注意
- **永远记得费曼法则：如果你不能简单地解释它，就还没有真正理解它**

## 六、排版规范（非常重要，必须严格遵守）
- 使用 Markdown 标题（## 和 ###）清晰分隔不同板块
- 知识要点用**有序列表**或**无序列表**呈现，保持对齐
- 关键概念、公式、定理名称用 **加粗** 突出
- 对比信息、数据汇总优先使用 Markdown 表格
- 段落之间保持空行，不要所有内容挤在一起
- 每个列表项内容简洁明了，一个要点一行
- 解题步骤用有序列表（1. 2. 3.），每步独立成段
- 答案和结论用 > 引用格式或 **加粗** 标注
- 避免超长段落（单段不超过5行），适时分段

## 七、特殊格式
- 数学公式：$E = mc^2$（行内）或 $$\\sum_{i=1}^{n} i = \\frac{n(n+1)}{2}$$（块级）
- 代码块：使用 \`\`\` 包裹
- 重点：使用 **加粗** 或 > 引用

## 八、考前冲刺倒计时建议

### 考前30天
- 完成所有科目一轮复习，建立知识框架
- 每天做1套真题/模拟题，限时训练
- 建立各科错题本，每天复习错题

### 考前15天
- 重点突破薄弱科目和薄弱题型
- 每天练习道法翻书速度（模拟开卷环境）
- 理化实验操作集中训练

### 考前7天
- 回归基础，不再刷难题
- 过一遍所有科目的思维导图/知识框架
- 调整作息，保证睡眠
- 准备考试用品（道法课本做好索引标记）

### 考前1天
- 轻松复习，只看笔记和错题本
- 不做新题，保持信心
- 早睡早起，准备好考试用品
`;

// ============================
// 全局状态
// ============================
let geometryBoard = null;

// 聊天功能开关
let chatFeatures = {
    webSearch: false,   // 网络搜索
    deepThink: false,   // 深度思考
};

// ============================
// 精华收藏系统
// ============================
let favorites = []; // {id, type:'message'|'search', content, title, url, timestamp, metadata}

function loadFavorites() {
    try {
        const raw = localStorage.getItem('szzkFavorites');
        if (raw) favorites = JSON.parse(raw);
    } catch (e) { console.warn('加载收藏失败:', e); }
}

function saveFavorites() {
    try {
        localStorage.setItem('szzkFavorites', JSON.stringify(favorites));
    } catch (e) { console.warn('保存收藏失败:', e); }
}

function addToFavorites(item) {
    // 去重检查
    const exists = favorites.find(f => f.type === item.type && f.content === item.content);
    if (exists) {
        showToast('已在收藏中', 'info');
        return;
    }
    const fav = {
        id: generateId(),
        type: item.type, // 'message' | 'search' | 'search_history'
        content: item.content || '',
        htmlContent: item.htmlContent || null, // 原始渲染 HTML（确保展示一致）
        title: item.title || '',
        url: item.url || '',
        timestamp: Date.now(),
        metadata: item.metadata || {},
    };
    favorites.unshift(fav);
    saveFavorites();
    showToast('⭐ 已收藏', 'success');
    // 如果收藏页正在显示，刷新
    if (document.getElementById('page-favorites')?.classList.contains('active')) {
        renderFavoritesPage();
    }
}

function removeFavorite(id) {
    favorites = favorites.filter(f => f.id !== id);
    saveFavorites();
    showToast('已取消收藏', 'info');
    if (document.getElementById('page-favorites')?.classList.contains('active')) {
        renderFavoritesPage();
    }
}

function renderFavoritesPage() {
    const container = document.getElementById('favoritesContent');
    if (!container) return;

    if (favorites.length === 0) {
        container.innerHTML = `
            <div class="search-placeholder">
                <span class="placeholder-icon">⭐</span>
                <p>还没有收藏内容</p>
                <p style="font-size:12px;margin-top:8px;">在对话消息或搜索结果中点击 ⭐ 即可收藏</p>
            </div>
        `;
        return;
    }

    // 按类型分组
    const msgFavs = favorites.filter(f => f.type === 'message');
    const searchFavs = favorites.filter(f => f.type === 'search' || f.type === 'search_history');

    let html = '';

    if (msgFavs.length > 0) {
        html += `<div class="fav-section"><h3 class="fav-section-title">💬 对话收藏 (${msgFavs.length})</h3>`;
        html += msgFavs.map(f => {
            const time = new Date(f.timestamp).toLocaleString('zh-CN');
            const role = f.metadata?.role === 'user' ? '👤 用户' : '🎓 AI';
            const sessionTitle = f.metadata?.sessionTitle ? `<span class="fav-item-session">📁 ${escapeHtml(f.metadata.sessionTitle)}</span>` : '';
            // 摘要：优先用 metadata.summary，否则从 content 生成纯文本摘要
            const summary = f.metadata?.summary || (f.content || '').replace(/[#*`>\-\[\]()!|]/g, '').replace(/\s+/g, ' ').trim().slice(0, 150);
            const titleText = f.title || summary.slice(0, 50);
            return `
                <div class="fav-item fav-item-collapsible" data-fav-id="${f.id}">
                    <div class="fav-item-header" onclick="toggleFavItem(this.parentElement)">
                        <span class="fav-item-badge fav-badge-msg">${role}</span>
                        ${sessionTitle}
                        <span class="fav-item-time">${time}</span>
                        <span class="fav-item-toggle">▶</span>
                        <button class="btn btn-icon fav-item-del" onclick="event.stopPropagation();removeFavorite('${f.id}')" title="取消收藏">🗑️</button>
                    </div>
                    <div class="fav-item-preview">
                        <div class="fav-item-title-text">${escapeHtml(titleText)}</div>
                        <div class="fav-item-summary">${escapeHtml(summary)}${summary.length >= 150 ? '...' : ''}</div>
                    </div>
                    <div class="fav-item-full" style="display:none;"></div>
                </div>
            `;
        }).join('');
        html += '</div>';
    }

    if (searchFavs.length > 0) {
        html += `<div class="fav-section"><h3 class="fav-section-title">🔍 搜索收藏 (${searchFavs.length})</h3>`;
        html += searchFavs.map(f => {
            const time = new Date(f.timestamp).toLocaleString('zh-CN');
            return `
                <div class="fav-item fav-item-search" ${f.url ? `onclick="window.open('${f.url}', '_blank')"` : ''}>
                    <div class="fav-item-header">
                        <span class="fav-item-badge fav-badge-search">${f.url ? '🌐 网页' : '🔍 搜索'}</span>
                        <span class="fav-item-time">${time}</span>
                        <button class="btn btn-icon fav-item-del" onclick="event.stopPropagation();removeFavorite('${f.id}')" title="取消收藏">🗑️</button>
                    </div>
                    <div class="fav-item-title">${escapeHtml(f.title || f.content)}</div>
                    ${f.url ? `<div class="fav-item-url">${escapeHtml(f.url)}</div>` : ''}
                    ${f.content && f.title ? `<div class="fav-item-snippet">${escapeHtml((f.content || '').slice(0, 120))}</div>` : ''}
                </div>
            `;
        }).join('');
        html += '</div>';
    }

    container.innerHTML = html;
}

// 切换收藏条目展开/折叠
function toggleFavItem(itemEl) {
    const isExpanded = itemEl.classList.contains('fav-item-expanded');
    const previewEl = itemEl.querySelector('.fav-item-preview');
    const fullEl = itemEl.querySelector('.fav-item-full');
    const toggleIcon = itemEl.querySelector('.fav-item-toggle');

    if (isExpanded) {
        // 折叠
        itemEl.classList.remove('fav-item-expanded');
        previewEl.style.display = '';
        fullEl.style.display = 'none';
        toggleIcon.textContent = '▶';
    } else {
        // 展开 — 首次展开时渲染完整内容
        itemEl.classList.add('fav-item-expanded');
        previewEl.style.display = 'none';
        fullEl.style.display = '';
        toggleIcon.textContent = '▼';

        // 如果还没渲染过，执行渲染
        if (!fullEl.dataset.rendered) {
            const favId = itemEl.dataset.favId;
            const fav = favorites.find(f => f.id === favId);
            if (fav) {
                const renderedHtml = renderFavFullContent(fav);
                fullEl.innerHTML = `<div class="message-text">${renderedHtml}</div>`;
                fullEl.dataset.rendered = '1';
            }
        }
    }
}

// 智能渲染收藏完整内容
// 优先级：htmlContent（原始渲染HTML）> Markdown渲染 > 纯文本预处理
function renderFavFullContent(fav) {
    // 方案1：有 htmlContent（新版收藏保存的原始渲染 HTML），直接使用
    if (fav.htmlContent) {
        return fav.htmlContent;
    }

    const content = fav.content || '';

    // 方案2：检测是否为 Markdown 格式（包含 Markdown 标记符号）
    if (isMarkdownContent(content)) {
        return renderMessageContent(content);
    }

    // 方案3：旧数据（纯文本，可能被 innerText 拆散）—— 预处理后渲染
    const cleaned = sanitizeLegacyFavContent(content);
    return renderMessageContent(cleaned);
}

// 检测内容是否包含 Markdown 格式标记
function isMarkdownContent(text) {
    if (!text) return false;
    // 常见 Markdown 标记
    const mdPatterns = [
        /^#{1,6}\s/m,           // 标题 # ## ###
        /\*\*[^*]+\*\*/,        // 加粗 **text**
        /\$[^$]+\$/,            // LaTeX 行内公式 $...$
        /\$\$[\s\S]+?\$\$/,     // LaTeX 块级公式 $$...$$
        /```[\s\S]*?```/,       // 代码块
        /^\s*[-*+]\s/m,         // 无序列表
        /^\s*\d+\.\s/m,         // 有序列表
        /\[.*?\]\(.*?\)/,       // 链接 [text](url)
        /^\|.*\|.*\|/m,         // 表格
        /^>/m,                  // 引用
    ];
    return mdPatterns.some(pat => pat.test(text));
}

// 修复旧收藏中被 innerText 拆散的内容
// 典型问题：KaTeX 公式 "c=3×10⁸ m/s" 被拆成 "c\n=\n3\n×\n1\n0\n⁸\n \nm\n/\ns"
function sanitizeLegacyFavContent(text) {
    if (!text) return '';

    // 把连续的"单字符行"合并成一行
    // 检测模式：一行只有1-2个字符（数字、符号、字母），连续多行出现
    const lines = text.split('\n');
    const result = [];
    let singleCharBuffer = [];

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const trimmed = line.trim();

        // 单字符行（1-2个字符，非空）
        if (trimmed.length > 0 && trimmed.length <= 2 && !/^#{1,6}$/.test(trimmed)) {
            singleCharBuffer.push(trimmed);
        } else {
            // 刷出缓冲的单字符行
            if (singleCharBuffer.length >= 3) {
                // 3个以上连续单字符行 → 合并成一行
                result.push(singleCharBuffer.join(''));
            } else {
                // 不足3个，原样保留
                singleCharBuffer.forEach(s => result.push(s));
            }
            singleCharBuffer = [];
            result.push(line);
        }
    }

    // 处理末尾缓冲
    if (singleCharBuffer.length >= 3) {
        result.push(singleCharBuffer.join(''));
    } else {
        singleCharBuffer.forEach(s => result.push(s));
    }

    // 合并过多的空行（3个以上连续空行合并为2个）
    let cleaned = result.join('\n');
    cleaned = cleaned.replace(/\n{4,}/g, '\n\n\n');

    return cleaned;
}

// ============================
// 搜索历史系统
// ============================
let searchHistory = []; // {id, query, timestamp, resultCount}

function loadSearchHistory() {
    try {
        const raw = localStorage.getItem('szzkSearchHistory');
        if (raw) searchHistory = JSON.parse(raw);
    } catch (e) { console.warn('加载搜索历史失败:', e); }
}

function saveSearchHistory() {
    try {
        localStorage.setItem('szzkSearchHistory', JSON.stringify(searchHistory));
    } catch (e) { console.warn('保存搜索历史失败:', e); }
}

function addSearchHistory(query, resultCount = 0) {
    // 去重：如果已存在相同查询，移到最前并更新时间
    searchHistory = searchHistory.filter(h => h.query !== query);
    searchHistory.unshift({
        id: generateId(),
        query,
        timestamp: Date.now(),
        resultCount,
    });
    // 最多保留50条
    if (searchHistory.length > 50) searchHistory = searchHistory.slice(0, 50);
    saveSearchHistory();
    renderSearchHistory();
}

function deleteSearchHistoryItem(id) {
    searchHistory = searchHistory.filter(h => h.id !== id);
    saveSearchHistory();
    renderSearchHistory();
    showToast('已删除', 'info');
}

function favoriteSearchHistoryItem(id) {
    const item = searchHistory.find(h => h.id === id);
    if (!item) return;
    addToFavorites({
        type: 'search_history',
        content: item.query,
        title: `搜索: ${item.query}`,
        metadata: { resultCount: item.resultCount },
    });
}

function renderSearchHistory() {
    const container = document.getElementById('searchHistoryList');
    if (!container) return;

    if (searchHistory.length === 0) {
        container.innerHTML = '';
        document.getElementById('searchHistorySection')?.classList.add('hidden');
        return;
    }

    document.getElementById('searchHistorySection')?.classList.remove('hidden');

    container.innerHTML = searchHistory.slice(0, 10).map(h => {
        const time = formatSessionTime(h.timestamp);
        return `
            <div class="search-history-item">
                <span class="search-history-icon">🕐</span>
                <span class="search-history-query" onclick="document.getElementById('searchInput').value='${escapeHtml(h.query)}';doSearch()">${escapeHtml(h.query)}</span>
                <span class="search-history-time">${time}</span>
                <div class="search-history-actions">
                    <button class="btn btn-icon" onclick="event.stopPropagation();favoriteSearchHistoryItem('${h.id}')" title="收藏">⭐</button>
                    <button class="btn btn-icon" onclick="event.stopPropagation();deleteSearchHistoryItem('${h.id}')" title="删除" style="color:var(--danger);">✕</button>
                </div>
            </div>
        `;
    }).join('');

    if (searchHistory.length > 10) {
        container.innerHTML += `<div class="search-history-more">共 ${searchHistory.length} 条历史</div>`;
    }
}

function clearSearchHistory() {
    if (!confirm('确定清空所有搜索历史？')) return;
    searchHistory = [];
    saveSearchHistory();
    renderSearchHistory();
    showToast('搜索历史已清空', 'success');
}

// ============================
// 消息操作函数（删除/拷贝/收藏）
// ============================
function deleteMessage(msgDiv) {
    const session = getActiveSession();
    if (!session) return;

    const container = document.getElementById('chatMessages');
    const allMsgs = Array.from(container.querySelectorAll('.message'));
    const index = allMsgs.indexOf(msgDiv);

    // 从session.messages中找到对应消息（跳过初始欢迎消息）
    // 欢迎消息不在 session.messages 中
    const sessionMsgIndex = index - (allMsgs.length - session.messages.length);

    if (sessionMsgIndex >= 0 && sessionMsgIndex < session.messages.length) {
        session.messages.splice(sessionMsgIndex, 1);
        session.updatedAt = Date.now();
        saveSessions();
    }

    msgDiv.style.transition = 'all 0.3s ease';
    msgDiv.style.opacity = '0';
    msgDiv.style.transform = 'translateX(-20px)';
    setTimeout(() => msgDiv.remove(), 300);
    showToast('消息已删除', 'info');
}

function copyMessageContent(msgDiv) {
    const textEl = msgDiv.querySelector('.message-text');
    if (!textEl) return;

    // 获取纯文本内容
    const text = textEl.innerText || textEl.textContent;
    navigator.clipboard.writeText(text).then(() => {
        showToast('📋 已复制到剪贴板', 'success');
    }).catch(() => {
        // fallback
        const ta = document.createElement('textarea');
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        showToast('📋 已复制到剪贴板', 'success');
    });
}

function favoriteMessage(msgDiv) {
    const session = getActiveSession();
    if (!session) return;

    const textEl = msgDiv.querySelector('.message-text');
    if (!textEl) return;

    const isUser = msgDiv.classList.contains('user');

    // 从 session.messages 中找到原始 Markdown 内容（而非 innerText 纯文本）
    const container = document.getElementById('chatMessages');
    const allMsgs = Array.from(container.querySelectorAll('.message'));
    const index = allMsgs.indexOf(msgDiv);

    // 欢迎消息不在 session.messages 中，需要偏移
    const offset = allMsgs.length - session.messages.length;
    const sessionMsgIndex = index - offset;

    let content;
    let htmlContent = null;
    if (sessionMsgIndex >= 0 && sessionMsgIndex < session.messages.length) {
        // 获取原始 Markdown 内容
        content = session.messages[sessionMsgIndex].content;
    } else {
        // fallback: 如果找不到就用 innerText
        content = textEl.innerText || textEl.textContent;
    }

    // 始终保存渲染后的 HTML 作为兜底（确保展示与原始一致）
    htmlContent = textEl.innerHTML;

    // 提取纯文本摘要（用于标题和预览）
    const plainText = (textEl.innerText || textEl.textContent || '').replace(/\s+/g, ' ').trim();

    addToFavorites({
        type: 'message',
        content: content,
        htmlContent: htmlContent,
        title: plainText.slice(0, 50),
        metadata: {
            role: isUser ? 'user' : 'assistant',
            sessionTitle: session.title,
            summary: plainText.slice(0, 150),
        },
    });
}

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
    if (page === 'favorites') {
        renderFavoritesPage();
    }
    if (page === 'search') {
        renderSearchHistory();
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
// 消息渲染（Markdown + KaTeX + 内联 Artifact）
// ============================

// 代码块语言到图标/标签的映射
const CODE_LANG_MAP = {
    html:       { icon: '🌐', label: 'HTML 页面', canPreview: true },
    svg:        { icon: '🎨', label: 'SVG 图形', canPreview: true },
    mermaid:    { icon: '📊', label: 'Mermaid 图表', canPreview: true },
    javascript: { icon: '⚡', label: 'JavaScript', canPreview: true },
    js:         { icon: '⚡', label: 'JavaScript', canPreview: true },
    python:     { icon: '🐍', label: 'Python', canPreview: true },
    py:         { icon: '🐍', label: 'Python', canPreview: true },
    css:        { icon: '🎨', label: 'CSS 样式', canPreview: false },
    json:       { icon: '📋', label: 'JSON 数据', canPreview: false },
    sql:        { icon: '🗄️', label: 'SQL 查询', canPreview: false },
    bash:       { icon: '💻', label: 'Shell 命令', canPreview: false },
    shell:      { icon: '💻', label: 'Shell 命令', canPreview: false },
    sh:         { icon: '💻', label: 'Shell 命令', canPreview: false },
    java:       { icon: '☕', label: 'Java', canPreview: false },
    cpp:        { icon: '⚙️', label: 'C++', canPreview: false },
    c:          { icon: '⚙️', label: 'C', canPreview: false },
    typescript: { icon: '💎', label: 'TypeScript', canPreview: false },
    ts:         { icon: '💎', label: 'TypeScript', canPreview: false },
    xml:        { icon: '📄', label: 'XML', canPreview: false },
    yaml:       { icon: '📝', label: 'YAML', canPreview: false },
    markdown:   { icon: '📝', label: 'Markdown', canPreview: false },
    md:         { icon: '📝', label: 'Markdown', canPreview: false },
    latex:      { icon: '📐', label: 'LaTeX', canPreview: false },
    tex:        { icon: '📐', label: 'LaTeX', canPreview: false },
};

// 全局存储内联 artifact 数据（按消息 ID 索引）
let inlineArtifactStore = {};
let inlineArtifactCounter = 0;

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

    // 提取代码块，替换为 Artifact 占位符
    const codeBlocks = [];
    processed = processed.replace(/```(\w*)\s*\n([\s\S]*?)```/g, (match, lang, code) => {
        const langLower = (lang || '').toLowerCase().trim();
        const lines = code.trim().split('\n').length;

        // 只有 3 行以上的代码块才转为 Artifact 卡片，短代码保留原样
        if (lines < 3 && !['html', 'svg', 'mermaid'].includes(langLower)) {
            return match; // 保持原样，让 marked 处理
        }

        const langInfo = CODE_LANG_MAP[langLower] || { icon: '📦', label: langLower || '代码', canPreview: false };
        const id = `iart_${++inlineArtifactCounter}`;

        // 存储代码数据
        inlineArtifactStore[id] = {
            lang: langLower,
            code: code.trim(),
            icon: langInfo.icon,
            label: langInfo.label,
            canPreview: langInfo.canPreview,
            lines: lines,
        };

        codeBlocks.push({ id, langInfo, lines, langLower });
        return `%%CODE_ARTIFACT_${codeBlocks.length - 1}%%`;
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

    // 恢复代码块为 Artifact 卡片
    processed = processed.replace(/%%CODE_ARTIFACT_(\d+)%%/g, (match, idx) => {
        const block = codeBlocks[parseInt(idx)];
        if (!block) return '';
        const { id, langInfo, lines, langLower } = block;

        // 提取代码的第一行作为摘要标题
        const codeData = inlineArtifactStore[id];
        const firstLine = codeData.code.split('\n')[0].trim().slice(0, 40);
        const title = firstLine || langInfo.label;

        return `<div class="inline-artifact-block" onclick="openInlineArtifact('${id}')" title="点击查看完整代码和预览">
            <div class="inline-artifact-icon">${langInfo.icon}</div>
            <div class="inline-artifact-info">
                <div class="inline-artifact-title">${escapeHtml(title)}</div>
                <div class="inline-artifact-meta">
                    <span class="inline-artifact-lang">${langLower || 'code'}</span>
                    <span class="inline-artifact-lines">${lines} 行</span>
                </div>
            </div>
            <div class="inline-artifact-action">
                <span>查看</span> <span>→</span>
            </div>
        </div>`;
    });

    // 所有链接在新标签页打开
    processed = processed.replace(/<a\s+href=/g, '<a target="_blank" rel="noopener" href=');

    return processed;
}

// 点击内联 Artifact 卡片，打开右侧面板
function openInlineArtifact(id) {
    const data = inlineArtifactStore[id];
    if (!data) return;

    // 映射到 artifact 系统的 type
    let artifactType = data.lang;
    if (['js', 'javascript'].includes(data.lang)) artifactType = 'javascript';
    if (['py', 'python'].includes(data.lang)) artifactType = 'python';

    // 检查是否已存在相同代码的 artifact
    const session = getActiveSession();
    if (!session) return;

    // 添加为 artifact 并打开
    const artifact = {
        id: generateId(),
        title: data.label,
        type: artifactType,
        code: data.code,
        icon: data.icon,
        createdAt: Date.now(),
    };

    session.artifacts.push(artifact);
    saveSessions();
    renderArtifactThumbnails();
    openArtifact(session.artifacts.length - 1);
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

    // 操作按钮（非流式消息才显示）
    const actionsHtml = isStreamingMsg ? '' : `
        <div class="message-actions">
            <button class="msg-action-btn" onclick="copyMessageContent(this.closest('.message'))" title="复制">📋</button>
            <button class="msg-action-btn" onclick="favoriteMessage(this.closest('.message'))" title="收藏">⭐</button>
            <button class="msg-action-btn msg-action-del" onclick="deleteMessage(this.closest('.message'))" title="删除">🗑️</button>
        </div>
    `;

    msgDiv.innerHTML = `
        <div class="message-avatar">${avatar}</div>
        <div class="message-content">
            <div class="message-text">${renderedContent}</div>
            ${actionsHtml}
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

    // 捕获待发送的图片（发送后清除）
    const imageToSend = pendingImage;
    pendingImage = null;
    const previewBar = document.getElementById('imagePreviewBar');
    if (previewBar) { previewBar.style.display = 'none'; previewBar.innerHTML = ''; }

    // 显示用户消息（含图片缩略图）
    const userDisplayContent = imageToSend
        ? `<div class="user-image-inline"><img src="${imageToSend.previewUrl}" alt="${imageToSend.fileName}" class="user-msg-image"></div>\n\n${userMsg || '请分析这张图片'}`
        : userMsg;
    appendMessage('user', userDisplayContent);
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
    let assignedModel = assignModelForSession(session.id);
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

        // ==== 网络搜索增强 ====
        let webSearchContext = '';
        let chatSearchResults = []; // 保存搜索结果，用于在回复后展示资源链接
        if (chatFeatures.webSearch) {
            try {
                // 显示搜索状态
                const indicator = document.getElementById('webSearchIndicator');
                const statusEl = document.getElementById('webSearchStatus');
                if (indicator) indicator.classList.add('show');
                if (statusEl) statusEl.textContent = '🌐 正在联网搜索相关信息...';

                // 更新流式消息提示
                if (activeSessionId === sendSessionId && rt.streamingMsgDiv) {
                    updateStreamMessage(rt.streamingMsgDiv, '🌐 *正在联网搜索相关信息...*');
                }

                // 并行搜索 Tavily + Brave
                const searchPromises = [
                    searchTavily(userMsg, 5).catch(e => ({ results: [] })),
                    searchBrave(userMsg, 5).catch(e => ({ web: { results: [] } })),
                ];
                const [tavilyData, braveData] = await Promise.all(searchPromises);

                // 合并搜索结果（保留结构化数据用于后续展示）
                const tavilyRaw = (tavilyData.results || []).map(r => ({
                    title: r.title, url: r.url, snippet: r.content, source: 'Tavily', isVideo: /bilibili|youtube|youtu\.be/i.test(r.url),
                }));
                const braveRaw = ((braveData.web?.results) || []).map(r => ({
                    title: r.title, url: r.url, snippet: r.description, source: 'Brave', isVideo: false,
                }));
                // Brave 视频结果
                const braveVideoRaw = ((braveData.videos?.results) || []).map(v => ({
                    title: v.title, url: v.url, snippet: v.description || '视频', source: 'Brave-Video', isVideo: true, thumbnail: v.thumbnail?.src,
                }));
                chatSearchResults = deduplicateResults([...tavilyRaw, ...braveRaw, ...braveVideoRaw]).slice(0, 10);

                const tavilyResults = tavilyRaw.map(r => `• ${r.title}: ${(r.snippet || '').slice(0, 200)} [${r.url}]`);
                const braveResults = braveRaw.map(r => `• ${r.title}: ${(r.snippet || '').slice(0, 200)} [${r.url}]`);
                const allSearchResults = [...tavilyResults, ...braveResults].slice(0, 8);

                if (allSearchResults.length > 0) {
                    webSearchContext = `\n\n## 以下是联网搜索到的最新信息（供参考）\n${allSearchResults.join('\n')}\n\n请基于以上搜索结果和你的知识，给出全面准确的回答。在回答中直接用 Markdown 链接格式引用相关资源，如 [标题](URL)。视频链接优先 B站(bilibili.com)。`;
                }

                if (statusEl) statusEl.textContent = `✅ 已获取 ${chatSearchResults.length} 条搜索结果`;
                setTimeout(() => { if (indicator) indicator.classList.remove('show'); }, 2000);

            } catch (searchError) {
                console.warn('网络搜索失败:', searchError);
                const indicator = document.getElementById('webSearchIndicator');
                if (indicator) indicator.classList.remove('show');
            }
        }

        // ==== 深度思考增强 ====
        let deepThinkPrefix = '';
        if (chatFeatures.deepThink) {
            deepThinkPrefix = `请使用深度思考模式回答以下问题。先进行全面分析，列出关键思考步骤，再给出详细的回答。

## 思考要求
1. 先分析问题的核心要点
2. 列出解题/回答的关键步骤
3. 考虑可能的易错点和注意事项
4. 给出完整、严谨的回答
5. 如果是数学/物理题，要写出完整的解题过程

---

`;
        }

        // 构建最终系统提示
        let finalSystemPrompt = SYSTEM_PROMPT;
        if (webSearchContext) {
            finalSystemPrompt += webSearchContext;
        }

        // 构建用户消息（支持多模态图片）
        let finalUserContent;
        if (imageToSend) {
            // 多模态消息格式
            finalUserContent = [
                {
                    type: 'image_url',
                    image_url: {
                        url: `data:${imageToSend.mimeType};base64,${imageToSend.base64}`,
                    },
                },
                {
                    type: 'text',
                    text: (deepThinkPrefix ? deepThinkPrefix : '') + (userMsg || '请分析这张图片的内容，如果是题目请帮我解答。'),
                },
            ];
            // 图片对话强制使用图片模型
            assignedModel = CONFIG.imageModel || 'gemini-3.1-flash-image';
            rt.assignedModel = assignedModel;
        } else {
            finalUserContent = deepThinkPrefix ? deepThinkPrefix + userMsg : userMsg;
        }

        const messages = [
            { role: 'system', content: finalSystemPrompt },
            ...contextMsgs.slice(0, -1), // 排除最后一条（因为我们用 finalUserContent 替代）
            { role: 'user', content: finalUserContent },
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

                // 为消息添加操作按钮（流式结束后补上）
                const msgContent = rt.streamingMsgDiv.querySelector('.message-content');
                if (msgContent && !msgContent.querySelector('.message-actions')) {
                    const actionsDiv = document.createElement('div');
                    actionsDiv.className = 'message-actions';
                    actionsDiv.innerHTML = `
                        <button class="msg-action-btn" onclick="copyMessageContent(this.closest('.message'))" title="复制">📋</button>
                        <button class="msg-action-btn" onclick="favoriteMessage(this.closest('.message'))" title="收藏">⭐</button>
                        <button class="msg-action-btn msg-action-del" onclick="deleteMessage(this.closest('.message'))" title="删除">🗑️</button>
                    `;
                    msgContent.appendChild(actionsDiv);
                }

                // 如果开启了网络搜索且有搜索结果，在AI回复下方展示资源卡片
                if (chatSearchResults && chatSearchResults.length > 0) {
                    const resourceDiv = document.createElement('div');
                    resourceDiv.className = 'chat-search-resources';
                    resourceDiv.innerHTML = `
                        <div class="chat-resources-header">📎 相关资源 (${chatSearchResults.length})</div>
                        ${renderSearchResultCards(chatSearchResults)}
                    `;
                    rt.streamingMsgDiv.querySelector('.message-content').appendChild(resourceDiv);
                }
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

// 图片上传状态
let pendingImage = null; // { base64, mimeType, fileName, previewUrl }

function handleImageUpload(input) {
    const file = input.files?.[0];
    if (!file) return;

    // 验证文件类型和大小
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
        showToast('仅支持 JPG/PNG/GIF/WebP 格式图片', 'warning');
        input.value = '';
        return;
    }
    if (file.size > 10 * 1024 * 1024) {
        showToast('图片大小不能超过 10MB', 'warning');
        input.value = '';
        return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
        const base64Full = e.target.result; // data:image/xxx;base64,...
        const base64Data = base64Full.split(',')[1];
        pendingImage = {
            base64: base64Data,
            mimeType: file.type,
            fileName: file.name,
            previewUrl: base64Full,
        };
        showImagePreview(pendingImage);
        showToast(`📎 已添加图片「${file.name}」，输入问题后发送`, 'success');
    };
    reader.readAsDataURL(file);
    input.value = '';
}

function showImagePreview(imgData) {
    // 在输入区域上方显示图片预览
    let previewBar = document.getElementById('imagePreviewBar');
    if (!previewBar) {
        previewBar = document.createElement('div');
        previewBar.id = 'imagePreviewBar';
        previewBar.className = 'image-preview-bar';
        const inputWrapper = document.querySelector('.input-wrapper');
        inputWrapper.parentNode.insertBefore(previewBar, inputWrapper);
    }
    previewBar.innerHTML = `
        <div class="image-preview-item">
            <img src="${imgData.previewUrl}" alt="预览" class="image-preview-thumb">
            <span class="image-preview-name">${imgData.fileName}</span>
            <button class="btn btn-icon image-preview-remove" onclick="removeImagePreview()" title="移除图片">✕</button>
        </div>
    `;
    previewBar.style.display = 'flex';
}

function removeImagePreview() {
    pendingImage = null;
    const previewBar = document.getElementById('imagePreviewBar');
    if (previewBar) {
        previewBar.style.display = 'none';
        previewBar.innerHTML = '';
    }
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

// Tavily 搜索（视频查询自动追加 bilibili 关键词）
async function searchTavily(query, maxResults = 8) {
    // 视频相关搜索自动加 bilibili 优先
    let searchQuery = query;
    if (/视频|讲解|教程|演示|bilibili|b站/i.test(query) && !/bilibili|b站/i.test(query)) {
        searchQuery = query + ' bilibili';
    }
    const resp = await fetch('https://api.tavily.com/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            api_key: TAVILY_API_KEY,
            query: searchQuery,
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

// Exa 语义搜索（通过 Tavily 中转，添加语义搜索关键词优化）
async function searchExa(query, maxResults = 5) {
    // Exa 语义搜索：添加学术/知识类关键词增强
    const enhancedQuery = `${query} 知识点 考点 详解 原理`;
    const resp = await fetch('https://api.tavily.com/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            api_key: TAVILY_API_KEY,
            query: enhancedQuery,
            max_results: maxResults,
            search_depth: 'advanced',
            include_domains: ['zhihu.com', 'baike.baidu.com', 'zujuan.com', 'xuekeedu.com', 'wiki.mbalib.com', 'xueshu.baidu.com'],
        }),
    });
    if (!resp.ok) throw new Error(`Exa语义搜索失败: ${resp.status}`);
    return resp.json();
}

// Gemini 深度研究（通过 Venus 调用 Gemini 3.1 Pro 进行深度分析）
async function searchGeminiDeep(query) {
    const systemPrompt = `你是深圳中考知识深度研究专家。请对以下问题进行全面深入的分析：
1. 知识点解析（考纲要求、考频分析）
2. 典型例题与解题方法
3. 易错点与注意事项
4. 相关拓展知识
请用 Markdown 格式输出，包含标题、列表和重点标注。`;

    const resp = await fetch(CONFIG.apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${CONFIG.apiToken}`,
        },
        body: JSON.stringify({
            model: 'gemini-3.1-pro',
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: query },
            ],
            temperature: 0.3,
            max_tokens: 4096,
            stream: false,
        }),
    });
    if (!resp.ok) throw new Error(`Gemini深度研究失败: ${resp.status}`);
    const data = await resp.json();
    return data.choices?.[0]?.message?.content || '';
}

// 微信公众号搜索（通过 Tavily + 搜狗微信搜索源）
async function searchWechat(query, maxResults = 5) {
    const wechatQuery = `${query} site:mp.weixin.qq.com OR site:weixin.sogou.com 中考`;
    const resp = await fetch('https://api.tavily.com/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            api_key: TAVILY_API_KEY,
            query: wechatQuery,
            max_results: maxResults,
            search_depth: 'basic',
            include_domains: ['mp.weixin.qq.com', 'weixin.sogou.com'],
        }),
    });
    if (!resp.ok) throw new Error(`公众号搜索失败: ${resp.status}`);
    return resp.json();
}

// 小红书搜索（通过 Tavily + 小红书域名限定）
async function searchXiaohongshu(query, maxResults = 5) {
    const xhsQuery = `${query} site:xiaohongshu.com 中考 学习`;
    const resp = await fetch('https://api.tavily.com/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            api_key: TAVILY_API_KEY,
            query: xhsQuery,
            max_results: maxResults,
            search_depth: 'basic',
            include_domains: ['xiaohongshu.com', 'xhslink.com'],
        }),
    });
    if (!resp.ok) throw new Error(`小红书搜索失败: ${resp.status}`);
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

    // 保存搜索历史
    addSearchHistory(query);

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
        let geminiDeepContent = ''; // Gemini 深度研究结果单独处理

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
        if (engines.includes('exa')) {
            searchPromises.push(
                searchExa(query).then(data => ({ engine: 'exa', data })).catch(e => ({ engine: 'exa', error: e.message }))
            );
        }
        if (engines.includes('wechat')) {
            searchPromises.push(
                searchWechat(query).then(data => ({ engine: 'wechat', data })).catch(e => ({ engine: 'wechat', error: e.message }))
            );
        }
        if (engines.includes('xiaohongshu')) {
            searchPromises.push(
                searchXiaohongshu(query).then(data => ({ engine: 'xiaohongshu', data })).catch(e => ({ engine: 'xiaohongshu', error: e.message }))
            );
        }
        // Gemini 深度研究（异步执行，不阻塞主搜索流程）
        let geminiPromise = null;
        if (engines.includes('gemini')) {
            geminiPromise = searchGeminiDeep(query).catch(e => { console.warn('Gemini 深度研究失败:', e.message); return ''; });
        }

        const searchResults = await Promise.all(searchPromises);

        // 合并搜索结果
        let allResults = [];
        let allImages = [];

        const sourceMap = {
            'exa': 'Exa语义',
            'wechat': '公众号',
            'xiaohongshu': '小红书',
        };

        for (const sr of searchResults) {
            if (sr.error) {
                console.warn(`${sr.engine} 搜索失败:`, sr.error);
                continue;
            }
            if (sr.engine === 'tavily' || sr.engine === 'exa' || sr.engine === 'wechat' || sr.engine === 'xiaohongshu') {
                const sourceName = sourceMap[sr.engine] || 'Tavily';
                const tavilyResults = (sr.data.results || []).map(r => ({
                    title: r.title,
                    url: r.url,
                    snippet: r.content,
                    source: sourceName,
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

        // 等待 Gemini 深度研究结果
        if (geminiPromise) {
            geminiDeepContent = await geminiPromise;
        }

        // ====== 第2步：如果没有真实搜索结果 ======
        if (allResults.length === 0 && !geminiDeepContent && searchPromises.length === 0) {
            // 没有选中任何引擎，用 AI 直接回答
            resultsDiv.innerHTML = '<div class="search-placeholder"><div class="loading-spinner"></div><p>🤖 AI 分析中...</p></div>';
        } else if (allResults.length === 0 && !geminiDeepContent) {
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

        const searchSystemPrompt = `你是深圳中考学习资源搜索专家。基于以下真实搜索结果，为用户提供高质量、结构工整的回答。

## 严格要求
1. **必须给出真实可点击的链接**：从搜索结果中选取最相关的链接，用 Markdown 链接格式 [标题](URL) 给出
2. **视频链接**：如果用户要求视频，优先给出 B站(bilibili.com)、YouTube 等视频网站的直接链接，格式：🎬 [视频标题](视频URL)
3. **图片/图示**：如果有相关图片，用 Markdown 图片格式 ![描述](图片URL) 嵌入
4. **不要虚构链接**：只使用搜索结果中真实存在的 URL，不要编造
5. **中文回答**：所有内容用中文

## 排版规范（非常重要）
- 使用 Markdown 标题层级（## 和 ###）清晰分隔不同板块
- 知识要点用**有序列表**或**无序列表**呈现，每个要点独立成行
- 关键概念、公式、术语用 **加粗** 突出
- 表格数据（如分数线、对比信息）优先使用 Markdown 表格
- 段落之间保持空行，不要挤在一起
- 每个板块内容控制在 3-8 条，避免过长
- 引用或补充说明使用 > 引用格式

## 搜索结果
${searchContext}

${imageContext ? `## 相关图片\n${imageContext}` : ''}

## 回答结构
1. **核心知识要点**（简明扼要的列表式总结）
2. **详细解读**（按主题分段阐述，每段有小标题）
3. **📚 推荐资源**（附真实链接）
4. **📺 推荐视频**（如有视频资源）`;

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

        // 如果有 Gemini 深度研究结果，在下方追加展示
        if (geminiDeepContent) {
            const geminiSection = document.createElement('div');
            geminiSection.className = 'search-result-item gemini-deep-section';
            geminiSection.innerHTML = `
                <div class="result-title">♊ Gemini 深度研究</div>
                <div class="result-snippet">${renderMessageContent(geminiDeepContent)}</div>
                <div class="result-meta">
                    <span class="result-source">引擎: Gemini 3.1 Pro</span>
                    <span>模式: 深度研究</span>
                </div>
            `;
            resultsDiv.appendChild(geminiSection);
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

// 渲染搜索结果卡片（含收藏按钮，所有链接新标签页打开）
function renderSearchResultCards(results) {
    if (!results || results.length === 0) return '';

    const cards = results.map(r => {
        const isVideo = r.isVideo || /bilibili\.com|youtube\.com|youtu\.be|v\.qq\.com|ixigua\.com/.test(r.url);
        const icon = isVideo ? '🎬' : (r.source === 'Brave' ? '🦁' : '🌐');
        const domain = new URL(r.url).hostname.replace('www.', '');
        const thumbnail = r.thumbnail ? `<img class="result-card-thumb" src="${r.thumbnail}" onerror="this.style.display='none'" alt="">` : '';
        const safeTitle = escapeHtml(r.title).replace(/'/g, "\\'");
        const safeUrl = r.url.replace(/'/g, "\\'");
        const safeSnippet = escapeHtml((r.snippet || '').slice(0, 80)).replace(/'/g, "\\'");

        return `
            <div class="search-result-card" onclick="window.open('${safeUrl}', '_blank')">
                ${thumbnail}
                <div class="result-card-body">
                    <div class="result-card-title">${icon} ${escapeHtml(r.title)}</div>
                    <div class="result-card-snippet">${escapeHtml((r.snippet || '').slice(0, 120))}</div>
                    <div class="result-card-meta">
                        <span class="result-card-domain">${domain}</span>
                        <span class="result-card-source">${r.source}</span>
                        <button class="result-card-fav" onclick="event.stopPropagation();addToFavorites({type:'search',title:'${safeTitle}',url:'${safeUrl}',content:'${safeSnippet}'})" title="收藏">⭐</button>
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
// 聊天功能开关（网络搜索 / 深度思考）
// ============================
function toggleChatFeature(feature) {
    chatFeatures[feature] = !chatFeatures[feature];

    // 更新 UI 状态
    const toggleEl = feature === 'webSearch'
        ? document.getElementById('toggleWebSearch')
        : document.getElementById('toggleDeepThink');

    if (toggleEl) {
        toggleEl.classList.toggle('active', chatFeatures[feature]);
    }

    // Toast 提示
    const labels = { webSearch: '网络搜索', deepThink: '深度思考' };
    const icons = { webSearch: '🌐', deepThink: '🧠' };
    showToast(`${icons[feature]} ${labels[feature]} 已${chatFeatures[feature] ? '开启' : '关闭'}`, chatFeatures[feature] ? 'success' : 'info');
}

// ============================
// 初始化
// ============================
window.addEventListener('DOMContentLoaded', () => {
    initMarked();
    loadSettings();
    loadFavorites();       // 加载收藏数据
    loadSearchHistory();   // 加载搜索历史
    loadSessions(); // 加载多会话
    switchPage('chat');
    console.log('🎓 深圳中考专家系统 v1.2 已启动');
    console.log('📐 JSXGraph 几何引擎就绪');
    console.log('🤖 Venus LLM 对话引擎就绪');
    console.log(`📚 知识库: ${KB_DATA.length} 个文件（全部含描述）`);
    console.log('💬 多会话系统就绪');
    console.log('📦 Artifact 系统就绪');
    console.log('🌐 6引擎搜索就绪（Tavily/Brave/Exa/Gemini/公众号/小红书）');
    console.log('🧠 深度思考模式就绪');
    console.log('⭐ 精华收藏系统就绪');
    console.log('🖼️ 多模态图片对话就绪');
    console.log('📝 学科快捷提问模板就绪');
});
