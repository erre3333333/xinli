import { join, dirname } from 'path'
import { copyFileSync, existsSync, mkdirSync, readdirSync, unlinkSync, statSync } from 'fs'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DATA_DIR = process.env.DATA_DIR || __dirname
const BACKUP_DIR = join(DATA_DIR, 'backups')

function pad(n) { return String(n).padStart(2, '0') }
function ts() {
  const d = new Date()
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}_${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`
}

export function createBackup() {
  if (!existsSync(BACKUP_DIR)) mkdirSync(BACKUP_DIR, { recursive: true })
  const name = `therapy_${ts()}.db`
  const dest = join(BACKUP_DIR, name)
  copyFileSync(join(DATA_DIR, 'therapy.db'), dest)
  return { name, path: dest }
}

function cleanOldBackups() {
  if (!existsSync(BACKUP_DIR)) return
  const cutoff = Date.now() - 30 * 24 * 60 * 60 * 1000
  for (const f of readdirSync(BACKUP_DIR)) {
    try { if (statSync(join(BACKUP_DIR, f)).mtimeMs < cutoff) unlinkSync(join(BACKUP_DIR, f)) } catch {}
  }
}

export async function startBackupScheduler() {
  createBackup()
  console.log('已创建首次数据库备份')
  cleanOldBackups()
  // 尝试上传到 GitHub
  try {
    const { uploadBackupToGithub } = await import('./backupUploader.js')
    const r = await uploadBackupToGithub()
    if (r.success) console.log('已上传备份到 GitHub:', r.url)
    else if (r.error && !r.error.includes('未配置')) console.warn('GitHub 上传:', r.error)
  } catch {}
  setInterval(async () => {
    try {
      createBackup()
      cleanOldBackups()
      const { uploadBackupToGithub } = await import('./backupUploader.js')
      const r = await uploadBackupToGithub()
      if (r.success) console.log('备份完成并上传 GitHub')
    } catch (e) { console.error('自动备份失败:', e.message) }
  }, 24 * 60 * 60 * 1000)
}
