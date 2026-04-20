// funtion to generate token using jwt
import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'
import { Response } from 'express'

dotenv.config()


export const generateToken = (res: Response, userId: string) => {
  const jwt_secret = process.env.JWT_SECRET
  const refreshSecret = process.env.REFRESH_TOKEN_SECRET

  if (!jwt_secret || !refreshSecret) {
    throw new Error('JWT_SECRET and REFRESH_TOKEN_SECRET must be defined in the .env file')
  }

  try {
    const accessToken = jwt.sign({ userId }, jwt_secret, { expiresIn: "30min" })
    const refreshToken = jwt.sign({ userId }, refreshSecret, { expiresIn: "7d" })
    const isProduction = process.env.NODE_ENV === 'production'
    const cookieSameSite = isProduction ? 'none' : 'strict'

    // Set the access token in an HTTP-only cookie
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: cookieSameSite,
      maxAge: 30 * 60 * 1000,
    })

    //  Set the refresh token in a cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: cookieSameSite,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })

  } catch (error) {
    console.error('Error generating tokens:', error)
    throw new Error('Failed to generate tokens')
  }
}
