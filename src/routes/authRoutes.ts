import express from 'express'
import { signUp } from '../controllers/auth/signUp'
import { signIn } from '../controllers/auth/signIn'
import { logout } from '../controllers/auth/logout'
import { getCurrentUser } from '../controllers/auth/getCurrent'
import { protect } from '../middlewares/auth/protect'


const router = express.Router()


// 1. signup route
router.post('/signup', signUp)

// 2. login route
router.post('/signin', signIn)


// 3 logout route
router.post('/logout',logout)

// 4 current user route
router.get('/current', protect, getCurrentUser)


export default router
