// protect middleware
import { NextFunction, Response } from "express";
import asyncHandler from "../asyncHandler";
import { UserRequest } from "../../utils/types";
import jwt from "jsonwebtoken"
import prisma from "../../lib/prisma";


export const protect = asyncHandler(
  async (req: UserRequest, res: Response, next: NextFunction) => {
    //  1.Get token from cookies
    const token = req.cookies?.accessToken
    if (!token) {
      res.status(401).json({
        message: 'Not authorized, no token'
      })
      return
    }

    try {
      //2. verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string }

      // 3. Find user from decoded token
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        include: { role: true }

      })
      if (!user) {
        res.status(401).json({
          message: 'Not authorized, user not found'
        })
        return
      }

      // 4. attach user to request object
      req.user = user
      next()
    } catch (error) {
      res.status(401).json({
        message: 'Not authorized, token failed'
      })
      return
    }
  }
)