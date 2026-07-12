<script setup>
import { ref, onMounted } from 'vue'
import { getPlanUsage } from '../utils/api.js'

const emit = defineEmits(['upgrade-click'])

const usage = ref({ plan: 'free', unlimited: true, used: 0, limit: '无限', remaining: 999 })
const loading = ref(true)

async function refresh() {
  loading.value = true
  try {
    usage.value = await getPlanUsage()
  } catch {
    usage.value = { plan: 'free', unlimited: true, used: 0, limit: '无限', remaining: 999 }
  } finally {
    loading.value = false
  }
}

onMounted(refresh)
defineExpose({ refresh })
</script>

<template>
  <div v-if="loading" class="ub-skeleton" />
  <div v-else-if="usage.plan === 'yearly'" class="ub-bar ub-premium">
    <span class="ub-icon">★</span>
    <span>年费会员</span>
    <span v-if="usage.expiresAt" class="ub-expires">到期 {{ usage.expiresAt }}</span>
    <span class="ub-badge">无限使用</span>
  </div>
  <div v-else-if="usage.plan === 'monthly'" class="ub-bar ub-premium">
    <span class="ub-icon">★</span>
    <span>月费会员</span>
    <span v-if="usage.expiresAt" class="ub-expires">到期 {{ usage.expiresAt }}</span>
    <span class="ub-badge">无限使用</span>
  </div>
  <div v-else class="ub-bar ub-free">
    <span class="ub-icon">✿</span>
    <span>免费用户 · 无限使用</span>
    <button class="ub-upgrade" @click="emit('upgrade-click')">升级会员</button>
  </div>
</template>

<style scoped>
.ub-bar {
  display: flex; align-items: center; gap: 8px;
  padding: 6px 12px; border-radius: 8px; font-size: 12px;
}
.ub-free { background: rgba(251, 114, 153, 0.06); color: #8B7355; }
.ub-premium { background: linear-gradient(135deg, #FFF5E6, #FFF0E0); color: #C28B4E; }
.ub-track {
  flex: 1; height: 4px; border-radius: 2px; background: rgba(251, 114, 153, 0.15);
  max-width: 80px; overflow: hidden;
}
.ub-fill { height: 100%; border-radius: 2px; background: #FB7299; transition: width 0.3s; }
.ub-text { flex-shrink: 0; }
.ub-upgrade {
  border: none; background: linear-gradient(135deg, #FB7299, #FF8A80);
  color: #fff; padding: 2px 10px; border-radius: 10px; cursor: pointer; font-size: 11px;
}
.ub-upgrade:hover { opacity: 0.9; }
.ub-icon { font-size: 14px; }
.ub-expires { color: #C28B4E; opacity: 0.7; font-size: 11px; }
.ub-badge {
  margin-left: auto; background: #C28B4E; color: #fff;
  padding: 1px 8px; border-radius: 8px; font-size: 10px;
}
.ub-skeleton { height: 32px; border-radius: 8px; background: rgba(0,0,0,0.03); }
</style>
