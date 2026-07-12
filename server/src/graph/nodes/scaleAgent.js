import { getScaleById } from '../../data/questionnaires.js'

// 当医生推荐量表时，返回量表信息供前端展示
export function recommendScaleNode(state) {
  const rec = state.scaleRecommendation
  if (!rec) return {}

  const scale = getScaleById(rec.scaleId)
  if (!scale) {
    const fallback = [{ id: 'phq-9', title: 'PHQ-9 抑郁症筛查量表', category: 'depression', maxScore: 27 }]
    return {
      currentScaleData: {
        scales: fallback,
        requestedBy: rec.requestedBy,
        reason: rec.reason,
      },
      scaleRecommendation: null,
    }
  }

  return {
    currentScaleData: {
      scales: [scale],
      requestedBy: rec.requestedBy,
      reason: rec.reason,
    },
    scaleRecommendation: null,
  }
}

// 当患者提交量表结果后，处理结果并反馈给医生
export function processScaleResultNode(state) {
  const results = state.scaleResults
  const lastResult = results?.[results.length - 1]
  if (!lastResult) return {}

  const scale = getScaleById(lastResult.scaleId)
  const severityInfo = scale?.severityRanges?.find(
    r => lastResult.score >= r.min && lastResult.score <= r.max
  )

  // 生成结果摘要消息，注入对话
  const resultMsg = {
    role: 'system',
    content: `【量表结果反馈】患者已完成 ${lastResult.scaleName}（${lastResult.scaleId}）评估。得分：${lastResult.score}分，严重程度：${severityInfo?.label || lastResult.severity}。请在问诊中参考此结果。`,
  }

  return {
    messages: [resultMsg],
  }
}
