<script setup>
import { ref, onMounted } from 'vue'
import { getPlanInfo, upgradePlan } from '../utils/api.js'
import { ElMessage } from 'element-plus'

const emit = defineEmits(['back', 'upgraded'])

const plans = ref([])
const loading = ref(true)
const upgrading = ref(null)

onMounted(async () => {
  try {
    const data = await getPlanInfo()
    plans.value = Object.entries(data.plans).map(([id, p]) => ({ id, ...p }))
  } catch {
    plans.value = [
      { id: 'free', label: '免费', price: 0, period: '', messagesPerDay: 10 },
      { id: 'monthly', label: '月付', price: 20, period: '月', messagesPerDay: '无限' },
      { id: 'yearly', label: '年付', price: 150, period: '年', messagesPerDay: '无限' },
    ]
  } finally {
    loading.value = false
  }
})

async function handleUpgrade(planId) {
  if (planId === 'free') return
  upgrading.value = planId
  try {
    await upgradePlan(planId)
    ElMessage.success(`已升级为${planId === 'monthly' ? '月付' : '年付'}会员！`)
    emit('upgraded')
  } catch (e) {
    ElMessage.error(e.message || '升级失败')
  } finally {
    upgrading.value = null
  }
}
</script>

<template>
  <div class="pp-wrap">
    <div class="pp-header">
      <button class="pp-back" @click="emit('back')">← 返回</button>
      <h2>选择方案</h2>
    </div>

    <div class="pp-intro">
      <p>每天 10 条免费消息，升级后无限使用所有功能</p>
    </div>

    <div v-if="loading" class="pp-loading">加载中...</div>

    <div v-else class="pp-grid">
      <div
        v-for="p in plans" :key="p.id"
        class="pp-card"
        :class="{ 'pp-card-highlight': p.id === 'yearly', 'pp-card-free': p.id === 'free' }"
      >
        <div class="pp-card-label">{{ p.label }}</div>
        <div class="pp-card-price">
          <span v-if="p.price === 0" class="pp-price-free">免费</span>
          <template v-else>
            <span class="pp-price-amount">{{ p.price }}</span>
            <span class="pp-price-period"> 元/{{ p.period }}</span>
          </template>
        </div>
        <div class="pp-card-features">
          <div class="pp-feature">
            <span>{{ p.messagesPerDay === '无限' ? '♾️' : '📨' }}</span>
            <span>每日 {{ p.messagesPerDay }} 条消息</span>
          </div>
          <div class="pp-feature">
            <span>{{ p.id === 'free' ? '🔒' : '🔓' }}</span>
            <span>{{ p.id === 'free' ? '基本AI支持' : '所有功能无限使用' }}</span>
          </div>
          <div class="pp-feature">
            <span>{{ p.id === 'free' ? '🔒' : '💾' }}</span>
            <span>{{ p.id === 'free' ? '有限病历保存' : '完整病历保存' }}</span>
          </div>
        </div>
        <div v-if="p.id === 'free'" class="pp-card-action pp-card-action-current">当前方案</div>
        <button
          v-else
          class="pp-card-action"
          :class="{ 'pp-card-action-primary': p.id === 'yearly' }"
          :disabled="upgrading === p.id"
          @click="handleUpgrade(p.id)"
        >
          {{ upgrading === p.id ? '处理中…' : '升级至此方案' }}
        </button>
        <div v-if="p.id === 'yearly'" class="pp-badge">推荐</div>
      </div>
    </div>

    <div class="pp-note">
      <p>订阅后可在「我的」页面查看和管理会员信息</p>
    </div>
  </div>
</template>

<style scoped>
.pp-wrap {
  max-width: 800px; margin: 0 auto; padding: 24px 16px 48px;
}
.pp-header {
  display: flex; align-items: center; gap: 12px; margin-bottom: 20px;
}
.pp-back {
  border: none; background: none; color: #FB7299; cursor: pointer; font-size: 14px; padding: 0;
}
.pp-header h2 { font-size: 20px; color: #5C4033; margin: 0; }
.pp-intro { text-align: center; color: #8B7355; font-size: 14px; margin-bottom: 32px; }
.pp-loading { text-align: center; color: #B89E82; padding: 40px; }
.pp-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
.pp-card {
  border: 1px solid rgba(200, 150, 100, 0.15); border-radius: 16px;
  padding: 24px; text-align: center; position: relative;
  background: #FFFDFA; transition: all 0.2s;
}
.pp-card:hover { border-color: #FB7299; transform: translateY(-2px); box-shadow: 0 4px 20px rgba(251, 114, 153, 0.08); }
.pp-card-highlight {
  border-color: #FB7299; background: linear-gradient(180deg, #FFF5F8, #FFFDFA);
  box-shadow: 0 4px 20px rgba(251, 114, 153, 0.1);
}
.pp-card-free { background: #FAFAFA; }
.pp-badge {
  position: absolute; top: -8px; right: -8px;
  background: linear-gradient(135deg, #FB7299, #FF8A80); color: #fff;
  padding: 2px 12px; border-radius: 10px; font-size: 11px; font-weight: 600;
}
.pp-card-label { font-size: 14px; color: #5C4033; font-weight: 600; margin-bottom: 8px; }
.pp-card-price { margin-bottom: 16px; }
.pp-price-free { font-size: 24px; color: #8B7355; font-weight: 300; }
.pp-price-amount { font-size: 32px; color: #5C4033; font-weight: 700; }
.pp-price-period { font-size: 14px; color: #8B7355; }
.pp-card-features { margin-bottom: 20px; }
.pp-feature {
  display: flex; align-items: center; gap: 6px; justify-content: center;
  padding: 4px 0; font-size: 13px; color: #6B5B4E;
}
.pp-card-action {
  width: 100%; padding: 8px; border-radius: 8px; border: 1px solid rgba(200, 150, 100, 0.2);
  background: #fff; color: #8B7355; cursor: pointer; font-size: 13px; transition: all 0.2s;
}
.pp-card-action:hover { border-color: #FB7299; color: #FB7299; }
.pp-card-action-primary {
  background: linear-gradient(135deg, #FB7299, #FF8A80); color: #fff; border: none;
}
.pp-card-action-primary:hover { opacity: 0.9; color: #fff; }
.pp-card-action-current {
  background: rgba(200, 150, 100, 0.08); color: #B89E82; border: none; cursor: default;
}
.pp-note { text-align: center; color: #B89E82; font-size: 12px; margin-top: 24px; }
</style>
