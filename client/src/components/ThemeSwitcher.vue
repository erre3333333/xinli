<script setup>
import { useTheme } from '../composables/useTheme.js'

const { themes, currentTheme, setTheme } = useTheme()
</script>

<template>
  <div class="theme-switcher" role="radiogroup" aria-label="切换主题">
    <button
      v-for="t in themes"
      :key="t.id"
      class="ts-opt"
      :class="{ on: currentTheme === t.id }"
      :aria-checked="currentTheme === t.id"
      role="radio"
      :title="t.label"
      @click="setTheme(t.id)"
    >
      <span class="ts-swatch" :class="`swatch-${t.id}`" />
      <span class="ts-label">{{ t.label }}</span>
    </button>
  </div>
</template>

<style scoped>
.theme-switcher {
  display: flex;
  gap: 4px;
  padding: 3px;
  background: var(--surface-soft);
  border-radius: var(--r-pill);
}

.ts-opt {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border-radius: var(--r-pill);
  font-size: 11px;
  color: var(--ink-secondary);
  transition: all 0.2s var(--ease-out);
}

.ts-opt:hover {
  color: var(--ink);
}

.ts-opt.on {
  background: var(--surface);
  color: var(--ink);
  box-shadow: var(--depth-1);
}

.ts-swatch {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
  border: 1px solid var(--hairline);
}

.swatch-spring { background: #A8C89A; }
.swatch-autumn { background: #D9A05B; }
.swatch-moon { background: #4A5580; }
</style>
