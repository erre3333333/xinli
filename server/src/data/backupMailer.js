import nodemailer from 'nodemailer'
import { join, dirname } from 'path'
import { createReadStream, existsSync } from 'fs'
import { fileURLToPath } from 'url'
import { createBackup } from './backup.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DATA_DIR = process.env.DATA_DIR || __dirname

let transporter = null

function getTransporter() {
  if (transporter) return transporter
  const host = process.env.SMTP_HOST
  const port = parseInt(process.env.SMTP_PORT || '587')
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS
  const from = process.env.SMTP_FROM || user
  if (!host || !user || !pass) return null
  transporter = nodemailer.createTransport({
    host, port,
    secure: port === 465,
    auth: { user, pass },
  })
  return transporter
}

export async function emailBackup() {
  const t = getTransporter()
  if (!t) return { error: 'SMTP 未配置' }

  const b = createBackup()
  const to = process.env.BACKUP_EMAIL_TO || process.env.SMTP_USER

  const info = await t.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to,
    subject: `数据库备份 ${b.name}`,
    text: `自动备份文件：${b.name}\n生成时间：${new Date().toLocaleString('zh-CN')}`,
    attachments: [{ filename: b.name, path: b.path }],
  })

  return { success: true, messageId: info.messageId, file: b.name }
}
