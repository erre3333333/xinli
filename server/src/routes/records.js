import { Router } from 'express'
import { getDb, saveDb } from '../data/database.js'
import { authMiddleware } from '../middleware/auth.js'

const router = Router()

function queryAll(sql, params = []) {
  const db = getDb()
  const stmt = db.prepare(sql)
  if (params.length) stmt.bind(params)
  const rows = []
  while (stmt.step()) rows.push(stmt.getAsObject())
  stmt.free()
  return rows
}

router.get('/records', authMiddleware, (req, res) => {
  try {
    const records = queryAll(
      `SELECT id, record_type, title, content, summary, doctor_type, session_data, created_at
       FROM medical_records WHERE user_id = ?
       ORDER BY created_at DESC`, [req.user.id]
    )
    res.json(records.map(r => ({ ...r, session_data: JSON.parse(r.session_data || '{}') })))
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

router.get('/records/history', authMiddleware, (req, res) => {
  try {
    const history = queryAll(
      `SELECT record_type, title, summary, doctor_type, created_at
       FROM medical_records WHERE user_id = ?
       ORDER BY created_at DESC LIMIT 20`, [req.user.id]
    )
    res.json(history)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

router.post('/records', authMiddleware, (req, res) => {
  try {
    const { record_type, title, content, summary, doctor_type, session_data } = req.body
    if (!content) {
      return res.status(400).json({ error: '内容不能为空' })
    }
    const db = getDb()
    db.run(
      `INSERT INTO medical_records (user_id, record_type, title, content, summary, doctor_type, session_data)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [req.user.id, record_type || 'diagnosis', title || '', content, summary || '', doctor_type || '', JSON.stringify(session_data || {})]
    )
    saveDb()
    res.json({ success: true })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

export default router
