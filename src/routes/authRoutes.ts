import express from 'express'
import { signUp } from '../controllers/auth/signUp'


const router = express.Router()


// 1. signup route
router.post('/signup', signUp)

// 2. login route
router.post('/login', (req, res) => {
  res.status(200).json({
    message: 'login route'
  })
})


// 3 logout route
router.post('/logout', (req, res) => {
  res.status(200).json({
    message: 'logout route'
  })
})


export default router