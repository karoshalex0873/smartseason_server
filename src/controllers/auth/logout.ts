// function to logou

import { Response } from "express"
import asynHandler from "../../middlewares/asyncHandler"



export const logout = asynHandler(
  async (req: any, res: Response) => {
    // Clear the access token cookie
    res.clearCookie('accessToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    })
    // Clear the refresh token cookie
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    })

    res.status(200).json({
      message: 'User logged out successfully'
    })
  }
)