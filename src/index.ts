import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import prisma from './lib/prisma';
import fieldRoutes from './routes/fieldRoutes';
import cookieParser from 'cookie-parser';
import stageRoutes from './routes/stageRoutes';


// config the dotenv file
dotenv.config()


// 1. Instance of express
const app = express()

// 2. Load port from .env file
const PORT= process.env.PORT || 3000


// 3. Middleware to parse JSON bodies
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())


// cors origins and  methods 



// 4. Api welcome to test
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'welcome to Smart Season API'
  })
})

// 5. Routes layer
// 5.1. Auth routes
app.use('/auth',authRoutes,)
// 5.2. Field routes
app.use('/field', fieldRoutes)
// 5.3. track status and stages routes
app.use('/stage', stageRoutes)
// 5.4. Episode routes
// 5.5. Comment routes

// 6. Data base connection



// 7. Start the server after the database connection succeeds
const startServer = async () => {
  try {
    await prisma.$connect()
    console.log('Database connection established ')

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`)
    })
  } catch (error) {
    console.error('Failed to connect to the database. Server startup aborted.')
    console.error(error)
    process.exit(1)
  }
}

void startServer()
