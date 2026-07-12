import { Router } from 'express'
import jwt from 'jsonwebtoken'
import { getDb, saveDb } from '../data/database.js'
import { authMiddleware } from '../middleware/auth.js'


const JWT_SECRET = process.env.JWT_SECRET || 'therapy-secret-key-2024'
const router = Router()

const PLANS = {
  free: { label: '免费', price: 0, period: '', messagesPerDay: '无限' },
  monthly: { label: '月付', price: 20, period: '月', messagesPerDay: '无限' },
  yearly: { label: '年付', price: 150, period: '年', messagesPerDay: '无限' },
}

router.get('/plans/info', (_, res) => {
  res.json({ plans: PLANS })
})

router.get('/plans/usage', (req, res) => {
  const header = req.headers.authorization
  if (header && header.startsWith('Bearer ')) {
    try {
      const token = header.slice(7)
      const decoded = jwt.verify(token, JWT_SECRET)
      const stmt = getDb().prepare('SELECT plan, plan_expires_at FROM users WHERE id = ?')
      stmt.bind([decoded.id])
      let user = null
      if (stmt.step()) user = stmt.getAsObject()
      stmt.free()

      if (user && user.plan !== 'free' && user.plan_expires_at && new Date(user.plan_expires_at) > new Date()) {
        return res.json({
          plan: user.plan, unlimited: true, used: 0, limit: '无限', expiresAt: user.plan_expires_at,
        })
      }
    } catch { /* fall through */ }
  }
  res.json({ plan: 'free', unlimited: true, used: 0, limit: '无限', remaining: 999 })
})

router.post('/plans/upgrade', authMiddleware, (req, res) => {
  const { plan } = req.body
  if (!plan || !PLANS[plan] || plan === 'free') {
    return res.status(400).json({ error: '无效的订阅方案' })
  }

  const expiresAt = new Date()
  if (plan === 'monthly') {
    expiresAt.setMonth(expiresAt.getMonth() + 1)
  } else if (plan === 'yearly') {
    expiresAt.setFullYear(expiresAt.getFullYear() + 1)
  }

  const db = getDb()
  db.run('UPDATE users SET plan = ?, plan_expires_at = ? WHERE id = ?', [
    plan, expiresAt.toISOString().slice(0, 10), req.user.id,
  ])
  saveDb()

  res.json({
    success: true,
    plan,
    expiresAt: expiresAt.toISOString().slice(0, 10),
  })
})

router.get('/plans/manage', authMiddleware, (req, res) => {
  const stmt = getDb().prepare('SELECT plan, plan_expires_at, created_at FROM users WHERE id = ?')
  stmt.bind([req.user.id])
  let user = null
  if (stmt.step()) user = stmt.getAsObject()
  stmt.free()

  if (!user) return res.status(404).json({ error: '用户不存在' })

  res.json({
    plan: user.plan,
    expiresAt: user.plan_expires_at,
    registeredAt: user.created_at,
    planInfo: PLANS[user.plan],
  })
})

export default router
