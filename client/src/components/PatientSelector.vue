<script setup>
import { ref, onMounted } from 'vue'

defineProps({
  patients: { type: Array, required: true },
})
const emit = defineEmits(['select', 'dashboard'])
const mounted = ref(false)
onMounted(() => requestAnimationFrame(() => { mounted.value = true }))

const patientColor = (id) => ({
  depression: '#6A7D5C',
  anxiety: '#C9944E',
  ocd: '#B85742',
  bipolar: '#8E728E',
  psychosis: '#5F8A96',
  ptsd: '#8B6A5A',
  eating: '#A0804A',
  adhd: '#5A6A8B',
}[id] || '#6A7D5C')

const labelEn = (id) => ({
  depression: 'DEPRESSION',
  anxiety: 'ANXIETY',
  ocd: 'OCD',
  bipolar: 'BIPOLAR',
  psychosis: 'PSYCHOSIS',
  ptsd: 'PTSD',
  eating: 'EATING',
  adhd: 'ADHD',
}[id] || id.toUpperCase())
</script>

<template>
  <div class="ps-container">
    <div class="glass-title">
      <span class="gt-text">选择患者档案</span>
      <span class="gt-sub">选择档案开始咨询，或从左侧导航进入量表中心</span>
    </div>
    <div class="glass-grid">
      <button
        v-for="(p, i) in patients"
        :key="p.id"
        class="glass-card"
        :style="{ '--c': patientColor(p.id), '--delay': i * 0.08 + 's' }"
        @click="emit('select', p)"
      >
        <span class="gc-accent" :style="{ background: patientColor(p.id) }"></span>
        <span class="gc-label">{{ p.label }}</span>
        <span class="gc-en">{{ labelEn(p.id) }}</span>
        <span class="gc-desc">{{ p.description }}</span>
      </button>
    </div>
    <div class="glass-footer">
      <span class="gf-text">标准心理筛查工具 · 仅供初步参考</span>
    </div>
  </div>
</template>

<style scoped>
.ps-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 32px;
  overflow-y: auto;
  max-width: 600px;
  margin: 0 auto;
  width: 100%;
}

.glass-title {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  margin-bottom: 28px;
}

.gt-text {
  font-size: 22px;
  font-weight: 600;
  color: var(--ink);
  letter-spacing: -0.3px;
}

.gt-sub {
  text-align: center;
  font-size: 14px;
  font-weight: 400;
  color: var(--ink-muted);
}

.glass-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  width: 100%;
}

.glass-card {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 18px 20px;
  background: var(--surface);
  border: 1px solid var(--hairline);
  border-radius: var(--r-md);
  text-align: left;
  transition: all 0.25s var(--ease-out);
  cursor: pointer;
  position: relative;
  overflow: hidden;
  animation: float-in 0.5s var(--ease-out) both;
  animation-delay: var(--delay);
}

.glass-card:hover {
  border-color: var(--c);
  background: var(--surface-hover);
}

.glass-card:active {
  transform: scale(0.98);
}

.gc-accent {
  width: 28px;
  height: 2px;
  border-radius: var(--r-pill);
}

.gc-label {
  font-size: 16px;
  font-weight: 600;
  color: var(--ink);
  line-height: 1.3;
  transition: color 0.25s;
}

.glass-card:hover .gc-label {
  color: var(--c);
}

.gc-en {
  font-family: var(--font-mono);
  font-size: 9px;
  letter-spacing: 0.12em;
  color: var(--ink-muted);
  text-transform: uppercase;
}

.gc-desc {
  font-size: 12px;
  color: var(--ink-secondary);
  line-height: 1.5;
}

.glass-footer {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-top: 24px;
  padding: 12px 0 0;
}

.gf-text {
  font-size: 11px;
  font-family: var(--font-mono);
  color: var(--ink-muted);
  letter-spacing: 0.2px;
}

@media (max-width: 640px) {
  .ps-container { padding: 16px; }
  .glass-grid { grid-template-columns: 1fr; }
  .gt-text { font-size: 19px; }
  .glass-card { padding: 14px 16px; }
}
</style>
