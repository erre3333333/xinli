<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  test: { type: Object, required: true },
})

const emit = defineEmits(['cancel', 'complete'])

const answers = ref({})
const allAnswered = computed(() => {
  return props.test.questions.every((q) => answers.value[q.id] !== undefined)
})

function setAnswer(qId, value) {
  answers.value[qId] = value
}

function submit() {
  if (!allAnswered.value) return
  const ordered = props.test.questions.map((q) => answers.value[q.id])
  emit('complete', ordered)
}
</script>

<template>
  <div class="form-wrap">
    <div class="form-head">
      <button class="form-back" @click="emit('cancel')">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        <span>返回</span>
      </button>
      <div class="form-meta">
        <span class="fm-title">{{ test.title }}</span>
        <span class="fm-count">{{ test.questions.length }} 题</span>
      </div>
    </div>

    <div class="form-inner">
      <div
        v-for="(q, i) in test.questions"
        :key="q.id"
        class="q-item"
        :class="{ done: answers[q.id] !== undefined }"
      >
        <div class="q-head">
          <span class="q-num">{{ String(i + 1).padStart(2, '0') }}</span>
          <p class="q-text">{{ q.text }}</p>
        </div>
        <div class="q-options">
          <label
            v-for="opt in q.options"
            :key="opt.value"
            class="q-opt"
            :class="{ active: answers[q.id] === opt.value }"
          >
            <input
              type="radio"
              :name="q.id"
              :value="opt.value"
              :checked="answers[q.id] === opt.value"
              @change="setAnswer(q.id, opt.value)"
            />
            <span class="q-opt-circle">
              <span class="q-opt-dot"></span>
            </span>
            <span class="q-opt-label">{{ opt.label }}</span>
          </label>
        </div>
      </div>
    </div>

    <div class="form-actions">
      <div class="fa-progress" v-if="!allAnswered">
        <div class="fa-bar">
          <div class="fa-fill" :style="{ width: (Object.keys(answers).length / test.questions.length) * 100 + '%' }"></div>
        </div>
        <span class="fa-text">{{ Object.keys(answers).length }} / {{ test.questions.length }} 已完成</span>
      </div>
      <button
        class="fa-submit"
        :class="{ can: allAnswered }"
        :disabled="!allAnswered"
        @click="submit"
      >
        <span>查看测评结果</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      </button>
    </div>
  </div>
</template>

<style scoped>
.form-wrap {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.form-head {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 16px 24px 0;
  flex-shrink: 0;
}

.form-back {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: var(--ink-muted);
  padding: 6px 10px;
  border-radius: var(--r-pill);
  transition: all 0.2s var(--ease-out);
}

.form-back:hover {
  color: var(--ink);
  background: var(--surface-soft);
}

.form-meta {
  display: flex;
  align-items: baseline;
  gap: 8px;
  flex: 1;
}

.fm-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--ink);
}

.fm-count {
  font-size: 12px;
  color: var(--ink-muted);
  font-family: var(--font-mono);
}

.form-inner {
  flex: 1;
  min-height: 0;
  overflow-y: scroll;
  padding: 16px 24px 0;
  scrollbar-width: thin;
}

.form-inner::-webkit-scrollbar {
  width: 6px;
}

.form-inner::-webkit-scrollbar-track {
  background: transparent;
}

.form-inner::-webkit-scrollbar-thumb {
  background: var(--hairline);
  border-radius: 3px;
}

.form-inner::-webkit-scrollbar-thumb:hover {
  background: var(--ink-muted);
}

.q-item {
  padding: 16px 18px;
  margin-bottom: 10px;
  background: var(--surface);
  border: 1px solid var(--hairline);
  border-radius: var(--r-md);
  transition: border-color 0.2s var(--ease-out);
}

.q-item.done {
  border-color: var(--ink-muted);
}

.q-head {
  display: flex;
  gap: 8px;
  margin-bottom: 10px;
}

.q-num {
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--ink-muted);
  flex-shrink: 0;
  margin-top: 2px;
}

.q-text {
  font-size: 14px;
  font-weight: 500;
  color: var(--ink);
  line-height: 1.6;
}

.q-options {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.q-opt {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  border-radius: var(--r-sm);
  cursor: pointer;
  transition: all 0.2s var(--ease-out);
}

.q-opt:hover {
  background: var(--surface-hover);
}

.q-opt.active {
  background: var(--surface-soft);
}

.q-opt input {
  display: none;
}

.q-opt-circle {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 1.5px solid var(--hairline);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.2s var(--ease-out);
}

.q-opt.active .q-opt-circle {
  border-color: var(--ink);
  background: var(--ink);
}

.q-opt-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--on-primary);
  opacity: 0;
  transition: opacity 0.2s;
}

.q-opt.active .q-opt-dot {
  opacity: 1;
}

.q-opt-label {
  font-size: 13px;
  color: var(--ink-secondary);
  line-height: 1.4;
}

.q-opt.active .q-opt-label {
  color: var(--ink);
}

.form-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 24px 20px;
  flex-shrink: 0;
}

.fa-progress {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 10px;
}

.fa-bar {
  flex: 1;
  height: 4px;
  background: var(--surface-soft);
  border-radius: var(--r-pill);
  overflow: hidden;
}

.fa-fill {
  height: 100%;
  background: var(--ink);
  border-radius: var(--r-pill);
  transition: width 0.3s var(--ease-out);
}

.fa-text {
  font-size: 11px;
  font-family: var(--font-mono);
  color: var(--ink-muted);
  white-space: nowrap;
}

.fa-submit {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 18px;
  border-radius: var(--r-pill);
  font-size: 13px;
  font-weight: 500;
  color: var(--ink-muted);
  transition: all 0.2s var(--ease-out);
  flex-shrink: 0;
}

.fa-submit.can {
  background: var(--ink);
  color: var(--on-primary);
}

.fa-submit.can:hover {
  opacity: 0.85;
}

.fa-submit:disabled {
  cursor: default;
}

@media (max-width: 600px) {
  .form-head { padding: 12px 16px 0; }
  .form-inner { padding: 12px 16px 0; }
  .q-item { padding: 14px 14px; }
  .form-actions { padding: 10px 16px 16px; flex-direction: column; }
  .fa-progress { width: 100%; }
}
</style>
