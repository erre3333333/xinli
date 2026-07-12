import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import path from 'path'
import chatRouter from './routes/chat.js'
import assessRouter from './routes/assess.js'
import comprehensiveRouter from './routes/comprehensive.js'
import diagnosisRouter from './routes/diagnosis.js'
import autocbtRouter from './routes/autocbt.js'
import fayeRouter from './routes/faye.js'
import headroomRouter from './routes/headroom.js'
import authRouter from './routes/auth.js'
import recordsRouter from './routes/records.js'
import plansRouter from './routes/plans.js'
import { createPlanLimit, planLimit } from './middleware/planLimit.js'
import { requirePaidPlan } from './middleware/requirePaidPlan.js'
import { initDb, closeDb } from './data/database.js'

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json({ limit: '20mb' }))

app.get('/api/health', (_, res) => {
  res.json({ status: 'ok' })
})

app.use('/api', authRouter)
app.use('/api', plansRouter)
app.use('/api', headroomRouter)
app.use('/api', recordsRouter)

app.use('/api', planLimit, chatRouter)
app.use('/api', requirePaidPlan, assessRouter)
app.use('/api', requirePaidPlan, comprehensiveRouter)
app.use('/api', createPlanLimit('diagnosis'), diagnosisRouter)
app.use('/api/autocbt', createPlanLimit('autocbt'), autocbtRouter)
app.use('/api/faye', createPlanLimit('faye'), fayeRouter)

// Production: serve built frontend
if (process.env.NODE_ENV === 'production') {
  const distDir = path.resolve(process.cwd(), '../client/dist')
  app.use(express.static(distDir))
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api'))
      res.sendFile(path.join(distDir, 'index.html'))
  })
}

initDb().then(async () => {
  const bcrypt = await import('bcryptjs')
  const { getDb, saveDb } = await import('./data/database.js')
  const db = getDb()
  try {
    const adminExists = db.prepare('SELECT id FROM users WHERE username = ?').get('admin')
    if (!adminExists) {
      const hash = await bcrypt.hash('19781102', 10)
      db.run('INSERT INTO users (username, password_hash, name, plan) VALUES (?, ?, ?, ?)', ['admin', hash, '管理员', 'yearly'])
      saveDb()
      console.log('已创建管理员账户: admin / 19781102')
    }
  } catch (e) {
    console.error('创建管理员失败:', e.message)
  }
  app.listen(PORT, () => {
    console.log(`心理咨询服务器已启动: http://localhost:${PORT}`)
  })
}).catch(e => {
  console.error('数据库初始化失败:', e)
  process.exit(1)
})

process.on('SIGINT', () => { closeDb(); process.exit() })
process.on('SIGTERM', () => { closeDb(); process.exit() })
