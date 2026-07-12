<script setup>
import { ref } from 'vue'
import { login, register } from '../utils/api.js'

const emit = defineEmits(['login-success', 'back'])

const isRegister = ref(false)
const form = ref({ username: '', password: '', name: '', plan: 'free' })
const loading = ref(false)
const error = ref('')

const plans = [
  { id: 'free', label: '普通用户', price: '免费', desc: '每日10条消息' },
  { id: 'monthly', label: '月费用户', price: '20元/月', desc: '无限消息' },
  { id: 'yearly', label: '年费用户', price: '150元/年', desc: '无限消息，最划算' },
]

async function submit() {
  error.value = ''
  loading.value = true
  try {
    const fn = isRegister.value ? register : login
    const opts = {
      username: form.value.username,
      password: form.value.password,
      name: form.value.name || form.value.username,
    }
    if (isRegister.value) opts.plan = form.value.plan
    const res = await fn(opts)
    localStorage.setItem('token', res.token)
    localStorage.setItem('user', JSON.stringify(res.user))
    emit('login-success', res.user)
  } catch (e) {
    error.value = e.message || '操作失败'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="auth-page">
    <div class="auth-card">
      <div class="auth-header">
        <h2>{{ isRegister ? '创建账号' : '欢迎回来' }}</h2>
        <p>{{ isRegister ? '注册后开启您的心理健康之旅' : '登录以查看您的健康记录' }}</p>
      </div>

      <form @submit.prevent="submit" class="auth-form">
        <div class="af-group">
          <label>用户名</label>
          <input v-model="form.username" placeholder="请输入用户名" required minlength="2" />
        </div>
        <div class="af-group">
          <label>密码</label>
          <input v-model="form.password" type="password" placeholder="请输入密码" required minlength="4" />
        </div>
        <div v-if="isRegister" class="af-group">
          <label>昵称（选填）</label>
          <input v-model="form.name" placeholder="显示名称" />
        </div>

        <div v-if="isRegister" class="af-group">
          <label>用户类型</label>
          <div class="plan-options">
            <div
              v-for="p in plans"
              :key="p.id"
              class="plan-option"
              :class="{ active: form.plan === p.id }"
              @click="form.plan = p.id"
            >
              <span class="po-label">{{ p.label }}</span>
              <span class="po-price">{{ p.price }}</span>
            </div>
          </div>
        </div>

        <div v-if="error" class="af-error">{{ error }}</div>

        <button type="submit" class="af-btn" :disabled="loading">
          {{ loading ? '处理中…' : isRegister ? '注册' : '登录' }}
        </button>
      </form>

      <div class="auth-footer">
        <button class="af-link" @click="isRegister = !isRegister">
          {{ isRegister ? '已有账号？去登录' : '没有账号？去注册' }}
        </button>
        <button class="af-link" @click="emit('back')">返回首页</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.auth-page {
  height: 100%; display: flex; align-items: center; justify-content: center;
  background: linear-gradient(180deg, #FFFAF5, #FFFFFF);
  padding: 20px;
}
.auth-card {
  width: 400px; max-width: 100%;
  background: linear-gradient(135deg, #FFFFFF, #FFF9F5);
  border: 1px solid rgba(200, 150, 100, 0.15);
  border-radius: 20px;
  padding: 40px 36px;
  box-shadow: 0 4px 24px rgba(139, 94, 60, 0.08);
}
.auth-header { text-align: center; margin-bottom: 32px; }
.auth-header h2 {
  font-size: 24px; font-weight: 600;
  background: linear-gradient(135deg, #8B5E3C, #FB7299);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  margin: 0 0 8px;
}
.auth-header p { font-size: 14px; color: #8B7355; margin: 0; }
.auth-form { display: flex; flex-direction: column; gap: 20px; }
.af-group { display: flex; flex-direction: column; gap: 6px; }
.af-group label { font-size: 13px; font-weight: 500; color: #5C4033; }
.af-group input {
  padding: 12px 14px; border: 1px solid rgba(200, 150, 100, 0.2);
  border-radius: 10px; font-size: 14px; background: #FFFFFF;
  color: #5C4033; outline: none; transition: all 0.2s;
}
.af-group input:focus {
  border-color: #FB7299; box-shadow: 0 0 0 3px rgba(251, 114, 153, 0.1);
}
.plan-options {
  display: flex; gap: 8px;
}
.plan-option {
  flex: 1; display: flex; flex-direction: column; align-items: center; gap: 4px;
  padding: 10px 8px; border: 1px solid rgba(200, 150, 100, 0.2);
  border-radius: 10px; cursor: pointer; transition: all 0.2s;
  background: #FFFFFF; color: #5C4033;
}
.plan-option:hover { border-color: #FB7299; }
.plan-option.active {
  border-color: #FB7299; background: rgba(251, 114, 153, 0.06);
  box-shadow: 0 0 0 2px rgba(251, 114, 153, 0.15);
}
.po-label { font-size: 13px; font-weight: 500; }
.po-price { font-size: 11px; color: #8B7355; }
.plan-option.active .po-price { color: #FB7299; font-weight: 600; }

.af-error { font-size: 13px; color: #E85D75; text-align: center; }
.af-btn {
  padding: 12px; border: none; border-radius: 10px;
  background: linear-gradient(135deg, #FB7299, #E85D75);
  color: white; font-size: 15px; font-weight: 600;
  cursor: pointer; transition: all 0.2s;
  box-shadow: 0 2px 8px rgba(251, 114, 153, 0.25);
}
.af-btn:hover:not(:disabled) { opacity: 0.9; box-shadow: 0 4px 12px rgba(251, 114, 153, 0.35); }
.af-btn:disabled { opacity: 0.5; cursor: not-allowed; }
.auth-footer {
  display: flex; justify-content: space-between; margin-top: 24px;
}
.af-link {
  background: none; border: none; font-size: 13px; color: #FB7299;
  cursor: pointer; padding: 4px;
}
.af-link:hover { text-decoration: underline; }

@media (max-width: 600px) {
  .auth-page { padding: 12px; }
  .auth-card { padding: 28px 20px; }
  .auth-header h2 { font-size: 20px; }
  .auth-header p { font-size: 13px; }
  .auth-header { margin-bottom: 24px; }
  .af-group input { padding: 10px 12px; }
  .af-btn { padding: 10px; font-size: 14px; }
}
</style>
