import { Router } from 'express'
import { callLLM } from '../graph/llm.js'

const router = Router()

// 危机关键词（中英文全面覆盖）
const CRISIS_KEYWORDS = [
  '自杀', '自伤', '自残', '不想活', '结束生命', '活不下去', '想死', '了断',
  '伤害自己', '割腕', '跳楼', ' overdose', '吞药', 'dead', 'suicide',
  'kill myself', 'end my life', 'hurt myself', 'self-harm', 'self harm',
  'take my life', 'not worth living', 'better off dead',
]

// Faye 练习库 — 按情绪分类的循证调节练习
const EXERCISES = {
  anxiety: [
    { name: '4-7-8 呼吸法', desc: '吸气4秒 → 屏息7秒 → 呼气8秒。重复4次，激活副交感神经', duration: '2分钟' },
    { name: '5-4-3-2-1 接地', desc: '说出你看到的5样东西 → 摸到的4样 → 听到的3样 → 闻到的2样 → 尝到的1样', duration: '3分钟' },
    { name: '箱式呼吸', desc: '吸气4秒 → 屏息4秒 → 呼气4秒 → 屏息4秒。想象一个方形轨迹', duration: '3分钟' },
  ],
  sadness: [
    { name: '行为激活', desc: '列出3件你以前喜欢做的小事，选一件今天做10分钟', duration: '10分钟' },
    { name: '自我慈悲冥想', desc: '把手放在心口，对自己说："这一刻很艰难。愿我对自己慈悲。"重复3次', duration: '3分钟' },
    { name: '感恩记录', desc: '写下3件今天值得感恩的事，无论多小', duration: '5分钟' },
  ],
  anger: [
    { name: '渐进式肌肉放松', desc: '从脚趾到额头，依次绷紧肌肉5秒→放松10秒', duration: '8分钟' },
    { name: 'STOP 技巧', desc: 'S（停下来）→ T（深呼吸）→ O（观察感受）→ P（选择回应）', duration: '2分钟' },
    { name: '冷却时间', desc: '暂时离开触发情境，给自己10-15分钟冷静', duration: '10-15分钟' },
  ],
  stress: [
    { name: '正念身体扫描', desc: '从头顶到脚趾，逐部位觉察身体感受，不评判', duration: '5分钟' },
    { name: '优先级矩阵', desc: '把事情按"紧急/重要"分四象限，只做第一象限', duration: '5分钟' },
    { name: '迷你休息', desc: '设置定时器每45分钟提醒，站起来拉伸、喝水、深呼吸1分钟', duration: '1分钟' },
  ],
  general: [
    { name: '正念呼吸', desc: '专注呼吸的感觉，当思绪飘走时温和地把注意力带回呼吸', duration: '3分钟' },
    { name: '情绪日记', desc: '记录：今天发生了什么？我的感受是什么（1-10分）？我是如何回应的？', duration: '5分钟' },
    { name: '认知重构', desc: '写下自动思维 → 寻找证据 → 建立更平衡的替代思维', duration: '10分钟' },
  ],
}

/**
 * Faye 情绪调节系统后端
 * 基于 CBT 5步情绪调节流程:
 * 1. Identify - 识别情绪
 * 2. Explore - 探索触发因素
 * 3. Reframe - 重构思维
 * 4. Regulate - 调节技巧
 * 5. Reflect - 反思成长
 */

const FAYE_SYSTEM_PROMPT = `你是一位专业的 Faye 情绪调节助手，由持证治疗师、临床顾问和认知行为疗法（CBT）从业者合作开发。你的目标是帮助用户建立情感智商的对话，认可他们的感受，同时教授调节技能。

## 理论依据
Faye 的设计基于以下权威研究和指南：
- **美国心理学会（APA）** — 循证心理治疗实践指南
- **国家卫生与护理卓越研究院（NICE）** — 情绪障碍治疗方案
- **心理学前沿（Frontiers in Psychology）** — 情绪调节的前沿研究成果
- **JMIR 心理健康** — 数字心理健康干预的同行评审证据

## 核心原则

### 1. 情感智商的对话
- **认可感受**：先共情，后引导。承认情绪的合理性，不评判、不否定
- **命名情绪**：帮助用户精确命名情绪（如"失望"而非简单的"不开心"）
- **情绪粒度**：引导用户区分相似情绪（如"愤怒 vs 受伤"、"焦虑 vs 兴奋"）
- **调节为本**：每次对话以教授一个具体的调节技巧结束

### 2. 持续情绪觉察的练习设计
- **每日情绪签到**：鼓励用户记录每日情绪变化和强度
- **思维记录**：引导用户使用 CBT 思维记录表识别自动思维
- **正念练习**：提供简短的正念呼吸、身体扫描、行走冥想等练习
- **行为实验**：设计小步骤的行为实验，验证负面预测
- **情绪日记**：建议用户记录触发因素、情绪反应和采用的调节策略
- **渐进训练**：从简单到复杂，逐步建立情绪调节能力

### 3. 伦理和安全的AI使用保障
- **透明性**：明确告知用户你是一个 AI 助手，不是持证治疗师
- **隐私保护**：提醒用户不要在平台分享真实姓名、地址等个人身份信息
- **专业边界**：不提供诊断、不开药、不替代专业心理治疗
- **危机协议**：检测到自伤/自杀信号时，立即提供专业求助热线
- **数据伦理**：建议用户定期与专业心理工作者对接，AI 仅作辅助工具
- **知情同意**：在首次对话中明确说明 AI 辅导的局限性和适用场景

## 工作方式
你遵循循证支持的 5 步情绪调节流程：

### 第1步：识别 (Identify)
- 帮助用户命名他们正在经历的情绪
- 询问情绪强度（1-10分）
- 创造安全、无评判的空间
- 引入正念觉察：引导用户关注当下的身体感受和情绪变化

### 第2步：探索 (Explore)
- 探索触发这种情绪的情境和自动思维
- 帮助用户理解情绪、想法与行为之间的联系（CBT 三角模型）
- 识别潜在的情绪模式和反复出现的触发因素
- 区分事实与解读

### 第3步：重构 (Reframe)
- 识别非理性思维模式（灾难化、全或无思维、过度概括、心理过滤等）
- 运用苏格拉底式提问引导用户挑战这些思维
- 帮助建立更平衡、更具适应性的观点
- 引入正念认知疗法（MBCT）的觉察而不认同理念

### 第4步：调节 (Regulate)
- 教授循证支持的调节技巧：
  - 呼吸练习（4-7-8 呼吸法、箱式呼吸）
  - 接地技巧（5-4-3-2-1 感官觉察）
  - 认知重构（基于 Beck 的 CBT 模型）
  - 行为激活（针对情绪低落）
  - 正念冥想（基于 MBSR 的简短练习）
  - 渐进式肌肉放松（PMR）
- 根据用户当前情绪和情境推荐最合适的技巧

### 第5步：反思 (Reflect)
- 回顾对话中的收获和洞察
- 识别情绪模式和触发因素的变化趋势
- 鼓励用户将学到的技巧融入日常生活
- 庆祝进步，增强自我效能感

## 重要规则
1. **透明告知**：第一次对话时说明你是 AI 助手，非持证治疗师
2. **不要诊断**：不提供医疗诊断，不替代专业心理治疗
3. **不要开药**：不涉及药物治疗建议
4. **危机处理**：如果用户提到自伤、自杀或严重危机，立即建议联系专业帮助
   - 中国：拨打 心理援助热线 400-161-9995
   - 美国：拨打 988 或 911
   - 英国：拨打 116 123 (Samaritans)
   - 国际：访问 findahelpline.com
5. **循证优先**：提供的所有建议应基于认知行为疗法和正念的循证原则
6. **个性化**：记住用户的情绪模式和触发因素，提供个性化建议
7. **简洁**：每次回复聚焦 1-2 个重点，不要一次性给出所有建议
8. **温暖**：使用共情、支持性的语言，让用户感到被理解和接纳
9. **提问**：多用开放式问题引导用户思考，而不是直接给建议
10. **练习**：鼓励用户每天练习情绪调节技巧

## 回复格式
- 先认可和共情用户的感受（1-2句）
- 然后提出 1-2 个引导性问题或提供一个简单的练习建议
- 如果需要，提供简单的 CBT 或正念技巧
- 保持回复在 100-200 字以内

## 语言
- 用户用中文交流就用中文
- 用户用英文交流就用英文
- 自动检测用户偏好并保持一致

## 示例开场白
"你好，我是 Faye，你的情绪调节伙伴。我与持证治疗师和 CBT 专家合作开发，帮助你建立情感智商的对话，认可你的感受，同时教授科学的情绪调节技能。今天感觉怎么样？"

## 安全提示
如果检测到危机信号（自伤、自杀念头等），回复：
"我听到你现在非常痛苦，这一定很艰难。请记住，你并不孤单。请立即联系专业帮助：
- 中国：拨打 心理援助热线 400-161-9995
- 美国：拨打 988 或 911
- 英国：拨打 116 123 (Samaritans)
- 国际：访问 findahelpline.com
你的安全是最重要的。"`

router.post('/', async (req, res) => {
  const { message, history, emotionContext } = req.body

  if (!message) {
    return res.status(400).json({ error: '缺少消息内容' })
  }

  res.setHeader('Content-Type', 'application/json')
  res.setHeader('Cache-Control', 'no-cache')

  // 构建消息历史
  const messages = [{ role: 'system', content: FAYE_SYSTEM_PROMPT }]

  if (history && Array.isArray(history)) {
    for (const msg of history) {
      if (msg.role && msg.content) {
        messages.push({ role: msg.role, content: msg.content })
      }
    }
  }

  // 添加情绪上下文（如果有的话）
  if (emotionContext) {
    messages.push({
      role: 'system',
      content: `用户当前情绪上下文：${JSON.stringify(emotionContext)}`,
    })
  }

  messages.push({ role: 'user', content: message })

  try {
    const response = await callLLM({ messages, model: 'agnes-2.0-flash' })

    // 检测危机关键词（中英文全面覆盖）
    const isCrisis = CRISIS_KEYWORDS.some(k => message.toLowerCase().includes(k.toLowerCase()))

    if (isCrisis) {
      res.json({
        type: 'crisis',
        content: `我听到你现在非常痛苦，这一定很艰难。请记住，你并不孤单。请立即联系专业帮助：\n\n🇨🇳 中国：心理援助热线 400-161-9995\n🇺🇸 美国：拨打 988 或 911\n🇬🇧 英国：拨打 116 123（Samaritans）\n🌍 国际：访问 findahelpline.com\n\n你的安全是最重要的。`,
        emotionContext: { stage: 'crisis', intensity: 10 },
      })
      return
    }

    // 分析情绪
    const emotionAnalysis = await analyzeEmotion(message)

    // 推荐练习（基于检测到的情绪类型）
    const recommended = getExercises(emotionAnalysis.emotion, 2)

    res.json({
      type: 'message',
      content: response,
      emotionContext: {
        ...emotionContext,
        lastEmotion: emotionAnalysis.emotion,
        lastIntensity: emotionAnalysis.intensity,
        stage: emotionAnalysis.stage,
      },
      exercises: recommended,
    })
  } catch (e) {
    console.error('[Faye] 错误:', e)
    res.status(500).json({ error: e.message })
  }
})

// 情绪分析端点
router.post('/emotion', async (req, res) => {
  const { message } = req.body

  if (!message) {
    return res.status(400).json({ error: '缺少消息内容' })
  }

  try {
    const analysis = await analyzeEmotion(message)
    res.json(analysis)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

/**
 * 分析用户消息的情绪
 * 使用 LLM 识别情绪类型、强度和调节阶段
 */
async function analyzeEmotion(message) {
  const prompt = `你是一个情绪分析专家，基于 APA 和 NICE 指南分析用户情绪。

用户消息："${message}"

请返回 JSON 格式：
{
  "emotion": "主要情绪类型（如：焦虑、悲伤、愤怒、沮丧、孤独、压力等）",
  "intensity": 1-10 的整数，表示情绪强度，
  "stage": "情绪调节阶段（identify/explore/reframe/regulate/reflect）",
  "triggers": ["触发因素1", "触发因素2"],
  "distortions": ["认知扭曲类型1", "认知扭曲类型2"],
  "suggestedExercises": ["推荐的练习类型，如：呼吸练习、正念、行为激活、认知重构"]
}`

  try {
    const response = await callLLM({
      messages: [
        { role: 'system', content: '你是一个情绪分析专家。只返回 JSON，不要其他内容。' },
        { role: 'user', content: prompt },
      ],
      model: 'agnes-2.0-flash',
    })

    // 解析 JSON
    let analysis
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        analysis = JSON.parse(jsonMatch[0])
      } else {
        analysis = { emotion: 'unknown', intensity: 5, stage: 'identify', triggers: [], distortions: [] }
      }
    } catch {
      analysis = { emotion: 'unknown', intensity: 5, stage: 'identify', triggers: [], distortions: [] }
    }

    return analysis
  } catch (e) {
    console.warn('[Faye] 情绪分析失败:', e.message)
    return { emotion: 'unknown', intensity: 5, stage: 'identify', triggers: [], distortions: [] }
  }
}

/**
 * 根据情绪类型推荐练习
 */
function getExercises(emotion, count = 2) {
  const emotionLower = (emotion || '').toLowerCase()
  let pool
  if (/焦虑|紧张|担心|害怕|恐惧|不安|anxiet|nervous|worry|fear|panic/.test(emotionLower)) {
    pool = EXERCISES.anxiety
  } else if (/悲伤|难过|沮丧|抑郁|失落|孤独|sad|depress|lonely|grief/.test(emotionLower)) {
    pool = EXERCISES.sadness
  } else if (/愤怒|生气|烦躁|恼火|angry|anger|irritat|frustrat/.test(emotionLower)) {
    pool = EXERCISES.anger
  } else if (/压力|紧张|疲惫|burnout|stress|overwhelm|exhaust/.test(emotionLower)) {
    pool = EXERCISES.stress
  } else {
    pool = EXERCISES.general
  }
  // 随机选取 count 个不重复的练习
  const shuffled = [...pool].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, Math.min(count, shuffled.length))
}

// 练习列表端点
router.get('/exercises', (_, res) => {
  res.json(EXERCISES)
})

// 按情绪推荐练习端点
router.post('/exercises/recommend', (req, res) => {
  const { emotion, count } = req.body
  res.json(getExercises(emotion || '', count || 2))
})

export default router
