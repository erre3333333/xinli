<script setup>
import MessageBubble from './MessageBubble.vue'

defineProps({
  messages: { type: Array, required: true },
  isLoading: { type: Boolean, default: false },
  patient: { type: Object, required: true },
  speakingId: { type: [Number, null], default: null },
  hasVoice: { type: Boolean, default: false },
  hasChinese: { type: Boolean, default: false },
})

defineEmits(['speak', 'stop-speak'])
</script>

<template>
  <div class="scroll-view">
    <div class="scroll-inner">
      <div v-if="messages.length === 0" class="scroll-empty">
        <div class="empty-glass">
          <div class="eg-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </div>
          <span class="eg-text">开始对话</span>
          <span class="eg-hint">在下方输入你想说的话</span>
        </div>
      </div>

      <div v-else class="glass-divider" aria-hidden="true">
        <span class="gd-line"></span>
        <span class="gd-label">{{ messages.length }} 条消息</span>
        <span class="gd-line"></span>
      </div>

      <MessageBubble
        v-for="(msg, i) in messages"
        :key="i"
        :message="msg"
        :patient="patient"
        :speakingId="speakingId"
        :hasVoice="hasVoice"
        :hasChinese="hasChinese"
        @speak="$emit('speak', $event)"
        @stop="$emit('stop-speak')"
      />

      <Transition name="bubble">
        <div v-if="isLoading" class="typing">
          <span class="typing-dot"></span>
          <span class="typing-dot"></span>
          <span class="typing-dot"></span>
          <span class="typing-label">{{ patient.label }} 思考中</span>
        </div>
      </Transition>
    </div>
  </div>
</template>

<style scoped>
.scroll-view {
  --surface-soft: #FFF5EB;
  --surface-hover: #FFE8D6;
  --hairline: rgba(200, 150, 100, 0.12);
  --r-lg: 12px;
  --ink-muted: #8B7355;
  --ink-secondary: #6B4E37;
  --ink: #4A3728;
  --font-sans: 'Inter', 'Noto Sans SC', -apple-system, 'Segoe UI', Roboto, sans-serif;
  --font-mono: ui-monospace, SFMono-Regular, Menlo, Monaco, monospace;
  --on-primary: #FFFFFF;
  --r-md: 8px;
  --r-sm: 6px;
  --r-xs: 4px;
  --ease-out: cubic-bezier(0.25, 0.1, 0.25, 1);
  font-family: var(--font-sans);
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 20px 22px 12px;
  scroll-behavior: smooth;
  background: transparent;
}

.scroll-inner {
  display: flex;
  flex-direction: column;
  gap: 18px;
  min-height: 100%;
}

.scroll-empty {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 30vh;
}

.empty-glass {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 28px 36px;
  background: linear-gradient(135deg, #FFF5EB, #FFE8D6);
  border: 1px solid rgba(200, 150, 100, 0.15);
  border-radius: var(--r-lg);
  box-shadow: 0 2px 12px rgba(139, 94, 60, 0.06);
}

.eg-icon {
  color: var(--ink-muted);
}

.eg-text {
  font-size: 16px;
  font-weight: 500;
  color: var(--ink-secondary);
}

.eg-hint {
  font-size: 12px;
  color: var(--ink-muted);
}

.glass-divider {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 2px 0;
}

.gd-line {
  flex: 1;
  height: 1px;
  background: var(--hairline);
}

.gd-label {
  font-size: 11px;
  font-family: var(--font-mono);
  color: var(--ink-muted);
  flex-shrink: 0;
  letter-spacing: 0.3px;
}

.typing {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 2px 0;
}

.typing-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--ink);
  opacity: 0.4;
  animation: typing-pulse 1.4s infinite ease-in-out both;
}

.typing-dot:nth-child(2) { animation-delay: -0.32s; }
.typing-dot:nth-child(3) { animation-delay: -0.16s; }

.typing-label {
  font-size: 11px;
  color: var(--ink-muted);
  margin-left: 6px;
}

.bubble-enter-active {
  transition: all 0.4s var(--ease-out);
}
.bubble-enter-from {
  opacity: 0;
  transform: translateY(6px);
}

@media (max-width: 720px) {
  .scroll-view { padding: 14px 12px 8px; }
  .scroll-inner { gap: 14px; }
}
@media (max-width: 480px) {
  .scroll-view { padding: 10px 8px 6px; }
  .scroll-inner { gap: 10px; }
  .glass-divider { padding: 0; }
  .gd-label { font-size: 10px; }
}
</style>
