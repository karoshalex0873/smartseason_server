// get current user (logged in user) controller
import { Response } from "express";
import prisma from "../../lib/prisma";  
import asyncHandler from "../../middlewares/asyncHandler";
import { UserRequest } from "../../utils/types";


export const getCurrentUser  = asyncHandler(
  async( req:UserRequest, res:Response)=>{
    // get user from request object
    const user = req.user
    if (!user) {
      return res.status(401).json({
        message: "Unauthorized"
      })
    }

    // get user from database
    const currentUser = await prisma.user.findUnique({
      where: {
        id: user.id
      },
      include: {
        role: true,
      },
    })

    if (!currentUser) {
      return res.status(404).json({
        message: "User not found"
      })
    }

    // return user data
    res.status(200).json({
      message: "Current user fetched successfully",
      user: {
        id: currentUser.id,
        name: currentUser.name,
        email: currentUser.email,
        role: currentUser.role.name,
      }
    })
  }
)
