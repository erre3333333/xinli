<script setup>
import { ref, computed } from 'vue'
import QuestionnaireForm from './QuestionnaireForm.vue'
import QuestionnaireResult from './QuestionnaireResult.vue'
import { QUESTIONNAIRES, getScoreRange } from '../config/questionnaires.js'
import { PATIENT_TYPES } from '../config/models.js'

const props = defineProps({
  patient: { type: Object, required: true },
  patientColor: { type: String, default: '#7A8C66' },
})

const emit = defineEmits(['back'])

const tests = computed(() => QUESTIONNAIRES[props.patient.id] || [])

const selectedTest = ref(null)
const phase = ref('list')
const lastResult = ref(null)

const storedResults = ref(JSON.parse(localStorage.getItem('patient-results') || '{}'))

function getStoredKey(tid) {
  return props.patient.id + '_' + tid
}

function isCompleted(tid) {
  return getStoredKey(tid) in storedResults.value
}

function getStored(tid) {
  return storedResults.value[getStoredKey(tid)] || null
}

function selectTest(test) {
  selectedTest.value = test
  phase.value = 'form'
}

function viewResult(test) {
  const stored = getStored(test.id)
  if (!stored) return
  const range = getScoreRange(test.scoring.ranges, stored.total)
  lastResult.value = { total: stored.total, range, answers: stored.answers, test }
  phase.value = 'result'
}

function onComplete(answers) {
  const test = selectedTest.value
  const total = answers.reduce((s, a) => s + a, 0)
  const range = getScoreRange(test.scoring.ranges, total)
  lastResult.value = { total, range, answers, test }
  storedResults.value[getStoredKey(test.id)] = { total, answers, timestamp: Date.now() }
  localStorage.setItem('patient-results', JSON.stringify(storedResults.value))
  phase.value = 'result'
}

function backToList() {
  selectedTest.value = null
  lastResult.value = null
  phase.value = 'list'
}
</script>

<template>
  <div class="stage">
    <div class="stage-inner">
      <div class="stage-header-2">
        <span class="sh2-icon" :style="{ background: patientColor }">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/></svg>
        </span>
        <div>
          <span class="sh2-title">{{ patient.label }} · 心理测评</span>
          <span class="sh2-count">{{ tests.length }} 个量表可用</span>
        </div>
      </div>

      <div v-if="phase === 'list'" class="card-grid">
        <div v-for="t in tests" :key="t.id" class="card-item">
          <div class="ci-accent" :style="{ background: patientColor }"></div>
          <div class="ci-body">
            <span class="ci-title">{{ t.title }}</span>
            <span class="ci-sub">{{ t.subtitle }}</span>
            <p class="ci-desc">{{ t.desc }}</p>
            <div class="ci-meta">
              <span>{{ t.time }}</span>
              <span class="ci-divider"></span>
              <span>{{ t.questions.length }} 题</span>
            </div>
            <div class="ci-actions">
              <button class="cia-btn primary" @click="selectTest(t)">
                {{ isCompleted(t.id) ? '重新测评' : '开始评估' }}
              </button>
              <button v-if="isCompleted(t.id)" class="cia-btn ghost" @click="viewResult(t)">查看测评结果分析</button>
            </div>
          </div>
        </div>
        <div class="stage-note">* 标准筛查工具，仅供初步参考</div>
      </div>

      <QuestionnaireForm
        v-else-if="phase === 'form'"
        :test="selectedTest"
        @cancel="backToList"
        @complete="onComplete"
      />

      <QuestionnaireResult
        v-else-if="phase === 'result'"
        :result="lastResult"
        :patient="patient"
        :patientColor="patientColor"
        @back="backToList"
        @retry="backToList"
      />
    </div>
  </div>
</template>

<style scoped>
.stage {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  padding: 24px;
  overflow: hidden;
}

.stage-inner {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: 640px;
  margin: 0 auto;
  width: 100%;
  overflow-y: scroll;
  scrollbar-width: thin;
  padding-right: 4px;
}

.stage-inner::-webkit-scrollbar {
  width: 6px;
}

.stage-inner::-webkit-scrollbar-track {
  background: transparent;
}

.stage-inner::-webkit-scrollbar-thumb {
  background: var(--hairline);
  border-radius: 3px;
}

.stage-inner::-webkit-scrollbar-thumb:hover {
  background: var(--ink-muted);
}

.stage-header-2 {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 2px;
}

.sh2-icon {
  width: 34px;
  height: 34px;
  border-radius: var(--r-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  flex-shrink: 0;
}

.sh2-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--ink);
  display: block;
  line-height: 1.3;
}

.sh2-count {
  font-size: 12px;
  font-family: var(--font-mono);
  color: var(--ink-muted);
  display: block;
  margin-top: 1px;
}

.card-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.card-item {
  display: flex;
  background: linear-gradient(135deg, #FFFFFF, #FFF9F5);
  border: 1px solid rgba(200, 150, 100, 0.1);
  border-radius: var(--r-md);
  text-align: left;
  overflow: hidden;
  transition: all 0.25s var(--ease-out);
  box-shadow: 0 1px 4px rgba(139, 94, 60, 0.04);
}

.card-item:hover {
  border-color: #FB7299;
  background: linear-gradient(135deg, #FFF9F5, #FFE8F0);
  box-shadow: 0 4px 16px rgba(251, 114, 153, 0.1);
}

.card-item:active {
  transform: scale(0.98);
}

.ci-accent {
  width: 3px;
  flex-shrink: 0;
}

.ci-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 14px 16px;
}

.ci-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--ink);
  line-height: 1.3;
}

.ci-sub {
  font-size: 10px;
  font-family: var(--font-mono);
  color: var(--ink-muted);
  letter-spacing: 0.1px;
}

.ci-desc {
  font-size: 12px;
  color: var(--ink-secondary);
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.ci-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 11px;
  font-family: var(--font-mono);
  color: var(--ink-muted);
  letter-spacing: 0.2px;
  margin-top: 2px;
}

.ci-divider {
  width: 1px;
  height: 10px;
  background: var(--hairline);
}

.ci-actions {
  display: flex;
  gap: 6px;
  margin-top: 4px;
}

.cia-btn {
  font-size: 11px;
  font-weight: 500;
  padding: 6px 12px;
  border-radius: var(--r-pill);
  transition: all 0.2s var(--ease-out);
}

.cia-btn.primary {
  background: linear-gradient(135deg, #FB7299, #E85D75);
  color: var(--on-primary);
  box-shadow: 0 2px 8px rgba(251, 114, 153, 0.25);
}

.cia-btn.primary:hover {
  opacity: 0.9;
  box-shadow: 0 4px 12px rgba(251, 114, 153, 0.35);
}

.cia-btn.ghost {
  color: #8B7355;
  border: 1px solid rgba(200, 150, 100, 0.2);
}

.cia-btn.ghost:hover {
  border-color: #FB7299;
  color: #FB7299;
  background: rgba(251, 114, 153, 0.04);
}

.stage-note {
  grid-column: 1 / -1;
  font-size: 11px;
  color: var(--ink-muted);
  padding: 4px 2px;
  font-family: var(--font-mono);
}

@media (max-width: 720px) {
  .card-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 600px) {
  .stage { padding: 16px; }
}
</style>
