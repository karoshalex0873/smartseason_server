// add user to the database
import { Response } from "express";
import prisma from "../../lib/prisma";
import asyncHandler from "../../middlewares/asyncHandler";
import { UserRequest } from "../../utils/types";
import *  as argon2 from "argon2";

export const addUser = asyncHandler(
  async (req: UserRequest, res: Response) => {
    // 1. get user data from request body
    const { name, email, roleId } = req.body

    // 2. validate user data
    if (!name || !email || !roleId) {
      res.status(400).json({
        message: "All fields are required"
      })
      return
    }

    // check if user with the same email already exists
    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    })
    if (existingUser) {
      res.status(409).json({
        message: "User with this email already exists"
      })
      return
    }
    // create a default password and hash it before saving to the database
    const defaultPassword = "password123"
    const hashedPassword = await argon2.hash(defaultPassword)

    const selectedRole = await prisma.role.findUnique({
      where: {
        id: roleId,
      },
    })

    if (!selectedRole) {
      res.status(400).json({
        message: "Selected role does not exist"
      })
      return
    }

    // 3. create new user in the database
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        roleId: selectedRole.id,
      },
      include: {
        role: true,
      },
    })

    res.status(201).json({
      message: "User created successfully",
      temporaryPassword: defaultPassword,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        roleId: newUser.roleId,
        role: newUser.role.name,
        createdAt: newUser.createdAt,
      }
    })
  }
)
