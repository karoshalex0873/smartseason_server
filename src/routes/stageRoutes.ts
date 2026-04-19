import express from 'express'
import { trackStage } from '../controllers/stageAndStatus/trackStage'
import { protect } from '../middlewares/auth/protect'
import { adminOrAgent } from '../middlewares/auth/roleGuard'

const router = express.Router()

router.post('/track/:id', protect, adminOrAgent, trackStage)


export default router