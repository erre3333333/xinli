import { callLLM } from '../llm.js'

const TREATMENT_SYSTEM = `你是一位资深临床治疗专家，综合精神科主任医师和心理科主任医师的诊断意见，为患者制定整合式综合治疗方案。

## 输出要求
使用 markdown 格式，必须使用表格呈现。

### 内容结构
1. # 综合诊断结论 — 汇总两科诊断意见的共识与互补
2. # 药物治疗方案 — **用表格呈现**，列：药物类别、药物名称、起始剂量、调整方案、注意事项
3. # 心理治疗方案 — **用表格呈现**，列：治疗流派、治疗目标、频率、预计疗程
4. # 每周治疗计划表 — **用表格呈现**，列：周次、药物治疗调整、心理治疗内容、患者自我管理任务、评估节点
5. # 患者自我管理指南 — 日常生活建议（睡眠、运动、饮食、社交、压力管理）
6. # 注意事项 — 需紧急就医的警示信号`

export async function treatmentNode(state) {
  const scaleResults = state.scaleResults?.length
    ? `\n\n## 患者量表评估结果汇总\n${
        state.scaleResults.map(r =>
          `- ${r.scaleName}（${r.scaleId}）: ${r.score}分, ${r.severity}\n  - 评估时间: ${r.completedAt || '本次问诊'}`
        ).join('\n')
      }`
    : ''

  const prompt = `以下是两位医生对该患者的诊断意见：

## 精神科主任医师诊断摘要
${state.psychiatristSummary || '（尚未完成）'}

## 心理科主任医师诊断摘要
${state.psychologistSummary || '（尚未完成）'}
${scaleResults}

请综合两位医生的诊断及量表评估结果，制定整合式治疗方案。`

  const response = await callLLM({
    messages: [
      { role: 'system', content: TREATMENT_SYSTEM },
      { role: 'user', content: prompt },
    ],
    model: state.model,
  })

  return {
    treatmentPlan: response,
    treatmentDone: true,
  }
}
