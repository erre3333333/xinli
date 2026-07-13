<script setup>
import { ref, computed, onMounted } from 'vue'
import { marked } from 'marked'
import { QUESTIONNAIRES, getScoreRange } from '../config/questionnaires.js'
import { MODELS, getNextModel } from '../config/models.js'
import { sendComprehensiveAnalysis, sendTherapyPlan } from '../utils/api.js'

const emit = defineEmits(['back'])

const storedResults = ref({})
const tests = computed(() => {
  const items = []
  for (const [id, data] of Object.entries(storedResults.value)) {
    for (const cat of Object.values(QUESTIONNAIRES)) {
      const test = cat.find((t) => t.id === id)
      if (test) {
        const maxPerQ = Math.max(...test.questions.map((q) => Math.max(...q.options.map((o) => o.value))))
        const maxScore = test.questions.length * maxPerQ
        const range = getScoreRange(test.scoring.ranges, data.total)
        items.push({
          id: test.id,
          title: test.title,
          subtitle: test.subtitle,
          totalScore: data.total,
          maxScore,
          severity: range.severity,
          severityLabel: range.severity,
          level: range.level,
          answers: data.answers,
          timestamp: data.timestamp,
        })
        break
      }
    }
  }
  items.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0))
  return items
})

const hasResults = computed(() => tests.value.length > 0)
const activeTab = ref('analysis')
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

const cbtPlan = ref('')
const cbtLoading = ref(false)
const cbtDone = ref(false)
const cbtError = ref(null)
const currentCbtModel = ref(MODELS[0].id)

const actPlan = ref('')
const actLoading = ref(false)
const actDone = ref(false)
const actError = ref(null)
const currentActModel = ref(MODELS[0].id)

const aiHtml = computed(() => {
  try { return marked.parse(aiAnalysis.value || '') }
  catch { return aiAnalysis.value || '' }
})

const medHtml = computed(() => {
  try { return marked.parse(medAdvice.value || '') }
  catch { return medAdvice.value || '' }
})

const cbtHtml = computed(() => {
  try { return marked.parse(cbtPlan.value || '') }
  catch { return cbtPlan.value || '' }
})

const actHtml = computed(() => {
  try { return marked.parse(actPlan.value || '') }
  catch { return actPlan.value || '' }
})

async function fetchAnalysis() {
  aiAnalysis.value = ''
  aiDone.value = false
  aiError.value = null
  aiLoading.value = true
  currentAiModel.value = MODELS[0].id

  const results = tests.value.map((t) => ({
    testName: t.title,
    testSubtitle: t.subtitle,
    totalScore: t.totalScore,
    maxScore: t.maxScore,
    severity: t.severity,
    severityLabel: t.severity,
    answers: t.answers,
  }))

  try {
    const reader = await sendComprehensiveAnalysis({
      results, model: currentAiModel.value, type: 'analysis',
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
      await fetchAnalysis()
      return
    }
    aiError.value = e.message || String(e)
  } finally {
    aiLoading.value = false
  }
}

async function fetchMedication() {
  medAdvice.value = ''
  medDone.value = false
  medError.value = null
  medLoading.value = true
  currentMedModel.value = MODELS[0].id

  const results = tests.value.map((t) => ({
    testName: t.title,
    testSubtitle: t.subtitle,
    totalScore: t.totalScore,
    maxScore: t.maxScore,
    severity: t.severity,
    severityLabel: t.severity,
    answers: t.answers,
  }))

  try {
    const reader = await sendComprehensiveAnalysis({
      results, model: currentMedModel.value, type: 'medication',
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
      await fetchMedication()
      return
    }
    medError.value = e.message || String(e)
  } finally {
    medLoading.value = false
  }
}

function severityTagType(level) {
  if (level === 'minimal') return 'success'
  if (level === 'mild') return 'warning'
  if (level === 'moderate') return 'warning'
  return 'danger'
}

function buildResults() {
  return tests.value.map((t) => ({
    testName: t.title,
    testSubtitle: t.subtitle,
    totalScore: t.totalScore,
    maxScore: t.maxScore,
    severity: t.severity,
    severityLabel: t.severity,
    answers: t.answers,
  }))
}

async function fetchCbt() {
  cbtPlan.value = ''
  cbtDone.value = false
  cbtError.value = null
  cbtLoading.value = true
  currentCbtModel.value = MODELS[0].id
  try {
    const reader = await sendTherapyPlan({ results: buildResults(), model: currentCbtModel.value, type: 'therapy-cbt' })
    const decoder = new TextDecoder()
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      cbtPlan.value += decoder.decode(value, { stream: true })
    }
    cbtDone.value = true
  } catch (e) {
    const next = getNextModel(currentCbtModel.value)
    if (next) { currentCbtModel.value = next; await fetchCbt(); return }
    cbtError.value = e.message || String(e)
  } finally { cbtLoading.value = false }
}

async function fetchAct() {
  actPlan.value = ''
  actDone.value = false
  actError.value = null
  actLoading.value = true
  currentActModel.value = MODELS[0].id
  try {
    const reader = await sendTherapyPlan({ results: buildResults(), model: currentActModel.value, type: 'therapy-act' })
    const decoder = new TextDecoder()
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      actPlan.value += decoder.decode(value, { stream: true })
    }
    actDone.value = true
  } catch (e) {
    const next = getNextModel(currentActModel.value)
    if (next) { currentActModel.value = next; await fetchAct(); return }
    actError.value = e.message || String(e)
  } finally { actLoading.value = false }
}

onMounted(() => {
  storedResults.value = JSON.parse(localStorage.getItem('dash-results') || '{}')
})
</script>

<template>
  <div class="comprehensive">
    <div class="comp-header">
      <button class="comp-back" @click="emit('back')" aria-label="返回">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
      </button>
      <div>
        <h2 class="comp-title">综合报告</h2>
        <p class="comp-desc">汇集所有已完成量表，AI 综合分析</p>
      </div>
    </div>

    <template v-if="!hasResults">
      <div class="empty">
        <div class="empty-icon">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--ink-muted)" stroke-width="1.2" stroke-linecap="round"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/><path d="M9 14l2 2 4-4"/></svg>
        </div>
        <p class="empty-text">尚未完成任何量表测评</p>
        <p class="empty-hint">请先前往「量表中心」完成测评</p>
      </div>
    </template>

    <template v-else>
      <div class="summary-cards">
        <div
          v-for="t in tests"
          :key="t.id"
          class="sc-item"
          :class="'sev-' + (t.level || 'minimal')"
        >
          <div class="sc-top">
            <span class="sc-title">{{ t.title }}</span>
          </div>
          <div class="sc-bottom">
            <span class="sc-score">{{ t.totalScore }}/{{ t.maxScore }}</span>
            <span class="sc-sev" :class="'tag-' + severityTagType(t.level)">{{ t.severity }}</span>
          </div>
        </div>
      </div>

      <el-tabs v-model="activeTab" class="comp-tabs">
        <el-tab-pane label="AI 综合分析" name="analysis">
          <div class="tab-header">
            <el-button v-if="!aiDone && !aiLoading" type="primary" size="small" @click="fetchAnalysis">开始分析</el-button>
            <el-button v-if="aiDone" size="small" :loading="aiLoading" @click="fetchAnalysis">重新生成</el-button>
          </div>

          <div v-if="aiLoading && !aiAnalysis" class="loading-state">
            <el-icon class="loading-icon"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 11-6.219-8.56"/></svg></el-icon>
            <span>AI 正在综合所有测评结果进行分析…</span>
          </div>

          <el-alert
            v-if="aiError && !aiAnalysis"
            :title="aiError"
            type="error"
            show-icon
            :closable="false"
          >
            <template #default>
              <el-button size="small" type="danger" @click="fetchAnalysis">重试</el-button>
            </template>
          </el-alert>

          <div v-if="aiAnalysis" class="result-card">
            <div class="result-card-body md" v-html="aiHtml"></div>
          </div>
        </el-tab-pane>

        <el-tab-pane label="综合用药建议" name="medication">
          <div class="tab-header">
            <el-button v-if="!medDone && !medLoading" type="primary" size="small" @click="fetchMedication">获取建议</el-button>
            <el-button v-if="medDone" size="small" :loading="medLoading" @click="fetchMedication">重新生成</el-button>
          </div>

          <div v-if="medLoading && !medAdvice" class="loading-state">
            <el-icon class="loading-icon"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 11-6.219-8.56"/></svg></el-icon>
            <span>AI 精神科医生正在综合分析用药方案…</span>
          </div>

          <el-alert
            v-if="medError && !medAdvice"
            :title="medError"
            type="error"
            show-icon
            :closable="false"
          >
            <template #default>
              <el-button size="small" type="danger" @click="fetchMedication">重试</el-button>
            </template>
          </el-alert>

          <div v-if="medAdvice" class="result-card result-card--med">
            <div class="result-card-body md" v-html="medHtml"></div>
          </div>
        </el-tab-pane>

        <el-tab-pane label="CBT 治疗方案" name="cbt">
          <div class="tab-header">
            <el-button v-if="!cbtDone && !cbtLoading" type="primary" size="small" @click="fetchCbt">生成方案</el-button>
            <el-button v-if="cbtDone" size="small" :loading="cbtLoading" @click="fetchCbt">重新生成</el-button>
          </div>
          <div v-if="cbtLoading && !cbtPlan" class="loading-state">
            <el-icon class="loading-icon"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 11-6.219-8.56"/></svg></el-icon>
            <span>AI 正在制定 CBT 治疗方案…</span>
          </div>
          <el-alert v-if="cbtError && !cbtPlan" :title="cbtError" type="error" show-icon :closable="false">
            <template #default><el-button size="small" type="danger" @click="fetchCbt">重试</el-button></template>
          </el-alert>
          <div v-if="cbtPlan" class="result-card">
            <div class="result-card-body md" v-html="cbtHtml"></div>
          </div>
        </el-tab-pane>

        <el-tab-pane label="ACT 治疗方案" name="act">
          <div class="tab-header">
            <el-button v-if="!actDone && !actLoading" type="primary" size="small" @click="fetchAct">生成方案</el-button>
            <el-button v-if="actDone" size="small" :loading="actLoading" @click="fetchAct">重新生成</el-button>
          </div>
          <div v-if="actLoading && !actPlan" class="loading-state">
            <el-icon class="loading-icon"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 11-6.219-8.56"/></svg></el-icon>
            <span>AI 正在制定 ACT 治疗方案…</span>
          </div>
          <el-alert v-if="actError && !actPlan" :title="actError" type="error" show-icon :closable="false">
            <template #default><el-button size="small" type="danger" @click="fetchAct">重试</el-button></template>
          </el-alert>
          <div v-if="actPlan" class="result-card">
            <div class="result-card-body md" v-html="actHtml"></div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </template>
  </div>
</template>

<style scoped>
.comprehensive {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  padding: 24px;
  background: linear-gradient(180deg, #FFFAF5, #FFFFFF);
}

.comp-header {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 20px;
}

.comp-back {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  color: var(--ink-secondary);
  flex-shrink: 0;
  margin-top: 2px;
  transition: all 0.2s var(--ease-out);
}
.comp-back:hover {
  background: var(--surface-hover);
  color: var(--ink);
}

.comp-title {
  font-size: 20px;
  font-weight: 600;
  background: linear-gradient(135deg, #8B5E3C, #FB7299);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.comp-desc {
  font-size: 13px;
  color: #8B7355;
}

.empty {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 60px 0;
}
.empty-text {
  font-size: 15px;
  color: var(--ink-muted);
  margin-top: 12px;
}
.empty-hint {
  font-size: 13px;
  color: var(--ink-muted);
  opacity: 0.7;
}

.summary-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 10px;
  margin-bottom: 20px;
}

.sc-item {
  background: linear-gradient(135deg, #FFFFFF, #FFF9F5);
  border: 1px solid rgba(200, 150, 100, 0.1);
  border-radius: var(--r-sm);
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  transition: all 0.2s var(--ease-out);
  box-shadow: 0 1px 4px rgba(139, 94, 60, 0.04);
}
.sc-item:hover {
  border-color: #FB7299;
  box-shadow: 0 2px 12px rgba(251, 114, 153, 0.1);
}

.sc-top {
  display: flex;
  align-items: center;
  gap: 6px;
}
.sc-title {
  font-size: 13px;
  font-weight: 600;
  color: #8B5E3C;
}
.sc-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.sc-score {
  font-size: 18px;
  font-weight: 500;
  font-family: var(--font-mono);
  color: #8B5E3C;
}
.sc-sev {
  font-size: 11px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: var(--r-pill);
}
.tag-success { background: var(--green-soft); color: var(--green); }
.tag-warning { background: var(--amber-soft); color: var(--amber); }
.tag-danger { background: var(--red-soft); color: var(--red); }

.sc-item.sev-minimal { border-left: 3px solid var(--green); }
.sc-item.sev-mild { border-left: 3px solid var(--amber); }
.sc-item.sev-moderate { border-left: 3px solid #f59e0b; }
.sc-item.sev-moderately-severe { border-left: 3px solid var(--red); }
.sc-item.sev-severe { border-left: 3px solid var(--red); }

.comp-tabs {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.comp-tabs :deep(.el-tabs__content) {
  flex: 1;
  overflow-y: auto;
  padding: 16px 0;
}
.comp-tabs :deep(.el-tab-pane) {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.tab-header {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.loading-state {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 40px 0;
  font-size: 13px;
  color: #8B7355;
}
.loading-icon {
  animation: spin 1s linear infinite;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}

.result-card {
  background: linear-gradient(135deg, #FFFFFF, #FFF9F5);
  border: 1px solid rgba(200, 150, 100, 0.1);
  border-radius: var(--r-md);
  overflow: hidden;
  box-shadow: 0 1px 4px rgba(139, 94, 60, 0.04);
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
  color: #8B5E3C;
  margin: 24px 0 12px;
  padding: 0 0 0 14px;
  border-left: 3px solid #FB7299;
}
.md h1:first-child { margin-top: 0; }
.md h2 {
  font-size: 15px;
  font-weight: 600;
  color: #8B5E3C;
  margin: 20px 0 10px;
  padding: 0 0 8px;
  border-bottom: 2px solid rgba(200, 150, 100, 0.1);
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
}
.md code {
  font-family: var(--font-mono);
  font-size: 12px;
  padding: 2px 6px;
  background: var(--surface-soft);
  border-radius: 3px;
  color: var(--ink);
}

@media (max-width: 600px) {
  .comprehensive { padding: 16px; }
  .result-card-body { padding: 14px 16px; }
  .summary-cards { grid-template-columns: 1fr; }
}
</style>
