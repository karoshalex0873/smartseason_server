import express from 'express'
import { signUp } from '../controllers/auth/signUp'
import { signIn } from '../controllers/auth/signIn'
import { logout } from '../controllers/auth/logout'


const router = express.Router()


// 1. signup route
router.post('/signup', signUp)

// 2. login route
router.post('/signin', signIn)


// 3 logout route
router.post('/logout',logout)


export default router