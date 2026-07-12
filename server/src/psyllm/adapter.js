/**
 * PsyLLM API 适配器
 * 心理科专用大语言模型，结合诊断推理和治疗推理
 * 参考: https://github.com/Emo-gml/PsyLLM
 * 
 * 通过 OpenAI 兼容接口调用 PsyLLM 模型
 * 支持思维链推理 (thinking) 和对话生成
 */

const PSYLLM_API_KEY = process.env.PSYLLM_API_KEY
const PSYLLM_BASE_URL = process.env.PSYLLM_BASE_URL || 'https://api.deepseek.com/v1'
const PSYLLM_MODEL = process.env.PSYLLM_MODEL || 'deepseek-reasoner'

/**
 * 调用 PsyLLM 生成心理咨询回复
 * @param {Array} messages - 对话消息数组
 * @param {Object} options - 可选参数
 * @returns {Promise<{reply: string, thinking: string}>}
 */
export async function callPsyLLM(messages, options = {}) {
  if (!PSYLLM_API_KEY) {
    throw new Error('PsyLLM API 未配置，请设置 PSYLLM_API_KEY 环境变量')
  }

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 120000)

  try {
    const res = await fetch(`${PSYLLM_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${PSYLLM_API_KEY}`,
      },
      body: JSON.stringify({
        model: PSYLLM_MODEL,
        messages,
        stream: false,
        temperature: 1.0,
      }),
      signal: controller.signal,
    })
    clearTimeout(timeout)

    if (!res.ok) {
      const err = await res.text()
      throw Object.assign(new Error(`PsyLLM API ${res.status}: ${err}`), { status: res.status })
    }

    const json = await res.json()
    const message = json.choices?.[0]?.message

    return {
      reply: message?.content || '',
      thinking: message?.reasoning_content || '',
    }
  } catch (e) {
    clearTimeout(timeout)
    throw e
  }
}

/**
 * 获取 PsyLLM 可用的模型列表
 * @returns {Array}
 */
export function getPsyLLMModels() {
  return [
    {
      id: 'psyllm-8b',
      name: 'PsyLLM-8B (心理科专用)',
      provider: 'PsyLLM',
      vision: false,
    },
    {
      id: 'psyllm-4b',
      name: 'PsyLLM-4B (心理科专用)',
      provider: 'PsyLLM',
      vision: false,
    },
    {
      id: 'psyllm-1.7b',
      name: 'PsyLLM-1.7B (心理科专用)',
      provider: 'PsyLLM',
      vision: false,
    },
  ]
}

/**
 * 检测是否需要 PsyLLM（心理科场景）
 * @param {string} patientType - 患者类型
 * @returns {boolean}
 */
export function isPsychologyScenario(patientType) {
  return ['anxiety', 'ocd', 'bipolar', 'ptsd', 'social-anxiety', 'adolescent'].includes(patientType)
}
