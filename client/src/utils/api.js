const API_BASE = import.meta.env.VITE_API_BASE || ''

function authHeaders() {
  const token = localStorage.getItem('token')
  return token ? { 'Authorization': `Bearer ${token}` } : {}
}

async function api(url, opts = {}) {
  const res = await fetch(`${API_BASE}${url}`, {
    headers: { 'Content-Type': 'application/json', ...authHeaders(), ...opts.headers },
    ...opts,
  })
  if (!res.ok) {
    let msg = `请求失败: ${res.status}`
    try {
      const body = JSON.parse(await res.text())
      msg = body.error || msg
      if (body.needUpgrade) msg += '|NEED_UPGRADE'
    } catch { msg = await res.text().catch(() => msg) }
    throw new Error(msg)
  }
  return res
}

export async function login({ username, password }) {
  const res = await api('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  })
  return res.json()
}

export async function register({ username, password, name }) {
  const res = await api('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({ username, password, name }),
  })
  return res.json()
}

export async function getProfile() {
  const res = await api('/api/auth/profile')
  return res.json()
}

export async function changePassword({ oldPassword, newPassword }) {
  const res = await api('/api/auth/change-password', {
    method: 'PUT',
    body: JSON.stringify({ oldPassword, newPassword }),
  })
  return res.json()
}

export async function getRecords() {
  const res = await api('/api/records')
  return res.json()
}

export async function getPlanUsage() {
  const res = await api('/api/plans/usage')
  return res.json()
}

export async function getPlanInfo() {
  const res = await api('/api/plans/info')
  return res.json()
}

export async function upgradePlan(plan) {
  const res = await api('/api/plans/upgrade', {
    method: 'POST',
    body: JSON.stringify({ plan }),
  })
  return res.json()
}

export async function getMedicalHistory() {
  const res = await api('/api/records/history')
  return res.json()
}

export async function saveRecord(data) {
  const res = await api('/api/records', {
    method: 'POST',
    body: JSON.stringify(data),
  })
  return res.json()
}

export async function sendChatMessage({ message, patientType, history, model, images }) {
  const res = await fetch(`${API_BASE}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify({ message, patientType, history, model, images }),
  })
  if (!res.ok) {
    let msg = `请求失败: ${res.status}`
    try {
      const body = JSON.parse(await res.text())
      msg = body.error || msg
      if (body.needUpgrade) msg += '|NEED_UPGRADE'
    } catch { msg = await res.text().catch(() => msg) }
    throw new Error(msg)
  }
  return res.body.getReader()
}

async function handleErr(res, fallback) {
  let msg = fallback
  try {
    const body = JSON.parse(await res.text())
    msg = body.error || msg
    if (body.needUpgrade) msg += '|NEED_UPGRADE'
  } catch { msg = await res.text().catch(() => msg) }
  throw new Error(msg)
}

export async function sendAssessmentAnalysis({
  testName, testSubtitle, patientType, totalScore,
  maxScore, severity, severityLabel, conditionLabel, answers, model, dimensionScores,
}) {
  const res = await fetch(`${API_BASE}/api/assess`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify({
      testName, testSubtitle, patientType, totalScore,
      maxScore, severity, severityLabel, conditionLabel, answers, model, dimensionScores,
    }),
  })
  if (!res.ok) await handleErr(res, `分析请求失败: ${res.status}`)
  return res.body.getReader()
}

export async function sendComprehensiveAnalysis({ results, model, type }) {
  const res = await fetch(`${API_BASE}/api/comprehensive`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify({ results, model, type }),
  })
  if (!res.ok) await handleErr(res, `综合分析请求失败: ${res.status}`)
  return res.body.getReader()
}

export async function sendPsychiatristChat({ message, history, model }) {
  const res = await fetch(`${API_BASE}/api/diagnosis/psychiatrist`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify({ message, history, model }),
  })
  if (!res.ok) {
    const err = await res.text()
    throw new Error(err || `请求失败: ${res.status}`)
  }
  return res.body.getReader()
}

export async function sendPsychologistChat({ message, history, model }) {
  const res = await fetch(`${API_BASE}/api/diagnosis/psychologist`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify({ message, history, model }),
  })
  if (!res.ok) {
    const err = await res.text()
    throw new Error(err || `心理科问诊请求失败: ${res.status}`)
  }
  return res.body.getReader()
}

export async function sendDiagnosisGraph({ agent, message, history, model, scaleResults, usePsyLLM }) {
  const userId = getUserId()
  const endpoint = agent === 'psychiatrist'
    ? '/api/diagnosis/psychiatrist/graph'
    : '/api/diagnosis/psychologist/graph'
  const res = await fetch(`${API_BASE}${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify({ message, history, model, scaleResults, usePsyLLM, userId }),
  })
  if (!res.ok) {
    const err = await res.text()
    throw new Error(err || `诊断请求失败: ${res.status}`)
  }
  return res.json()
}

export async function submitScaleScore({ scaleId, answers }) {
  const res = await fetch(`${API_BASE}/api/diagnosis/scale-score`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify({ scaleId, answers }),
  })
  if (!res.ok) {
    const err = await res.text()
    throw new Error(err || `量表评分失败: ${res.status}`)
  }
  return res.json()
}

export async function sendServiceGraph({ message, history, model, serviceType, scaleResults }) {
  const userId = getUserId()
  const res = await fetch(`${API_BASE}/api/diagnosis/service/graph`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify({ message, history, model, serviceType, scaleResults, userId }),
  })
  if (!res.ok) {
    const err = await res.text()
    throw new Error(err || `服务咨询请求失败: ${res.status}`)
  }
  return res.json()
}

export async function sendDiagnosisTreatment({ psychiatristSummary, psychologistSummary, model }) {
  const res = await fetch(`${API_BASE}/api/diagnosis/treatment`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify({ psychiatristSummary, psychologistSummary, model }),
  })
  if (!res.ok) {
    const err = await res.text()
    throw new Error(err || `治疗方案请求失败: ${res.status}`)
  }
  return res.json()
}

export async function sendTherapyPlan({ results, model, type }) {
  const res = await fetch(`${API_BASE}/api/comprehensive`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify({ results, model, type }),
  })
  if (!res.ok) {
    const err = await res.text()
    throw new Error(err || `治疗方案请求失败: ${res.status}`)
  }
  return res.body.getReader()
}

export async function sendMedicationAdvice({
  testName, testSubtitle, patientType, totalScore,
  maxScore, severity, severityLabel, conditionLabel, answers, model, dimensionScores,
}) {
  const res = await fetch(`${API_BASE}/api/medication`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify({
      testName, testSubtitle, patientType, totalScore,
      maxScore, severity, severityLabel, conditionLabel, answers, model, dimensionScores,
    }),
  })
  if (!res.ok) await handleErr(res, `用药建议请求失败: ${res.status}`)
  return res.body.getReader()
}

export async function sendFayeMessage({ message, history, emotionContext }) {
  const res = await fetch(`${API_BASE}/api/faye`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify({ message, history, emotionContext }),
  })
  if (!res.ok) {
    const err = await res.text()
    throw new Error(err || `Faye 消息请求失败: ${res.status}`)
  }
  return res.json()
}

export async function analyzeEmotion(message) {
  const res = await fetch(`${API_BASE}/api/faye/emotion`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify({ message }),
  })
  if (!res.ok) {
    const err = await res.text()
    throw new Error(err || `情绪分析请求失败: ${res.status}`)
  }
  return res.json()
}

function getUserId() {
  try {
    const u = localStorage.getItem('user')
    return u ? JSON.parse(u).id : null
  } catch { return null }
}
