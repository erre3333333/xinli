import jwt from 'jsonwebtoken'
import { getDb, saveDb } from '../data/database.js'

const JWT_SECRET = process.env.JWT_SECRET || 'therapy-secret-key-2024'
const DAILY_LIMIT = 10

function today() {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function getUsage(identifier, identifierType) {
  const db = getDb()
  const stmt = db.prepare(
    'SELECT count FROM daily_usage WHERE identifier = ? AND identifier_type = ? AND date = ?'
  )
  stmt.bind([identifier, identifierType, today()])
  let count = 0
  if (stmt.step()) {
    const row = stmt.getAsObject()
    count = row.count
  }
  stmt.free()
  return count
}

function incrementUsage(identifier, identifierType) {
  const db = getDb()
  db.run(
    `INSERT INTO daily_usage (identifier, identifier_type, date, count)
     VALUES (?, ?, ?, 1)
     ON CONFLICT(identifier, identifier_type, date)
     DO UPDATE SET count = count + 1`,
    [identifier, identifierType, today()]
  )
  saveDb()
}

function isPlanValid(plan, planExpiresAt) {
  if (plan === 'monthly' || plan === 'yearly') {
    if (planExpiresAt) {
      const expires = new Date(planExpiresAt)
      if (expires > new Date()) return true
    }
  }
  return false
}

export function createPlanLimit(feature = 'chat') {
  return function planLimit(req, res, next) {
    const header = req.headers.authorization

    if (header && header.startsWith('Bearer ')) {
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

        if (user && isPlanValid(user.plan, user.plan_expires_at)) {
          req.plan = { tier: user.plan, unlimited: true }
          return next()
        }
      } catch { /* fall through */ }
    }

    req.plan = { tier: 'free', unlimited: true }
    next()
  }
}

export const planLimit = createPlanLimit('chat')
export { DAILY_LIMIT }
