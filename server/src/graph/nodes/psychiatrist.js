import { callLLM } from '../llm.js'

const STEPS = [
  { label: '主诉（请患者描述主要困扰）', progress: 12 },
  { label: '现病史（起病时间、诱因、病程演变、加重/缓解因素）', progress: 25 },
  { label: '症状系统筛查（情绪、思维、知觉、睡眠、食欲、精力）', progress: 45 },
  { label: '既往史（既往精神科诊断、住院史、自伤自杀史、物质滥用史）', progress: 55 },
  { label: '治疗史（既往用药史：药名、剂量、疗程、疗效、副作用）', progress: 65 },
  { label: '躯体疾病史（甲状腺疾病、脑外伤、癫痫等）', progress: 75 },
  { label: '家族史（精神疾病家族史）', progress: 85 },
  { label: '风险评估（自伤自杀风险、冲动伤人风险、自知力评估）', progress: 95 },
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

  let prompt = '你是一位精神科主任医师。以下是多轮问诊对话。\n\n'
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
【精神科诊断摘要】
主诉：...
诊断印象：（ICD-11 诊断编码和名称）
严重程度：轻/中/重度
风险等级：低/中/高
风险评估详述：...
自知力：完整/部分/丧失
药物治疗建议：...
备注：...
---`
  } else if (phase === STEPS.length - 2) {
    prompt += `\n- 下一个环节是最后一个。本环节完成后将进入风险评估并输出诊断摘要`
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

export async function psychiatristNode(state) {
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

  // ponytail: 最后一步患者已回答后模型仍重复提问时，强制完成
  const lastUserMsg = [...state.messages].reverse().find(m => m.role === 'user' || m.type === 'human')
  if (phase === 7 && lastUserMsg) {
    const riskAsstCount = state.messages.filter(m => m.role === 'assistant' || m.type === 'ai').slice(-3).length
    if (riskAsstCount >= 2) {
      msgs.push({ role: 'system', content: '患者已经回答过了。请直接输出诊断摘要，不要再提问。如果信息不足，在备注中说明。' })
    }
  }

  const response = await callLLM({ messages: msgs, model: state.model })

  const scaleMatch = response.match(/【量表推荐:\s*([\w-]+)】/)
  let scaleRec = scaleMatch ? scaleMatch[1] : null

  // ponytail: 跳过已完成的量表
  const existingIds = new Set((state.scaleResults || []).map(r => r.scaleId))
  if (scaleRec && existingIds.has(scaleRec)) scaleRec = null

  // ponytail: 如果 AI 没推荐但症状匹配，自动推荐量表（跳过已完成的）
  // 仅在至少 2 轮助手续后才自动推荐，避免过早介入评估
  if (!scaleRec && !state.currentScaleData && assistantTurns >= 2) {
    const existingIds = new Set((state.scaleResults || []).map(r => r.scaleId))
    const detected = detectScaleId(state.messages, existingIds)
    if (detected) scaleRec = detected
  }

  const dxMatch = response.match(/【精神科诊断摘要】\s*([\s\S]*?)(?:---|$)/)
  const summary = dxMatch ? dxMatch[1].trim() : ''

  return {
    messages: [{ role: 'assistant', content: response }],
    psychiatristSummary: summary,
    psychiatristDone: !!summary,
    scaleRecommendation: scaleRec ? {
      scaleId: scaleRec,
      requestedBy: 'psychiatrist',
      reason: response,
    } : null,
    currentScaleId: scaleRec || null,
  }
}
