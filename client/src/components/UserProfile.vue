<script setup>
import { ref, onMounted } from 'vue'
import { getProfile, getRecords, changePassword } from '../utils/api.js'
import { ElMessage } from 'element-plus'

const emit = defineEmits(['logout', 'back'])

const user = ref(null)
const records = ref([])
const loading = ref(true)
const detailRecord = ref(null)
const showChangePassword = ref(false)
const pwdForm = ref({ oldPassword: '', newPassword: '', confirmPassword: '' })
const pwdLoading = ref(false)

onMounted(async () => {
  try {
    user.value = await getProfile()
    records.value = await getRecords()
  } catch (e) {
    console.error('加载用户信息失败:', e)
  } finally {
    loading.value = false
  }
})

function formatDate(d) {
  if (!d) return ''
  return d.slice(0, 10) + ' ' + d.slice(11, 16)
}

function recordIcon(type) {
  const icons = { diagnosis: '🩺', chat: '💬', scale: '📋', assessment: '📝' }
  return icons[type] || '📄'
}

function viewRecord(r) {
  detailRecord.value = r
}

function closeDetail() {
  detailRecord.value = null
}

function handleLogout() {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  emit('logout')
}

async function handleChangePassword() {
  if (!pwdForm.value.newPassword || pwdForm.value.newPassword !== pwdForm.value.confirmPassword) {
    ElMessage.warning('两次输入的密码不一致')
    return
  }
  if (pwdForm.value.newPassword.length < 4) {
    ElMessage.warning('新密码至少4位')
    return
  }
  pwdLoading.value = true
  try {
    await changePassword({
      oldPassword: pwdForm.value.oldPassword,
      newPassword: pwdForm.value.newPassword,
    })
    ElMessage.success('密码修改成功')
    showChangePassword.value = false
    pwdForm.value = { oldPassword: '', newPassword: '', confirmPassword: '' }
  } catch (e) {
    ElMessage.error(e.message || '修改失败')
  } finally {
    pwdLoading.value = false
  }
}
</script>

<template>
  <div class="profile-page">
    <div class="profile-card">
      <div class="pc-avatar">
        <span>{{ user?.name?.charAt(0) || 'U' }}</span>
      </div>
      <h2 class="pc-name">{{ user?.name || '用户' }}</h2>
      <p class="pc-username">@{{ user?.username }}</p>
      <p class="pc-date">注册时间：{{ formatDate(user?.created_at) }}</p>
      <div class="pc-actions">
        <button class="pc-changepwd" @click="showChangePassword = true">修改密码</button>
        <button class="pc-logout" @click="handleLogout">退出登录</button>
      </div>
    </div>

    <div class="records-section">
      <h3 class="rs-title">📋 我的病历记录</h3>
      <p class="rs-desc">您的每一次咨询和诊断记录都会保存在这里，方便持续跟踪</p>

      <div v-if="loading" class="rs-loading">加载中…</div>
      <div v-else-if="!records.length" class="rs-empty">
        <p>暂无病历记录</p>
        <p class="rs-empty-hint">完成 AI 问诊后，诊断结果将自动保存至此</p>
      </div>
      <div v-else class="rs-list">
        <div v-for="r in records" :key="r.id" class="rs-item" @click="viewRecord(r)">
          <div class="rsi-icon">{{ recordIcon(r.record_type) }}</div>
          <div class="rsi-body">
            <div class="rsi-title">{{ r.title || r.record_type }}</div>
            <div class="rsi-meta">
              <span>{{ r.doctor_type || '系统记录' }}</span>
              <span class="rsi-dot">·</span>
              <span>{{ formatDate(r.created_at) }}</span>
            </div>
            <div v-if="r.summary" class="rsi-summary">{{ r.summary.slice(0, 120) }}{{ r.summary.length > 120 ? '…' : '' }}</div>
          </div>
          <div class="rsi-arrow">›</div>
        </div>
      </div>
    </div>

    <!-- 记录详情弹窗 -->
    <div v-if="detailRecord" class="detail-overlay" @click.self="closeDetail">
      <div class="detail-card">
        <div class="detail-hd">
          <h3>{{ detailRecord.title || detailRecord.record_type }}</h3>
          <button class="detail-close" @click="closeDetail">✕</button>
        </div>
        <div class="detail-meta">
          <span>{{ detailRecord.doctor_type || '系统记录' }}</span>
          <span class="rsi-dot">·</span>
          <span>{{ formatDate(detailRecord.created_at) }}</span>
        </div>
        <div class="detail-body">{{ detailRecord.content }}</div>
      </div>
    </div>

    <!-- 修改密码弹窗 -->
    <div v-if="showChangePassword" class="pwd-overlay" @click.self="showChangePassword = false">
      <div class="pwd-card">
        <h3>修改密码</h3>
        <div class="pwd-form">
          <div class="pwd-field">
            <label>旧密码</label>
            <input v-model="pwdForm.oldPassword" type="password" placeholder="请输入旧密码" />
          </div>
          <div class="pwd-field">
            <label>新密码</label>
            <input v-model="pwdForm.newPassword" type="password" placeholder="至少4位" />
          </div>
          <div class="pwd-field">
            <label>确认新密码</label>
            <input v-model="pwdForm.confirmPassword" type="password" placeholder="再次输入新密码" />
          </div>
        </div>
        <div class="pwd-actions">
          <button class="pwd-cancel" @click="showChangePassword = false">取消</button>
          <button class="pwd-submit" :disabled="pwdLoading" @click="handleChangePassword">
            {{ pwdLoading ? '提交中…' : '确认修改' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.profile-page {
  height: 100%; overflow-y: auto; padding: 24px;
  background: linear-gradient(180deg, #FFFAF5, #FFFFFF);
  display: flex; flex-direction: column; gap: 20px;
  max-width: 600px; margin: 0 auto; width: 100%;
}
.profile-card {
  background: linear-gradient(135deg, #FFFFFF, #FFF9F5);
  border: 1px solid rgba(200, 150, 100, 0.15);
  border-radius: 20px; padding: 32px; text-align: center;
  box-shadow: 0 2px 12px rgba(139, 94, 60, 0.06);
}
.pc-avatar {
  width: 72px; height: 72px; border-radius: 50%; margin: 0 auto 16px;
  background: linear-gradient(135deg, #FB7299, #E85D75);
  display: flex; align-items: center; justify-content: center;
  font-size: 28px; font-weight: 700; color: white;
  box-shadow: 0 4px 12px rgba(251, 114, 153, 0.3);
}
.pc-name { font-size: 22px; font-weight: 600; color: #5C4033; margin: 0 0 4px; }
.pc-username { font-size: 14px; color: #8B7355; margin: 0 0 8px; }
.pc-date { font-size: 12px; color: #B89E82; margin: 0 0 16px; }
.pc-actions { display: flex; gap: 12px; justify-content: center; }
.pc-changepwd {
  padding: 8px 24px; border: 1px solid rgba(251, 114, 153, 0.3);
  border-radius: 20px; background: transparent;
  color: #FB7299; font-size: 13px; cursor: pointer;
  transition: all 0.2s;
}
.pc-changepwd:hover { background: rgba(251, 114, 153, 0.08); }
.pc-logout {
  padding: 8px 24px; border: 1px solid rgba(200, 150, 100, 0.2);
  border-radius: 20px; background: transparent;
  color: #8B7355; font-size: 13px; cursor: pointer;
  transition: all 0.2s;
}
.pc-logout:hover { border-color: #FB7299; color: #FB7299; }

.records-section { flex: 1; }
.rs-title { font-size: 18px; font-weight: 600; color: #8B5E3C; margin: 0 0 4px; }
.rs-desc { font-size: 13px; color: #8B7355; margin: 0 0 20px; }
.rs-loading, .rs-empty { text-align: center; padding: 40px 0; color: #8B7355; }
.rs-empty-hint { font-size: 12px; color: #B89E82; margin-top: 8px; }
.rs-list { display: flex; flex-direction: column; gap: 10px; }
.rs-item {
  display: flex; gap: 12px; padding: 16px;
  background: linear-gradient(135deg, #FFFFFF, #FFF9F5);
  border: 1px solid rgba(200, 150, 100, 0.1);
  border-radius: 12px;
  box-shadow: 0 1px 4px rgba(139, 94, 60, 0.04);
}
.rsi-icon { font-size: 24px; flex-shrink: 0; margin-top: 2px; }
.rsi-body { flex: 1; min-width: 0; }
.rsi-title { font-size: 14px; font-weight: 600; color: #5C4033; }
.rsi-meta { font-size: 11px; color: #B89E82; margin: 2px 0 4px; }
.rsi-dot { margin: 0 4px; }
.rsi-summary { font-size: 12px; color: #8B7355; line-height: 1.5; }
.rsi-arrow { font-size: 20px; color: #B89E82; align-self: center; flex-shrink: 0; }
.rs-item { cursor: pointer; transition: all 0.2s; }
.rs-item:hover { border-color: #FB7299; box-shadow: 0 2px 12px rgba(251, 114, 153, 0.08); }

.detail-overlay {
  position: fixed; inset: 0; z-index: 1000;
  background: rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center;
  padding: 20px; backdrop-filter: blur(2px);
}
.detail-card {
  background: linear-gradient(180deg, #FFFFFF, #FFF9F5);
  border: 1px solid rgba(200, 150, 100, 0.15); border-radius: 16px;
  max-width: 560px; width: 100%; max-height: 80vh; display: flex; flex-direction: column;
  box-shadow: 0 8px 40px rgba(0,0,0,0.12);
}
.detail-hd {
  display: flex; align-items: center; justify-content: space-between;
  padding: 20px 24px 12px; border-bottom: 1px solid rgba(200, 150, 100, 0.1);
}
.detail-hd h3 { font-size: 16px; font-weight: 600; color: #5C4033; margin: 0; }
.detail-close {
  width: 28px; height: 28px; border-radius: 50%; border: none;
  background: rgba(200, 150, 100, 0.1); color: #8B7355; cursor: pointer; font-size: 13px;
}
.detail-close:hover { background: rgba(200, 150, 100, 0.2); }
.detail-meta { font-size: 12px; color: #B89E82; padding: 8px 24px; }
.detail-body {
  flex: 1; overflow-y: auto; padding: 12px 24px 24px;
  font-size: 14px; line-height: 1.8; color: #5C4033; white-space: pre-wrap;
}

.pwd-overlay {
  position: fixed; inset: 0; z-index: 1000;
  background: rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center;
  padding: 20px; backdrop-filter: blur(2px);
}
.pwd-card {
  background: linear-gradient(180deg, #FFFFFF, #FFF9F5);
  border: 1px solid rgba(200, 150, 100, 0.15); border-radius: 20px;
  padding: 32px; max-width: 400px; width: 100%;
  box-shadow: 0 8px 40px rgba(0,0,0,0.12);
}
.pwd-card h3 {
  font-size: 18px; font-weight: 600; color: #5C4033; margin: 0 0 20px;
  text-align: center;
}
.pwd-form { display: flex; flex-direction: column; gap: 16px; margin-bottom: 24px; }
.pwd-field label {
  display: block; font-size: 13px; font-weight: 500; color: #5C4033; margin-bottom: 6px;
}
.pwd-field input {
  padding: 10px 14px; border: 1px solid rgba(200, 150, 100, 0.2);
  border-radius: 10px; font-size: 14px; background: #fff;
  color: #5C4033; outline: none; transition: all 0.2s;
}
.pwd-field input:focus {
  border-color: #FB7299; box-shadow: 0 0 0 3px rgba(251, 114, 153, 0.1);
}
.pwd-actions { display: flex; gap: 12px; justify-content: center; }
.pwd-cancel {
  flex: 1; padding: 10px; border: 1px solid rgba(200, 150, 100, 0.2);
  border-radius: 10px; background: #fff; color: #8B7355;
  font-size: 14px; cursor: pointer; transition: all 0.2s;
}
.pwd-cancel:hover { border-color: #B89E82; }
.pwd-submit {
  flex: 1; padding: 10px; border: none; border-radius: 10px;
  background: linear-gradient(135deg, #FB7299, #E85D75);
  color: #fff; font-size: 14px; font-weight: 600; cursor: pointer;
  transition: all 0.2s;
}
.pwd-submit:hover:not(:disabled) { opacity: 0.9; }
.pwd-submit:disabled { opacity: 0.5; cursor: not-allowed; }

@media (max-width: 600px) {
  .profile-page { padding: 16px; }
  .profile-card { padding: 24px 20px; }
  .pc-name { font-size: 18px; }
  .pc-avatar { width: 60px; height: 60px; font-size: 24px; }
  .detail-card { max-height: 90vh; }
  .detail-hd { padding: 16px 20px 10px; }
  .detail-body { padding: 10px 20px 20px; }
  .pwd-card { padding: 24px 20px; }
}
</style>
