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

// Parse origins from .env
const parseOrigins = (value?: string) =>
  value
    ?.split(',')
    .map((origin) => origin.trim())
    .filter(Boolean) || []

const allowedOrigins = parseOrigins(process.env.CORS_ORIGINS)

// Debug (optional)
console.log(' Allowed Origins:', allowedOrigins)

// Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

// CORS config
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow tools like Postman or server-to-server requests
      if (!origin) return callback(null, true)

      if (allowedOrigins.includes(origin)) {
        return callback(null, true)
      }

      return callback(new Error(`🙅‍♂️ CORS blocked: ${origin}`))
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true,
  })
)

//  Test route
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Welcome to Smart Season API',
  })
})

//  Routes
app.use('/auth', authRoutes)
app.use('/field', fieldRoutes)
app.use('/stage', stageRoutes)
app.use('/users', userRoutes)

// Start server after DB connects
const startServer = async () => {
  try {
    await prisma.$connect()
    console.log(' Database connected 🔥')

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT} 😎`)
    })
  } catch (error) {
    console.error('🙅‍♂️ Database connection failed')
    console.error(error)
    process.exit(1)
  }
}

void startServer()