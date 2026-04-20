import { Response } from "express";
import prisma from "../../lib/prisma";
import asyncHandler from "../../middlewares/asyncHandler";
import { UserRequest } from "../../utils/types";

export const getUsers = asyncHandler(
  async (req: UserRequest, res: Response) => {
    if (!req.user) {
      res.status(401).json({
        message: "Not authorized"
      })
      return
    }

    const [users, roles] = await Promise.all([
      prisma.user.findMany({
        include: {
          role: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      }),
      prisma.role.findMany({
        orderBy: {
          name: "asc",
        },
      }),
    ])

    res.status(200).json({
      message: "Users retrieved successfully",
      users: users.map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        roleId: user.roleId,
        role: user.role.name,
        createdAt: user.createdAt,
      })),
      roles: roles.map((role) => ({
        id: role.id,
        name: role.name,
      })),
    })
  }
)
