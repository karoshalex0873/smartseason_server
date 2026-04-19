// signIn

import prisma from "../../lib/prisma";
import asynHandler from "../../middlewares/asyncHandler";
import { Response, Request } from "express";
import * as argon2 from "argon2"
import jwt from "jsonwebtoken"
import { generateToken } from "../../utils/generateToken";

export const signIn = asynHandler(
  async (req: Request, res: Response) => {
    // 1. Get the user data from the request body
    const { email, password } = req.body

    // 2. Validate the user data
    if (!email || !password) {
      res.status(400).json({
        message: 'Please provide both email and password'
      })
      return
    }

    // 3. Find the user by email
    const findUser = await prisma.user.findUnique({
      where: { email: email },
      include: { role: true }
    })
    // 4. If user not found, return error

    if (!findUser) {
      res.status(400).json({
        message: 'Invalid email or password'
      })
      return
    }

    // 5. Verify the password
    const isPasswordMatch = await argon2.verify(findUser.password, password)

    // 6. If password is incorrect, return error
    if (!isPasswordMatch) {
      res.status(400).json({
        message: 'Invalid email or password'
      })
      return
    }

    // 7. Generate JWT token
    generateToken(res, findUser.id)

    // 8. Return the user data without password
    const { password: _, ...userWithoutPassword } = findUser

    res.status(200).json({
      message: 'User logged in successfully',
      user: userWithoutPassword
    })
  })