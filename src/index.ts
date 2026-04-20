import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import prisma from './lib/prisma'

import authRoutes from './routes/authRoutes'
import fieldRoutes from './routes/fieldRoutes'
import stageRoutes from './routes/stageRoutes'
import userRoutes from './routes/userRoutes'

// Load env
dotenv.config()

const app = express()

const PORT = process.env.PORT || 3000

// cors
const parseOrigins = (value?: string) =>
  value?.split(',').map(o => o.trim()).filter(Boolean) || []

const allowedOrigins = parseOrigins(process.env.CORS_ORIGINS)

console.log('Allowed Origins:', allowedOrigins)

// middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true)

      if (allowedOrigins.includes(origin)) {
        return callback(null, true)
      }

      console.warn(`CORS blocked: ${origin}`)
      return callback(null, false)
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  })
)
// test route
app.get('/', (_, res) => {
  res.json({ message: 'SmartSeason API is running 🚀' })
})

// routes
app.use('/auth', authRoutes)
app.use('/field', fieldRoutes)
app.use('/stage', stageRoutes)
app.use('/users', userRoutes)


app.listen(PORT, async () => {
  console.log(`🚀 Server running on port ${PORT}`)

  // DB connects AFTER server is alive (CRITICAL FIX)
  try {
    await prisma.$connect()
    console.log('🔥 Database connected')
  } catch (error) {
    console.error('❌ DB connection failed (non-fatal):', error)
  }
})