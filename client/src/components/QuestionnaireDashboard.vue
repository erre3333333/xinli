<script setup>
import { ref, computed, markRaw } from 'vue'
import QuestionnaireForm from './QuestionnaireForm.vue'
import QuestionnaireResult from './QuestionnaireResult.vue'
import { QUESTIONNAIRES, getScoreRange } from '../config/questionnaires.js'

const emit = defineEmits(['back'])

const categories = [
  { id: 'depression', label: '抑郁', color: 'var(--c-depression)' },
  { id: 'anxiety', label: '焦虑', color: 'var(--c-anxiety)' },
  { id: 'ocd', label: '强迫', color: 'var(--c-ocd)' },
  { id: 'bipolar', label: '双相', color: 'var(--c-bipolar)' },
  { id: 'psychosis', label: '精神病风险', color: 'var(--c-psychosis)' },
  { id: 'ptsd', label: '创伤后应激', color: 'var(--c-ptsd)' },
  { id: 'eating', label: '进食障碍', color: 'var(--c-eating)' },
  { id: 'adhd', label: '注意缺陷多动', color: 'var(--c-adhd)' },
]

const activeTab = ref('depression')
const completedResults = ref(JSON.parse(localStorage.getItem('dash-results') || '{}'))

const phase = ref('list')
const selectedTest = ref(null)
const lastResult = ref(null)

function isCompleted(id) {
  return id in completedResults.value
}

function getResult(id) {
  return completedResults.value[id] || null
}

function getScalesFor(id) {
  return QUESTIONNAIRES[id] || []
}

function selectScale(q) {
  selectedTest.value = markRaw(q)
  phase.value = 'form'
}

function viewResult(q) {
  const stored = completedResults.value[q.id]
  if (!stored) return
  const range = getScoreRange(q.scoring.ranges, stored.total)
  lastResult.value = { total: stored.total, range, answers: stored.answers, test: q }
  phase.value = 'result'
}

function onComplete(answers) {
  const test = selectedTest.value
  const total = answers.reduce((s, a) => s + a, 0)
  const range = getScoreRange(test.scoring.ranges, total)
  lastResult.value = { total, range, answers, test }
  completedResults.value[test.id] = { total, answers, timestamp: Date.now() }
  localStorage.setItem('dash-results', JSON.stringify(completedResults.value))
  phase.value = 'result'
}

function backToList() {
  phase.value = 'list'
  selectedTest.value = null
  lastResult.value = null
}

const activeScales = computed(() => getScalesFor(activeTab.value))
const activeCat = computed(() => categories.find(c => c.id === activeTab.value))
</script>

<template>
  <div class="dash">
    <template v-if="phase === 'list'">
      <div class="dash-header">
        <button class="dh-back" @click="emit('back')" aria-label="返回">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        </button>
        <div>
          <h2 class="dh-title">量表中心</h2>
          <p class="dh-desc">选择类别查看对应量表，点击开始评估</p>
        </div>
      </div>

      <div class="tabs">
        <button
          v-for="cat in categories"
          :key="cat.id"
          class="tab"
          :class="{ on: activeTab === cat.id }"
          @click="activeTab = cat.id"
        >
          <span class="tab-dot" :style="{ background: cat.color }"></span>
          <span class="tab-label">{{ cat.label }}</span>
        </button>
      </div>

      <div class="section-head">
        <span class="sh-label">{{ activeCat?.label }}领域</span>
        <span class="sh-count">{{ activeScales.length }} 个量表</span>
      </div>

      <div class="grid">
        <div
          v-for="q in activeScales"
          :key="q.id"
          class="card"
          :class="{ done: isCompleted(q.id) }"
        >
          <span v-if="isCompleted(q.id)" class="card-check" aria-label="已完成">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><path d="M20 6L9 17l-5-5"/></svg>
          </span>
          <div class="card-body">
            <div class="card-top">
              <span class="card-accent" :style="{ background: activeCat?.color }"></span>
              <div class="card-info">
                <span class="card-title">{{ q.title }}</span>
                <span class="card-en">{{ q.subtitle }}</span>
              </div>
            </div>
            <p class="card-desc">{{ q.desc }}</p>
            <div class="card-meta">
              <span class="cm-item">{{ q.time }}</span>
              <span class="cm-divider"></span>
              <span class="cm-item">{{ q.questions.length }} 题</span>
            </div>
          </div>
          <div class="card-actions">
            <button class="ca-btn primary" @click="selectScale(q)">
              {{ isCompleted(q.id) ? '重新测评' : '开始评估' }}
            </button>
            <button v-if="isCompleted(q.id)" class="ca-btn ghost" @click="viewResult(q)">查看测评结果分析</button>
          </div>
        </div>
      </div>
    </template>

    <template v-else-if="phase === 'form'">
      <QuestionnaireForm
        :test="selectedTest"
        :index="0"
        :total="1"
        @complete="onComplete"
        @cancel="backToList"
      />
    </template>

    <template v-else-if="phase === 'result'">
      <div class="result-wrap">
        <QuestionnaireResult
          :result="lastResult"
          @retry="backToList"
          @back="emit('back')"
        />
      </div>
    </template>
  </div>
</template>

<style scoped>
.dash {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow-y: scroll;
  padding: 24px;
  scrollbar-width: thin;
  background: linear-gradient(180deg, #FFFAF5, #FFFFFF);
}

.dash::-webkit-scrollbar {
  width: 6px;
}

.dash::-webkit-scrollbar-track {
  background: transparent;
}

.dash::-webkit-scrollbar-thumb {
  background: var(--hairline);
  border-radius: 3px;
}

.dash::-webkit-scrollbar-thumb:hover {
  background: var(--ink-muted);
}

.dash-header {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 20px;
}

.dh-back {
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
.dh-back:hover {
  background: var(--surface-hover);
  color: var(--ink);
}

.dh-title {
  font-size: 20px;
  font-weight: 600;
  background: linear-gradient(135deg, #8B5E3C, #FB7299);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.dh-desc {
  font-size: 13px;
  color: var(--ink-secondary);
  margin-top: 2px;
}

/* —— Tabs —— */

.tabs {
  display: flex;
  gap: 6px;
  margin-bottom: 24px;
  overflow-x: auto;
  padding-bottom: 4px;
  flex-shrink: 0;
}

.tab {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: var(--r-pill);
  font-size: 13px;
  font-weight: 500;
  color: var(--ink-secondary);
  border: 1px solid rgba(200, 150, 100, 0.15);
  white-space: nowrap;
  transition: all 0.2s var(--ease-out);
  flex-shrink: 0;
}

.tab:hover {
  color: #8B5E3C;
  border-color: rgba(200, 150, 100, 0.3);
}

.tab.on {
  color: var(--ink);
  background: linear-gradient(135deg, #FFF9F5, #FFE8F0);
  border-color: #FB7299;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(251, 114, 153, 0.15);
}

.tab-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

/* —— Section Head —— */

.section-head {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 14px;
  padding: 0 2px;
}

.sh-label {
  font-size: 13px;
  font-weight: 600;
  color: var(--ink);
  letter-spacing: 0.3px;
}

.sh-count {
  font-size: 11px;
  font-family: var(--font-mono);
  color: var(--ink-muted);
}

/* —— Card Grid —— */

.grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  padding-bottom: 12px;
}

.card {
  display: flex;
  flex-direction: column;
  position: relative;
  background: linear-gradient(135deg, #FFFFFF, #FFF9F5);
  border: 1px solid rgba(200, 150, 100, 0.1);
  border-radius: var(--r-md);
  text-align: left;
  transition: all 0.25s var(--ease-out);
  overflow: hidden;
  box-shadow: 0 1px 4px rgba(139, 94, 60, 0.04);
}

.card:hover {
  border-color: #FB7299;
  background: linear-gradient(135deg, #FFF9F5, #FFE8F0);
  box-shadow: 0 4px 16px rgba(251, 114, 153, 0.1);
}

.card:active {
  transform: scale(0.98);
}

.card-actions {
  display: flex;
  gap: 6px;
  padding: 0 16px 14px;
}

.ca-btn {
  font-size: 11px;
  font-weight: 500;
  padding: 6px 12px;
  border-radius: var(--r-pill);
  transition: all 0.2s var(--ease-out);
}

.ca-btn.primary {
  background: linear-gradient(135deg, #FB7299, #E85D75);
  color: var(--on-primary);
  box-shadow: 0 2px 8px rgba(251, 114, 153, 0.25);
}

.ca-btn.primary:hover {
  opacity: 0.9;
  box-shadow: 0 4px 12px rgba(251, 114, 153, 0.35);
}

.ca-btn.ghost {
  color: #8B7355;
  border: 1px solid rgba(200, 150, 100, 0.2);
}

.ca-btn.ghost:hover {
  border-color: #FB7299;
  color: #FB7299;
  background: rgba(251, 114, 153, 0.04);
}

.card.done {
  opacity: 0.6;
}

.card-check {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: linear-gradient(135deg, #FB7299, #E85D75);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--ink-secondary);
}

.card-body {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px;
}

.card-top {
  display: flex;
  gap: 10px;
  align-items: flex-start;
}

.card-accent {
  width: 3px;
  height: 32px;
  border-radius: 2px;
  flex-shrink: 0;
  margin-top: 2px;
}

.card-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.card-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--ink);
  line-height: 1.3;
}

.card-en {
  font-size: 10px;
  font-family: var(--font-mono);
  color: var(--ink-muted);
  letter-spacing: 0.1px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.card-desc {
  font-size: 12px;
  color: var(--ink-secondary);
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 2px;
}

.cm-item {
  font-size: 11px;
  font-family: var(--font-mono);
  color: var(--ink-muted);
  letter-spacing: 0.2px;
}

.cm-divider {
  width: 1px;
  height: 10px;
  background: var(--hairline);
}

.result-wrap {
  flex: 1;
  display: flex;
  flex-direction: column;
}

@media (max-width: 720px) {
  .grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 600px) {
  .dash { padding: 16px; }
  .tab { padding: 6px 12px; font-size: 12px; }
  .card-body { padding: 14px; }
}
</style>
