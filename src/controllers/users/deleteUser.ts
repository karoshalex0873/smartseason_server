import { Request, Response } from "express";
import prisma from "../../lib/prisma";
import asyncHandler from "../../middlewares/asyncHandler";
import { UserRequest } from "../../utils/types";

type UserParams = {
  id: string
}

type DeleteUserRequest = Request<UserParams> & UserRequest

export const deleteUser = asyncHandler(
  async (req: DeleteUserRequest, res: Response) => {
    const { id } = req.params

    if (!req.user) {
      res.status(401).json({
        message: "Not authorized"
      })
      return
    }

    if (!id) {
      res.status(400).json({
        message: "User id is required"
      })
      return
    }

    if (req.user.id === id) {
      res.status(400).json({
        message: "You cannot delete your own account"
      })
      return
    }

    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        fields: true,
        updates: true,
        role: true,
      },
    })

    if (!user) {
      res.status(404).json({
        message: "User not found"
      })
      return
    }

    if (user.fields.length > 0 || user.updates.length > 0) {
      res.status(400).json({
        message: "Cannot delete a user who is assigned to fields or has progress updates"
      })
      return
    }

    await prisma.user.delete({
      where: { id },
    })

    res.status(200).json({
      message: "User deleted successfully"
    })
  }
)
