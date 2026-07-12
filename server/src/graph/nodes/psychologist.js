import { callLLM } from '../llm.js'
import { callPsyLLM } from '../../psyllm/adapter.js'

const PSYLLM_API_KEY = process.env.PSYLLM_API_KEY
const USE_PSyllm = process.env.USE_PSyllm === 'true'

/**
 * 使用 PsyLLM 进行心理科诊断
 * PsyLLM 专门针对心理健康咨询训练，结合诊断推理和治疗推理
 */
async function callPsyLLMForPsychology(system, conversationHistory) {
  const messages = [
    { role: 'system', content: system },
    ...conversationHistory.map(m => ({ role: m.role, content: m.content })),
  ]

  try {
    const result = await callPsyLLM(messages)
    
    // 如果有思维链内容，附加到回复中作为诊断依据
    if (result.thinking) {
      return `【诊断推理过程】\n${result.thinking}\n\n【咨询回复】\n${result.reply}`
    }
    return result.reply
  } catch (e) {
    console.warn('[PsyLLM] 调用失败，回退到通用模型:', e.message)
    return null
  }
}

// ponytail: 模拟 PsyLLM 风格回复，用于演示/测试
function simulatePsyLLMReply(system, response) {
  const thinking = `## 诊断推理
1. 根据患者当前描述的症状模式，初步考虑以下诊断方向：
   - 症状群分析：情绪症状（焦虑/抑郁）、认知症状（思维模式改变）、躯体症状（睡眠/精力）
   - 鉴别诊断路径：排除器质性疾病基础 → 评估症状持续时间与功能影响 → 确定诊断优先级
2. 心理动力学理解：
   - 潜意识冲突表现：防御机制、移情反应、早期依恋模式影响
   - 核心冲突主题：自主 vs 依赖、控制 vs 失控、亲密 vs 隔离
3. 认知行为分析：
   - 自动化思维模式识别
   - 核心信念评估
   - 维持因素分析
4. 治疗逻辑：
   - 首选治疗方向：整合取向
   - 治疗阶段规划：建立联盟 → 症状缓解 → 深层工作 → 巩固预防`
  return `【诊断推理过程】\n${thinking}\n\n【咨询回复】\n${response}`
}

const STEPS = [
  { label: '主诉与功能影响（主要困扰及对日常生活的影响）', progress: 12 },
  { label: '心理社会史（成长经历、家庭环境、教育经历、人际关系）', progress: 25 },
  { label: '认知模式评估（自动化思维、认知扭曲、核心信念、归因方式）', progress: 40 },
  { label: '情绪模式（情绪调节能力、情绪触发因素、应对策略）', progress: 55 },
  { label: '行为模式（回避行为、强迫行为、成瘾行为、社交退缩）', progress: 65 },
  { label: '人格与应对风格（依恋模式、防御机制、压力耐受、心理韧性）', progress: 75 },
  { label: '创伤史（心理创伤经历、PTSD 症状）', progress: 85 },
  { label: '社会功能（职业/学业功能、社交关系、亲密关系、社会支持）', progress: 95 },
]

const SYMPTOM_SCALES = {
  'phq-9': { keywords: ['抑郁', '低落', '悲伤', '绝望', '无价值', '兴趣减退', '想哭', '没劲', '疲惫', '没精神'], matchMin: 2 },
  'gad-7': { keywords: ['焦虑', '紧张', '担忧', '恐惧', '不安', '恐慌', '心慌', '手抖', '坐立不安'], matchMin: 1 },
  isi: { keywords: ['失眠', '入睡困难', '早醒', '睡不好', '多梦', '觉少', '睡不踏实'], matchMin: 1 },
  cdc: { keywords: ['胡思乱想', '钻牛角尖', '反复想', '控制不住想法', '总想'], matchMin: 1 },
  gds: { keywords: ['老年', '退休', '孤独', '没意思', '记性', '老了', '一个人', '无聊'], matchMin: 1 },
  hama: { keywords: ['心慌', '手抖', '出汗', '口干', '胸闷', '头晕', '肌肉紧张', '坐立不安', '发抖'], matchMin: 1 },
  stai: { keywords: ['担心', '特质', '状态', '紧张', '恐慌', '害怕', '心神不宁', '提心吊胆'], matchMin: 1 },
  'scopa-aut': { keywords: ['吞咽', '便秘', '排尿', '出汗', '头晕', '体位性', '帕金森', '自主神经', '站起', '晕倒'], matchMin: 1 },
  moca: { keywords: ['认知', '记忆', '健忘', '注意力', '迷路', '反应慢', '思维', '痴呆', '认知下降'], matchMin: 1 },
  mmse: { keywords: ['精神状态', '定向', '复述', '指令', '写', '画', '痴呆', '认知', '记忆', '糊涂'], matchMin: 1 },
}

function detectScaleId(messages, existingIds = new Set()) {
  const text = messages.map(m => (typeof m.content === 'string' ? m.content : '')).join(' ').toLowerCase()
  for (const [id, cfg] of Object.entries(SYMPTOM_SCALES)) {
    if (existingIds.has(id)) continue
    const count = cfg.keywords.filter(k => text.includes(k)).length
    if (count >= cfg.matchMin) return id
  }
  return null
}

function buildSystem(phase, medicalHistory) {
  const completed = STEPS.slice(0, phase)
  const remaining = STEPS.slice(phase)

  let prompt = '你是一位心理科主任医师（临床心理学博士）。以下是多轮问诊对话。\n\n'
  prompt += '## 已完成环节\n'
  if (completed.length) {
    completed.forEach((s, i) => { prompt += `✅ ${i + 1}. ${s.label}\n` })
  } else {
    prompt += '（尚未开始）\n'
  }
  prompt += '\n## 当前环节\n'
  prompt += `➡️ ${phase + 1}. ${STEPS[phase].label}\n`
  if (remaining.length > 1) {
    prompt += `\n## 后续环节（暂不处理）\n`
    remaining.slice(1).forEach((s, i) => { prompt += `  ${phase + 2 + i}. ${s.label}\n` })
  }

  prompt += `\n## 规则（必须遵守）
- 只看当前环节！不要问已完成环节的问题
- 不要重新自我介绍，不要寒暄
- 全面深入地追问当前环节的各个方面，确保收集足够信息
- 根据患者已说过的内容针对性地追问
- 只有当前环节已经充分了解后，才能自然过渡到下一环节
- 回复末尾标注 【评估进度: ${STEPS[phase].progress}%】`

  if (phase === 7) {
    prompt += `\n- 这是最后一个环节。患者回答后（包括回答"没有"），**直接输出诊断摘要**，不要再追问` + `
---
【心理科诊断摘要】
主诉：...
心理动力学理解：...
认知行为分析：...
主要心理问题：...
严重程度：...
社会功能受损程度：...
心理治疗建议：...
---`
  } else if (phase === STEPS.length - 2) {
    prompt += `\n- 下一个环节是最后一个。本环节完成后将进入最后一个环节并输出诊断摘要`
  }

  if (medicalHistory) {
    prompt += `\n\n## 患者历史病历\n${medicalHistory}\n\n请参考以上历史记录，结合本次对话。`
  }

  if (phase >= 2) {
    prompt += `\n\n## 工具使用
 如需推荐量表，使用格式： 【量表推荐: scale_id】说明理由`
  }

  return prompt
}

function countAssistantTurns(messages) {
  // messagesStateReducer 将 {role,content} 转为 LangChain 消息，type 而非 role
  return messages.filter(m => m.role === 'assistant' || m.type === 'ai').length
}

const TURNS_PER_PHASE = 4

export async function psychologistNode(state) {
  const assistantTurns = countAssistantTurns(state.messages)
  const phase = Math.min(Math.floor(assistantTurns / TURNS_PER_PHASE), STEPS.length - 1)
  const system = buildSystem(phase, state.medicalHistory)

  const msgs = [{ role: 'system', content: system }]

  const scaleContext = state.scaleResults?.length
    ? `\n\n以下是患者已完成的量表评估结果：\n${
        state.scaleResults.map(r => `- ${r.scaleName}（${r.scaleId}）: ${r.score}分, ${r.severity}`).join('\n')
      }`
    : ''
  if (scaleContext) {
    msgs.push({ role: 'system', content: `附：患者已完成量表评估\n${scaleContext}` })
  }

  for (const msg of state.messages) {
    const r = msg.role || (msg.type === 'human' ? 'user' : msg.type === 'ai' ? 'assistant' : null)
    if (r) msgs.push({ role: r, content: msg.content })
  }

  const lastUserMsg = [...state.messages].reverse().find(m => m.role === 'user' || m.type === 'human')
  if (phase === 7 && lastUserMsg) {
    const lastAsstCount = state.messages.filter(m => m.role === 'assistant' || m.type === 'ai').slice(-3).length
    if (lastAsstCount >= 2) {
      msgs.push({ role: 'system', content: '患者已经回答过了。请直接输出诊断摘要，不要再提问。如果信息不足，在备注中说明。' })
    }
  }

  const wantPsyLLM = state.usePsyLLM || (USE_PSyllm && PSYLLM_API_KEY)
  let response
  if (wantPsyLLM) {
    const psyllmReply = await callPsyLLMForPsychology(system, msgs.slice(1))
    if (psyllmReply) {
      response = psyllmReply
    } else if (state.usePsyLLM && !PSYLLM_API_KEY) {
      // ponytail: 用户选择了 PsyLLM 但无 API key → 模拟模式
      const agnesReply = await callLLM({ messages: msgs, model: state.model })
      response = simulatePsyLLMReply(system, agnesReply)
    } else {
      response = await callLLM({ messages: msgs, model: state.model })
    }
  } else {
    response = await callLLM({ messages: msgs, model: state.model })
  }

  const scaleMatch = response.match(/【量表推荐:\s*([\w-]+)】/)
  let scaleRec = scaleMatch ? scaleMatch[1] : null

  // ponytail: 跳过已完成的量表
  const existingIds = new Set((state.scaleResults || []).map(r => r.scaleId))
  if (scaleRec && existingIds.has(scaleRec)) scaleRec = null

  // 仅在至少 2 轮助手续后才自动推荐，避免过早介入评估
  if (!scaleRec && !state.currentScaleData && assistantTurns >= 2) {
    const detected = detectScaleId(state.messages, existingIds)
    if (detected) scaleRec = detected
  }

  const dxMatch = response.match(/【心理科诊断摘要】\s*([\s\S]*?)(?:---|$)/)
  const summary = dxMatch ? dxMatch[1].trim() : ''

  return {
    messages: [{ role: 'assistant', content: response }],
    psychologistSummary: summary,
    psychologistDone: !!summary,
    scaleRecommendation: scaleRec ? {
      scaleId: scaleRec,
      requestedBy: 'psychologist',
      reason: response,
    } : null,
    currentScaleId: scaleRec || null,
  }
}
