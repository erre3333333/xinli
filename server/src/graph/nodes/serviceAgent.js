import { callLLM } from '../llm.js'

const SERVICE_CONFIG = {
  'child-emotion': {
    title: '儿童情绪管理顾问',
    greeting: '你好，我是儿童情绪管理顾问。我可以帮助您了解孩子的情绪发展状况，'
      + '提供情绪调节策略和亲子沟通建议。请告诉我您孩子的情况和您的关注点。',
    contexts: ['情绪识别与表达', '情绪调节策略', '行为管理', '亲子沟通'],
  },
  adolescent: {
    title: '青少年成长咨询师',
    greeting: '你好，我是青少年成长咨询师。无论你正在面对学业压力、同伴关系、'
      + '自我认同还是家庭沟通的挑战，我都在这里倾听。请告诉我你最近在想什么。',
    contexts: ['学业压力', '同伴关系', '自我认同', '情绪波动', '亲子沟通'],
  },
  mindfulness: {
    title: '正念减压教练',
    greeting: '你好，我是正念减压教练。正念是帮助我们在繁忙的生活中找到平静的方法。'
      + '请告诉我你目前面临的压力状况，我会为你设计合适正念练习方案。',
    contexts: ['压力管理', '正念呼吸', '身体扫描', '情绪觉察', '专注力提升'],
  },
  'social-anxiety': {
    title: '社交焦虑突破教练',
    greeting: '你好，我是社交焦虑突破教练。社交中的紧张感是很多人都面临的挑战。'
      + '请告诉我你在社交场合中遇到的具体困难，我们一起逐步克服。',
    contexts: ['社交恐惧', '表达困难', '人际回避', '自信心建立', '社交技能'],
  },
}

const SYMPTOM_SCALES = {
  cers: { keywords: ['儿童', '孩子', '情绪', '脾气', '哭闹', '行为问题', '不听话'], matchMin: 2 },
  'sdq-child': { keywords: ['多动', '坐不住', '注意力', '社交', '同伴', '孤僻'], matchMin: 1 },
  psci: { keywords: ['自我', '自信', '价值', '认同', '自卑', '迷茫'], matchMin: 1 },
  yapa: { keywords: ['学业', '压力', '适应', '家庭', '冲突', '未来'], matchMin: 1 },
  maas: { keywords: ['正念', '专注', '走神', '觉察', '自动', '当下'], matchMin: 1 },
  ffmq: { keywords: ['观察', '描述', '评判', '反应', '觉察', '情绪'], matchMin: 1 },
  sias: { keywords: ['社交', '焦虑', '紧张', '害怕', '表达', '目光'], matchMin: 2 },
  sad: { keywords: ['回避', '拒绝', '逃避', '聚会', '发言', '害羞'], matchMin: 1 },
}

function detectServiceScaleId(messages, serviceType, existingIds = new Set()) {
  const text = messages.map(m => (typeof m.content === 'string' ? m.content : '')).join(' ').toLowerCase()
  for (const [id, cfg] of Object.entries(SYMPTOM_SCALES)) {
    if (existingIds.has(id)) continue
    const count = cfg.keywords.filter(k => text.includes(k)).length
    if (count >= cfg.matchMin) return id
  }
  return null
}

export async function serviceAgentNode(state) {
  const cfg = SERVICE_CONFIG[state.serviceType]
  if (!cfg) {
    return {
      messages: [{ role: 'assistant', content: '暂不支持该服务类型。' }],
      serviceDone: true,
    }
  }

  let system = `你是一位专业的${cfg.title}。以下是与用户的咨询对话。

## 专业领域
${cfg.contexts.map(c => `- ${c}`).join('\n')}

## 咨询规则
- 以温暖、共情的态度回应
- 每次回复聚焦于 1-2 个重点
- 根据用户的具体情况提供针对性的建议
- 关注用户的情绪状态和进展
- 适时介绍相关评估量表以更好地了解用户需求

## 工具使用
如需推荐量表，使用格式： 【量表推荐: scale_id】说明理由

回复要自然、有深度，避免教科书式的回答。`

  if (state.medicalHistory) {
    system += `\n\n## 用户历史记录\n${state.medicalHistory}\n\n请参考以上历史记录。`
  }

  const msgs = [{ role: 'system', content: system }]

  const scaleContext = state.scaleResults?.length
    ? `\n\n以下是用户已完成的评估结果：\n${
        state.scaleResults.map(r => `- ${r.scaleName}（${r.scaleId}）: ${r.score}分, ${r.severity}`).join('\n')
      }`
    : ''
  if (scaleContext) {
    msgs.push({ role: 'system', content: `附：用户已完成评估\n${scaleContext}` })
  }

  for (const msg of state.messages) {
    const r = msg.role || (msg.type === 'human' ? 'user' : msg.type === 'ai' ? 'assistant' : null)
    if (r) msgs.push({ role: r, content: msg.content })
  }

  const response = await callLLM({ messages: msgs, model: state.model })

  const scaleMatch = response.match(/【量表推荐:\s*([\w-]+)】/)
  let scaleRec = scaleMatch ? scaleMatch[1] : null

  const existingIds = new Set((state.scaleResults || []).map(r => r.scaleId))
  if (scaleRec && existingIds.has(scaleRec)) scaleRec = null

  // ponytail: 自动推荐相关量表
  if (!scaleRec && !state.currentScaleData) {
    const detected = detectServiceScaleId(state.messages, state.serviceType, existingIds)
    if (detected) scaleRec = detected
  }

  return {
    messages: [{ role: 'assistant', content: response }],
    scaleRecommendation: scaleRec ? {
      scaleId: scaleRec,
      requestedBy: state.serviceType,
      reason: response,
    } : null,
    currentScaleId: scaleRec || null,
  }
}
