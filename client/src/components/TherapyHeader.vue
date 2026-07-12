<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import ThemeSwitcher from './ThemeSwitcher.vue'

const props = defineProps({
  patient: { type: Object, required: true },
  model: { type: String, required: true },
  models: { type: Array, required: true },
  autoSpeak: { type: Boolean, default: true },
  speaking: { type: Boolean, default: false },
  view: { type: String, default: 'chat' },
  messages: { type: Number, default: 0 },
  sessions: { type: Number, default: 1 },
  lastScore: { type: [String, Number], default: '--' },
})
const emit = defineEmits(['update:model', 'update:autoSpeak', 'update:view', 'new-chat', 'stop-speak', 'back'])

const open = ref(false)
const menu = ref(null)

function close(e) {
  if (menu.value && !menu.value.contains(e.target)) open.value = false
}
onMounted(() => document.addEventListener('click', close))
onUnmounted(() => document.removeEventListener('click', close))

function shortName(id) {
  const map = {
    'agnes-2.0-flash': 'Agnes 2.0',
  }
  return map[id] || (id.includes('/') ? id.split('/')[1] : id)
}

function isVision(m) {
  return m.vision === true
}
</script>

<template>
  <header class="bar">
    <div class="bar-glass">
      <div class="bar-inner">
        <div class="bar-left">
          <button class="bar-btn back" @click="emit('back')" title="返回首页">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          </button>
          <span class="brand-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </span>
          <span class="brand">心灵花园</span>
          <span class="trust-badge">可信赖 AI 心理支持</span>
          <span class="brand-subject">{{ patient.label }}</span>
        </div>

        <div class="bar-center">
          <div class="segments">
            <button class="seg" :class="{ on: view === 'chat' }" @click="emit('update:view', 'chat')">
              <span>咨询</span>
            </button>
            <button class="seg" :class="{ on: view === 'assessment' }" @click="emit('update:view', 'assessment')">
              <span>测评</span>
            </button>
          </div>
        </div>

        <div class="bar-right">
          <div class="stats">
            <div class="stat">
              <span class="stat-val">{{ messages }}</span>
              <span class="stat-lbl">消息</span>
            </div>
            <div class="stat">
              <span class="stat-val">{{ sessions }}</span>
              <span class="stat-lbl">会话</span>
            </div>
            <div class="stat">
              <span class="stat-val accent">{{ lastScore }}</span>
              <span class="stat-lbl">测评</span>
            </div>
          </div>

          <span class="bar-divider"></span>

          <ThemeSwitcher />

          <span class="bar-divider"></span>

          <button
            class="bar-btn audio"
            :class="{ on: autoSpeak }"
            :title="autoSpeak ? '自动语音' : '语音关闭'"
            @click="emit('update:autoSpeak', !autoSpeak)"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <path v-if="autoSpeak" d="M15.54 8.46a5 5 0 0 1 0 7.07" />
              <template v-else>
                <line x1="23" y1="9" x2="17" y2="15" />
                <line x1="17" y1="9" x2="23" y2="15" />
              </template>
            </svg>
            <span v-if="speaking" class="speak-indicator" aria-hidden="true">
              <span></span><span></span>
            </span>
          </button>

          <div ref="menu" class="picker" @click.stop="open = !open">
            <span class="p-label">{{ shortName(model) }}</span>
            <svg :class="{ up: open }" width="6" height="6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
              <path d="M6 9l6 6 6-6" />
            </svg>
            <Transition name="drop">
              <div v-if="open" class="p-drop">
                  <button
                    v-for="m in models"
                    :key="m.id"
                    class="p-opt"
                    :class="{ on: m.id === model }"
                    @click.stop="emit('update:model', m.id); open = false"
                  >
                    <span class="p-opt-name">{{ m.name }}</span>
                    <span v-if="isVision(m)" class="p-opt-badge">视觉</span>
                  </button>
              </div>
            </Transition>
          </div>

          <button class="bar-btn new" @click="emit('new-chat')" title="新对话">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 5v14M5 12h14" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>
.bar {
  flex-shrink: 0;
  z-index: 30;
  padding: 10px 14px 0;
}

.bar-glass {
  background: linear-gradient(180deg, #FFFFFF, #FFF9F5);
  border: 1px solid rgba(200, 150, 100, 0.1);
  border-radius: var(--r-lg);
  position: relative;
  box-shadow: 0 1px 8px rgba(139, 94, 60, 0.04);
}

.bar-inner {
  height: var(--header-h);
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  padding: 0 16px;
  gap: 12px;
}

.bar-left {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}

.brand-icon {
  color: var(--ink);
  display: inline-flex;
  flex-shrink: 0;
}

.brand {
  font-family: var(--font-sans);
  font-size: 15px;
  font-weight: 600;
  color: var(--ink);
  white-space: nowrap;
}

.brand-subject {
  font-size: 13px;
  color: var(--ink-secondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.trust-badge {
  font-size: 9px;
  font-weight: 500;
  letter-spacing: 0.3px;
  color: #8B7355;
  padding: 2px 8px;
  background: rgba(251, 114, 153, 0.06);
  border: 1px solid rgba(251, 114, 153, 0.12);
  border-radius: var(--r-pill);
  white-space: nowrap;
  flex-shrink: 0;
}

.bar-center {
  display: flex;
  justify-content: center;
}

.segments {
  display: flex;
  gap: 2px;
  padding: 3px;
  background: var(--surface-soft);
  border-radius: var(--r-pill);
}

.seg {
  padding: 5px 16px;
  border-radius: var(--r-pill);
  font-size: 13px;
  font-weight: 500;
  color: var(--ink-secondary);
  transition: all 0.2s var(--ease-out);
}

.seg:hover {
  color: var(--ink);
}

.seg.on {
  background: var(--surface);
  color: var(--ink);
  box-shadow: var(--depth-1);
}

.bar-right {
  display: flex;
  align-items: center;
  gap: 10px;
  justify-content: flex-end;
}

.stats {
  display: flex;
  align-items: center;
  gap: 12px;
}

.stat {
  display: flex;
  align-items: center;
  gap: 4px;
}

.stat-val {
  font-family: var(--font-mono);
  font-size: 13px;
  font-weight: 600;
  color: var(--ink);
  line-height: 1;
}

.stat-lbl {
  font-size: 10px;
  color: var(--ink-muted);
  letter-spacing: 0.2px;
}

.bar-divider {
  width: 1px;
  height: 20px;
  background: var(--hairline);
}

.bar-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  color: var(--ink-muted);
  transition: all 0.2s var(--ease-out);
  position: relative;
}

.bar-btn:hover {
  background: var(--surface-soft);
  color: var(--ink);
}

.bar-btn.audio.on {
  color: var(--ink);
  background: var(--surface-soft);
}

.speak-indicator {
  position: absolute;
  bottom: 6px;
  right: 6px;
  display: flex;
  gap: 1.5px;
  height: 6px;
}

.speak-indicator span {
  width: 2px;
  background: var(--ink);
  border-radius: 1px;
  transform-origin: bottom;
  animation: speak-wave 0.8s ease-in-out infinite;
}

.speak-indicator span:nth-child(1) { height: 3px; animation-delay: -0.3s; }
.speak-indicator span:nth-child(2) { height: 5px; animation-delay: -0.15s; }

.picker {
  position: relative;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 5px 10px;
  height: 32px;
  border-radius: var(--r-pill);
  font-size: 12px;
  color: var(--ink-secondary);
  cursor: pointer;
  transition: all 0.2s var(--ease-out);
  user-select: none;
  border: 1px solid var(--hairline);
}

.picker:hover {
  border-color: var(--ink-muted);
  color: var(--ink);
}

.p-label {
  font-family: var(--font-mono);
  font-size: 11px;
  max-width: 90px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.p-drop {
  position: absolute;
  top: calc(100% + 6px);
  right: 0;
  min-width: 220px;
  background: var(--surface);
  border: 1px solid var(--hairline);
  border-radius: var(--r-md);
  box-shadow: var(--depth-2);
  overflow: hidden;
  z-index: 30;
  padding: 4px;
}

.p-opt {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 9px 12px;
  font-size: 13px;
  text-align: left;
  border-radius: var(--r-sm);
  transition: background 0.15s;
  color: var(--ink-secondary);
}

.p-opt:hover { background: var(--surface-hover); color: var(--ink); }
.p-opt.on { background: var(--surface-soft); color: var(--ink); font-weight: 500; }

.p-opt-badge {
  margin-left: auto;
  font-size: 8px;
  font-weight: 600;
  letter-spacing: 0.3px;
  padding: 2px 6px;
  border-radius: var(--r-pill);
  background: var(--surface-soft);
  color: var(--ink-secondary);
  border: 1px solid var(--hairline);
}

.bar-btn.back {
  border: none;
  color: var(--ink-muted);
}
.bar-btn.back:hover {
  color: var(--ink);
  background: var(--surface-soft);
}

.bar-btn.new {
  border: 1px solid var(--hairline);
}

.bar-btn.new:hover {
  background: var(--primary);
  border-color: var(--primary);
  color: var(--on-primary);
}

.drop-enter-active,
.drop-leave-active {
  transition: all 0.2s var(--ease-out);
}
.drop-enter-from,
.drop-leave-to {
  opacity: 0;
  transform: scale(0.96) translateY(-4px);
}

@media (max-width: 800px) {
  .bar { padding: 8px 8px 0; }
  .stats { display: none; }
  .bar-divider { display: none; }
  .brand-subject { display: none; }
  .bar-btn.new { border: none; }
}
</style>
