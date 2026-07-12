import { Router } from 'express'
import { headroomOk, headroomStats } from '../graph/llm.js'

const router = Router()

router.get('/headroom/status', (_, res) => {
  res.json({
    enabled: headroomOk,
    proxyUrl: process.env.HEADROOM_BASE_URL || 'http://localhost:8787',
    stats: headroomStats,
  })
})

export default router
