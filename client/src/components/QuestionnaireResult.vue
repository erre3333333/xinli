<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { marked } from 'marked'
import { MODELS, getNextModel } from '../config/models.js'
import { sendAssessmentAnalysis, sendMedicationAdvice, sendChatMessage } from '../utils/api.js'

const props = defineProps({
  result: { type: Object, required: true },
  patient: { type: Object, default: null },
  patientColor: { type: String, default: '#7A8C66' },
})

const emit = defineEmits(['back', 'retry'])

const test = computed(() => props.result.test)
const total = computed(() => props.result.total)
const range = computed(() => props.result.range)
const maxScore = computed(() => {
  const qs = test.value.questions
  const maxPerQ = Math.max(...qs.map((q) => Math.max(...q.options.map((o) => o.value))))
  return qs.length * maxPerQ
})
const analysisKey = computed(() => range.value.level)
const analysisText = computed(() => test.value.analysis[analysisKey.value] || '')
const methods = computed(() => test.value.methods || {})

const dimensionResults = computed(() => {
  const dims = test.value.dimensions
  if (!dims || !dims.length) return null
  const answers = props.result.answers
  return dims.map(d => {
    const score = d.items.reduce((s, i) => s + (answers[i] || 0), 0)
    return {
      id: d.id,
      name: d.name,
      score,
      max: d.items.length * 7,
      desc: d.desc,
    }
  })
})

const questionTableData = computed(() => {
  return test.value.questions.map((q, i) => {
    const answerVal = props.result.answers[i]
    const opt = q.options.find((o) => o.value === answerVal)
    return {
      index: i + 1,
      text: q.text,
      label: opt ? opt.label : '-',
      score: answerVal !== undefined ? answerVal : '-',
    }
  })
})

const methodTableData = computed(() => {
  return Object.entries(methods.value).map(([key, desc]) => ({
    key,
    desc,
  }))
})

const activeTab = ref('result')

const medHtml = computed(() => {
  try { return marked.parse(medAdvice.value || '') }
  catch { return medAdvice.value || '' }
})

const aiHtml = computed(() => {
  try { return marked.parse(aiAnalysis.value || '') }
  catch { return aiAnalysis.value || '' }
})

const aiAnalysis = ref('')
const aiLoading = ref(false)
const aiDone = ref(false)
const aiError = ref(null)
const currentAiModel = ref(MODELS[0].id)

const medAdvice = ref('')
const medLoading = ref(false)
const medDone = ref(false)
const medError = ref(null)
const currentMedModel = ref(MODELS[0].id)

const conditionLabels = {
  depression: '抑郁症', anxiety: '焦虑症', ocd: '强迫症',
  bipolar: '双相情感障碍', psychosis: '精神病性障碍',
}
const severityLabels = {
  minimal: '正常', mild: '轻度', moderate: '中度',
  'moderately-severe': '中重度', severe: '重度',
  negative: '阴性', positive: '阳性',
}

function severityTagType(level) {
  if (level === 'minimal' || level === 'negative') return 'success'
  if (level === 'mild') return 'warning'
  if (level === 'moderate') return 'warning'
  return 'danger'
}

async function fetchAiAnalysis() {
  aiAnalysis.value = ''
  aiDone.value = false
  aiError.value = null
  aiLoading.value = true
  const pid = props.patient?.id || 'depression'
  try {
    const reader = await sendAssessmentAnalysis({
      testName: test.value.title, testSubtitle: test.value.subtitle, patientType: pid,
      totalScore: total.value, maxScore: maxScore.value, severity: range.value.severity,
      severityLabel: severityLabels[range.value.level] || range.value.level,
      conditionLabel: conditionLabels[pid] || props.patient?.label || '',
      answers: props.result.answers,
      dimensionScores: dimensionResults.value,
      model: currentAiModel.value,
    })
    const decoder = new TextDecoder()
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      aiAnalysis.value += decoder.decode(value, { stream: true })
    }
    aiDone.value = true
  } catch (e) {
    const next = getNextModel(currentAiModel.value)
    if (next) {
      currentAiModel.value = next
      aiError.value = `模型 ${currentAiModel.value} 失效，自动切换…`
      await fetchAiAnalysis()
      return
    }
    const m = e.message || String(e)
    aiError.value = m.includes('|NEED_UPGRADE') ? '该功能仅对付费用户开放' : m
  } finally {
    aiLoading.value = false
  }
}

async function fetchMedicationAdvice() {
  medAdvice.value = ''
  medDone.value = false
  medError.value = null
  medLoading.value = true
  const pid = props.patient?.id || 'depression'
  try {
    const reader = await sendMedicationAdvice({
      testName: test.value.title, testSubtitle: test.value.subtitle, patientType: pid,
      totalScore: total.value, maxScore: maxScore.value, severity: range.value.severity,
      severityLabel: severityLabels[range.value.level] || range.value.level,
      conditionLabel: conditionLabels[pid] || props.patient?.label || '',
      answers: props.result.answers,
      dimensionScores: dimensionResults.value,
      model: currentMedModel.value,
    })
    const decoder = new TextDecoder()
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      medAdvice.value += decoder.decode(value, { stream: true })
    }
    medDone.value = true
  } catch (e) {
    const next = getNextModel(currentMedModel.value)
    if (next) {
      currentMedModel.value = next
      medError.value = `模型 ${currentMedModel.value} 失效，自动切换…`
      await fetchMedicationAdvice()
      return
    }
    const m = e.message || String(e)
    medError.value = m.includes('|NEED_UPGRADE') ? '该功能仅对付费用户开放' : m
  } finally {
    medLoading.value = false
  }
}

const medChat = ref([])
const chatInput = ref('')
const chatLoading = ref(false)
const chatRef = ref(null)

async function scrollChat() {
  await nextTick()
  if (chatRef.value) chatRef.value.scrollTop = chatRef.value.scrollHeight
}

async function sendChat() {
  const text = chatInput.value.trim()
  if (!text || chatLoading.value) return
  chatInput.value = ''
  medChat.value.push({ role: 'user', content: text })
  await scrollChat()
  chatLoading.value = true
  medChat.value.push({ role: 'assistant', content: '' })
  const aiMsgIdx = medChat.value.length - 1
  const pid = props.patient?.id || 'depression'
  const condLabel = conditionLabels[pid] || props.patient?.label || ''
  const sevLabel = severityLabels[range.value.level] || range.value.level
  const systemMsg = `你是一名精神科医生。请基于以下评估结果回答患者的用药和疾病相关问题。\n\n评估工具：${test.value.title}\n评估对象：${condLabel}\n得分：${total.value}/${maxScore.value}\n严重程度：${sevLabel}\n\n请用中文回答，语言温暖专业。`
  const chatHistory = medChat.value.slice(0, -1).map((m) => ({ role: m.role, content: m.content }))
  try {
    const reader = await sendChatMessage({
      message: text, patientType: pid, model: currentMedModel.value,
      history: [{ role: 'system', content: systemMsg }, ...chatHistory],
    })
    const decoder = new TextDecoder()
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      medChat.value[aiMsgIdx].content += decoder.decode(value, { stream: true })
      await scrollChat()
    }
  } catch (e) {
    medChat.value[aiMsgIdx].content = `抱歉，对话出现错误：${e.message}`
  } finally {
    chatLoading.value = false
  }
}

function crisisNote() {
  return props.patient?.id === 'depression' && (props.result.answers[8] || 0) >= 1
}

function toChat() { emit('back') }

onMounted(fetchAiAnalysis)
</script>

<template>
  <div class="result-wrap">
    <el-tabs v-model="activeTab" class="result-tabs" @tab-change="(k) => { if (k === 'med') fetchMedicationAdvice() }">
      <el-tab-pane label="测评结果" name="result">
        <div class="result-summary">
          <div class="summary-left">
            <div class="summary-title">{{ test.title }}</div>
            <el-tag :type="severityTagType(range.level)" size="small">{{ range.severity }}</el-tag>
          </div>
          <div class="summary-right">
            <span class="summary-score">{{ total }}</span>
            <span class="summary-divider">/</span>
            <span class="summary-max">{{ maxScore }}</span>
          </div>
        </div>

        <el-table :data="questionTableData" size="small" stripe max-height="360" class="q-table">
          <el-table-column type="index" label="#" width="48" />
          <el-table-column prop="text" label="题目" min-width="200" show-overflow-tooltip />
          <el-table-column prop="label" label="您的选择" width="140" />
          <el-table-column prop="score" label="得分" width="70" align="center" />
        </el-table>

        <el-alert
          v-if="test.scoring.note"
          :title="test.scoring.note"
          type="warning"
          show-icon
          :closable="false"
          class="section-gap"
        />

        <el-alert
          v-if="crisisNote()"
          title="自伤风险提示"
          type="error"
          show-icon
          :closable="false"
          class="section-gap"
        >
          <template #default>
            <p>您在第 9 题（自伤念头）的回答表明可能存在自伤风险。请立即拨打心理援助热线：<strong>400-161-9995</strong> 或前往就近医院急诊。</p>
          </template>
        </el-alert>

        <div class="section-hd">分析</div>
        <div class="analysis-text">{{ analysisText }}</div>

        <div v-if="methodTableData.length" class="section-hd">参考干预方法</div>
        <el-table v-if="methodTableData.length" :data="methodTableData" size="small">
          <el-table-column prop="key" label="方法" width="120" />
          <el-table-column prop="desc" label="说明" min-width="200" />
        </el-table>
      </el-tab-pane>

      <el-tab-pane label="AI 分析" name="ai">
        <div class="tab-header">
          <span class="tab-header-title">AI 深度分析</span>
          <el-button v-if="aiDone" size="small" :loading="aiLoading" @click="fetchAiAnalysis">重新生成</el-button>
        </div>

        <div v-if="aiLoading && !aiAnalysis" class="loading-state">
          <el-icon class="loading-icon"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 11-6.219-8.56"/></svg></el-icon>
          <span>AI 正在分析您的测评结果…</span>
        </div>

        <el-alert
          v-if="aiError && !aiAnalysis"
          :title="aiError"
          type="error"
          show-icon
          :closable="false"
        >
          <template #default>
            <el-button size="small" type="danger" @click="fetchAiAnalysis">重试</el-button>
          </template>
        </el-alert>

        <div v-if="aiAnalysis" class="result-card">
          <div class="result-card-body md" v-html="aiHtml"></div>
        </div>
      </el-tab-pane>

      <el-tab-pane label="用药建议" name="med">
        <div v-if="medLoading && !medAdvice" class="loading-state">
          <el-icon class="loading-icon"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 11-6.219-8.56"/></svg></el-icon>
          <span>AI 精神科医生正在分析…</span>
        </div>

        <el-alert
          v-if="medError && !medAdvice"
          :title="medError"
          type="error"
          show-icon
          :closable="false"
        >
          <template #default>
            <el-button size="small" type="danger" @click="fetchMedicationAdvice">重试</el-button>
          </template>
        </el-alert>

        <div v-if="medAdvice" class="result-card result-card--med">
          <div class="result-card-body md" v-html="medHtml"></div>
        </div>

        <div class="chat-section">
          <div class="chat-header">与精神科医生对话</div>
          <div class="chat-msgs" ref="chatRef">
            <div v-if="!medChat.length" class="chat-empty">
              <p>您可以就用药方案、副作用、疾病相关问题向精神科医生咨询。</p>
            </div>
            <div v-for="(msg, i) in medChat" :key="i" class="chat-msg" :class="msg.role">
              <div class="chat-bubble" :class="msg.role">
                <div v-if="msg.role === 'user'" class="chat-text">{{ msg.content }}</div>
                <div v-else class="md" v-html="marked.parse(msg.content || '')"></div>
              </div>
            </div>
          </div>
          <div class="chat-input-bar">
            <el-input
              v-model="chatInput"
              placeholder="输入您的问题…"
              :disabled="chatLoading"
              size="small"
              @keydown.enter="sendChat"
            />
            <el-button
              type="primary"
              size="small"
              :disabled="!chatInput.trim() || chatLoading"
              @click="sendChat"
            >发送</el-button>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>

    <div class="actions">
      <el-button type="primary" @click="toChat">回到咨询</el-button>
      <el-button @click="emit('retry')">重新测评</el-button>
    </div>
  </div>
</template>

<style scoped>
.result-wrap {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding: 20px 24px;
}

.result-tabs {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.result-tabs :deep(.el-tabs__content) {
  flex: 1;
  overflow-y: auto;
  padding: 16px 0;
}
.result-tabs :deep(.el-tab-pane) {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.result-summary {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 18px;
  background: var(--surface);
  border: 1px solid var(--hairline);
  border-radius: 8px;
}
.summary-left {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.summary-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--ink);
}
.summary-right {
  display: flex;
  align-items: baseline;
  gap: 4px;
}
.summary-score {
  font-size: 28px;
  font-weight: 500;
  font-family: var(--font-mono);
  color: var(--ink);
  line-height: 1;
}
.summary-divider {
  font-size: 18px;
  color: var(--ink-muted);
}
.summary-max {
  font-size: 16px;
  color: var(--ink-muted);
}

.q-table {
  border: 1px solid var(--hairline);
  border-radius: 6px;
}
.q-table :deep(.el-table__header th) {
  background: var(--surface-soft);
  font-size: 12px;
  font-weight: 600;
  color: var(--ink-secondary);
}

.section-gap {
  margin-top: 4px;
}

.section-hd {
  font-size: 13px;
  font-weight: 600;
  color: var(--ink-muted);
  padding: 2px 0;
}

.analysis-text {
  font-size: 13px;
  color: var(--ink-secondary);
  line-height: 1.7;
  padding: 12px 16px;
  background: var(--surface);
  border: 1px solid var(--hairline);
  border-radius: 6px;
}

.tab-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.tab-header-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--ink);
}

.loading-state {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 40px 0;
  font-size: 13px;
  color: var(--ink-muted);
}
.loading-icon {
  animation: spin 1s linear infinite;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}

.chat-section {
  border: 1px solid var(--hairline);
  border-radius: 8px;
  overflow: hidden;
}
.chat-header {
  font-size: 13px;
  font-weight: 600;
  color: var(--ink);
  padding: 12px 16px;
  border-bottom: 1px solid var(--hairline);
}
.chat-msgs {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 14px;
  max-height: 320px;
  overflow-y: auto;
  background: var(--surface);
}
.chat-empty {
  text-align: center;
  padding: 24px 0;
}
.chat-empty p {
  font-size: 13px;
  color: var(--ink-muted);
  margin: 0;
}
.chat-msg {
  display: flex;
  max-width: 80%;
}
.chat-msg.user {
  align-self: flex-end;
}
.chat-msg.assistant {
  align-self: flex-start;
}
.chat-bubble {
  padding: 8px 14px;
  border-radius: 8px;
  font-size: 13px;
  line-height: 1.6;
}
.chat-bubble.user {
  background: var(--ink);
  color: var(--on-primary);
  border-bottom-right-radius: 2px;
}
.chat-bubble.assistant {
  background: var(--surface-soft);
  color: var(--ink);
  border-bottom-left-radius: 2px;
}
.chat-text {
  white-space: pre-wrap;
  word-break: break-word;
}
.chat-input-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  border-top: 1px solid var(--hairline);
  background: var(--surface);
}

.actions {
  display: flex;
  gap: 10px;
  padding-top: 16px;
  border-top: 1px solid var(--hairline);
  flex-shrink: 0;
}

.result-card {
  background: var(--surface);
  border: 1px solid var(--hairline);
  border-radius: var(--r-md);
  overflow: hidden;
}

.result-card--med {
  border-color: #d4e8d4;
}

.result-card-body {
  padding: 20px 24px;
}

.md {
  font-size: 14px;
  color: var(--ink);
  line-height: 1.8;
  white-space: normal;
}

.md h1 {
  font-size: 17px;
  font-weight: 700;
  color: var(--ink);
  margin: 24px 0 12px;
  padding: 0 0 0 14px;
  border-left: 3px solid var(--primary);
  line-height: 1.4;
}
.md h1:first-child { margin-top: 0; }

.md h2 {
  font-size: 15px;
  font-weight: 600;
  color: var(--ink);
  margin: 20px 0 10px;
  padding: 0 0 8px;
  border-bottom: 2px solid var(--hairline-soft);
  line-height: 1.4;
}

.md h3 {
  font-size: 14px;
  font-weight: 600;
  color: var(--ink-secondary);
  margin: 16px 0 8px;
}

.md p {
  margin: 10px 0;
  color: var(--ink-secondary);
}

.md strong {
  font-weight: 600;
  color: var(--ink);
}

.md table {
  width: 100%;
  border-collapse: collapse;
  margin: 16px 0;
  font-size: 13px;
  line-height: 1.6;
  border: 1px solid var(--hairline);
  border-radius: var(--r-sm);
  overflow: hidden;
}
.md th {
  background: linear-gradient(180deg, #f5f6f8, #eaebed);
  font-weight: 600;
  white-space: nowrap;
  color: var(--ink);
  padding: 10px 14px;
  text-align: left;
  font-size: 12px;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  border: 1px solid #d0d2d6;
}
.md td {
  padding: 10px 14px;
  text-align: left;
  vertical-align: top;
  color: var(--ink-secondary);
  transition: background 0.15s;
  border: 1px solid #d0d2d6;
}
.md tbody tr:hover td {
  background: #f0f2f5;
}
.md tbody tr:nth-child(even) td {
  background: #f8f9fb;
}
.md tbody tr:nth-child(even):hover td {
  background: #eef0f3;
}
.md td:first-child {
  font-weight: 500;
  color: var(--ink);
}

.md ul, .md ol {
  padding-left: 22px;
  margin: 10px 0;
}
.md li {
  margin: 6px 0;
  color: var(--ink-secondary);
  line-height: 1.7;
}
.md li::marker {
  color: var(--primary);
}

.md hr {
  border: none;
  height: 1px;
  background: var(--hairline);
  margin: 24px 0;
}

.md blockquote {
  margin: 16px 0;
  padding: 12px 16px;
  background: #f8f6ff;
  border-left: 3px solid var(--primary);
  border-radius: 0 var(--r-xs) var(--r-xs) 0;
  color: var(--ink-secondary);
  font-size: 13px;
  line-height: 1.7;
}
.md blockquote p {
  margin: 0;
  color: var(--ink-secondary);
}

.md code {
  font-family: var(--font-mono);
  font-size: 12px;
  padding: 2px 6px;
  background: var(--surface-soft);
  border-radius: 3px;
  color: var(--ink);
}

.md pre {
  margin: 16px 0;
  padding: 16px 18px;
  background: var(--surface-soft);
  border: 1px solid var(--hairline);
  border-radius: var(--r-sm);
  overflow-x: auto;
  font-size: 12px;
  line-height: 1.6;
}
.md pre code {
  padding: 0;
  background: none;
}

@media (max-width: 600px) {
  .result-card-body { padding: 14px 16px; }
  .md { font-size: 13px; }
  .md th, .md td { padding: 8px 10px; }
}

@media (max-width: 600px) {
  .result-wrap { padding: 12px 14px; }
  .summary-score { font-size: 22px; }
}
</style>
