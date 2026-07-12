import jwt from 'jsonwebtoken'
import { getDb } from '../data/database.js'

const JWT_SECRET = process.env.JWT_SECRET || 'therapy-secret-key-2024'

const PAID_PATHS = ['/api/assess', '/api/comprehensive', '/api/medication']

export function requirePaidPlan(req, res, next) {
  if (!PAID_PATHS.some(p => (req.originalUrl || req.path).startsWith(p))) return next()

  const header = req.headers.authorization
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: '请先登录' })
  }

  try {
    const token = header.slice(7)
    const decoded = jwt.verify(token, JWT_SECRET)
    req.user = decoded

    const db = getDb()
    const stmt = db.prepare('SELECT plan, plan_expires_at FROM users WHERE id = ?')
    stmt.bind([decoded.id])
    let user = null
    if (stmt.step()) user = stmt.getAsObject()
    stmt.free()

    if (!user || user.plan === 'free') {
      return res.status(403).json({
        error: '该功能仅对付费用户开放，请升级会员',
        needUpgrade: true,
      })
    }

    if (user.plan === 'monthly' || user.plan === 'yearly') {
      if (user.plan_expires_at) {
        const expires = new Date(user.plan_expires_at)
        if (expires > new Date()) return next()
      }
      return res.status(403).json({
        error: '会员已过期，请续费',
        needUpgrade: true,
      })
    }

    next()
  } catch {
    return res.status(401).json({ error: '登录已过期，请重新登录' })
  }
}
