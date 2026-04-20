// function to logou

import { Response } from "express"
import asyncHandler from "../../middlewares/asyncHandler"



export const logout = asyncHandler(
  async (req: any, res: Response) => {
    const isProduction = process.env.NODE_ENV === 'production'
    const cookieSameSite = isProduction ? 'none' : 'strict'

    // Clear the access token cookie
    res.clearCookie('accessToken', {
      httpOnly: true,
      secure: isProduction,
      sameSite: cookieSameSite
    })
    // Clear the refresh token cookie
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: isProduction,
      sameSite: cookieSameSite
    })

    res.status(200).json({
      message: 'User logged out successfully'
    })
  }
)
