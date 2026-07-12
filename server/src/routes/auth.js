import { Router } from 'express'
import bcrypt from 'bcryptjs'
import { getDb, saveDb } from '../data/database.js'
import { generateToken, authMiddleware } from '../middleware/auth.js'

const router = Router()

// sql.js 工具：exec 返回 [{columns, values}]，包装成更友好的方式
function queryAll(sql, params = []) {
  const db = getDb()
  const stmt = db.prepare(sql)
  if (params.length) stmt.bind(params)
  const rows = []
  while (stmt.step()) rows.push(stmt.getAsObject())
  stmt.free()
  return rows
}

function queryOne(sql, params = []) {
  return queryAll(sql, params)[0] || null
}

function run(sql, params = []) {
  const db = getDb()
  db.run(sql, params)
  saveDb()
}

router.post('/auth/register', async (req, res) => {
  try {
    const { username, password, name, plan } = req.body
    if (!username || !password) {
      return res.status(400).json({ error: '用户名和密码不能为空' })
    }
    if (username.length < 2 || password.length < 4) {
      return res.status(400).json({ error: '用户名至少2位，密码至少4位' })
    }

    const existing = queryOne('SELECT id FROM users WHERE username = ?', [username])
    if (existing) {
      return res.status(409).json({ error: '用户名已存在' })
    }

    const selectedPlan = ['monthly', 'yearly'].includes(plan) ? plan : 'free'
    const hash = await bcrypt.hash(password, 10)
    run('INSERT INTO users (username, password_hash, name, plan) VALUES (?, ?, ?, ?)', [username, hash, name || username, selectedPlan])

    const user = queryOne('SELECT id, username, name, avatar, plan, created_at FROM users WHERE username = ?', [username])
    const token = generateToken(user)
    res.json({ token, user })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

router.post('/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body
    if (!username || !password) {
      return res.status(400).json({ error: '用户名和密码不能为空' })
    }

    const user = queryOne('SELECT id, username, password_hash, name, avatar, created_at FROM users WHERE username = ?', [username])
    if (!user) {
      return res.status(401).json({ error: '用户名或密码错误' })
    }

    const match = await bcrypt.compare(password, user.password_hash)
    if (!match) {
      return res.status(401).json({ error: '用户名或密码错误' })
    }

    delete user.password_hash
    const token = generateToken(user)
    res.json({ token, user })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

router.get('/auth/profile', authMiddleware, (req, res) => {
  const user = queryOne('SELECT id, username, name, avatar, created_at, plan, plan_expires_at FROM users WHERE id = ?', [req.user.id])
  if (!user) return res.status(404).json({ error: '用户不存在' })
  res.json(user)
})

router.put('/auth/change-password', authMiddleware, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body
    if (!oldPassword || !newPassword) {
      return res.status(400).json({ error: '请填写旧密码和新密码' })
    }
    if (newPassword.length < 4) {
      return res.status(400).json({ error: '新密码至少4位' })
    }

    const user = queryOne('SELECT password_hash FROM users WHERE id = ?', [req.user.id])
    if (!user) return res.status(404).json({ error: '用户不存在' })

    const match = await bcrypt.compare(oldPassword, user.password_hash)
    if (!match) {
      return res.status(401).json({ error: '旧密码错误' })
    }

    const hash = await bcrypt.hash(newPassword, 10)
    db.run('UPDATE users SET password_hash = ? WHERE id = ?', [hash, req.user.id])
    saveDb()
    res.json({ success: true })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

export default router
