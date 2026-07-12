<script setup>
import { ref } from 'vue'
import { login, register } from '../utils/api.js'

const emit = defineEmits(['login-success', 'back'])

const isRegister = ref(false)
const form = ref({ username: '', password: '', name: '' })
const loading = ref(false)
const error = ref('')

async function submit() {
  error.value = ''
  loading.value = true
  try {
    const fn = isRegister.value ? register : login
    const res = await fn({
      username: form.value.username,
      password: form.value.password,
      name: form.value.name || form.value.username,
    })
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
</style>
