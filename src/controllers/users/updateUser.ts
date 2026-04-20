import { Request, Response } from "express";
import prisma from "../../lib/prisma";
import asyncHandler from "../../middlewares/asyncHandler";
import { UserRequest } from "../../utils/types";

type UserParams = {
  id: string
}

type UpdateUserBody = {
  name?: string
  email?: string
  roleId?: string
}

type UpdateUserRequest = Request<UserParams, {}, UpdateUserBody> & UserRequest

export const updateUser = asyncHandler(
  async (req: UpdateUserRequest, res: Response) => {
    const { id } = req.params
    const { name, email, roleId } = req.body

    if (!id) {
      res.status(400).json({
        message: "User id is required"
      })
      return
    }

    const existingUser = await prisma.user.findUnique({
      where: { id },
      include: { role: true },
    })

    if (!existingUser) {
      res.status(404).json({
        message: "User not found"
      })
      return
    }

    if (email && email !== existingUser.email) {
      const emailExists = await prisma.user.findUnique({
        where: { email },
      })

      if (emailExists) {
        res.status(409).json({
          message: "User with this email already exists"
        })
        return
      }
    }

    if (roleId) {
      const selectedRole = await prisma.role.findUnique({
        where: { id: roleId },
      })

      if (!selectedRole) {
        res.status(400).json({
          message: "Selected role does not exist"
        })
        return
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        ...(name !== undefined ? { name } : {}),
        ...(email !== undefined ? { email } : {}),
        ...(roleId !== undefined ? { roleId } : {}),
      },
      include: {
        role: true,
      },
    })

    res.status(200).json({
      message: "User updated successfully",
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        roleId: updatedUser.roleId,
        role: updatedUser.role.name,
        createdAt: updatedUser.createdAt,
      }
    })
  }
)
