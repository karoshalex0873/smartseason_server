// sing up controller

import { Request, Response } from "express"
import prisma from "../../lib/prisma"
import * as argon2 from "argon2"

export const signUp = async (req: Request, res: Response) => {
  // 1. Get the user data from the request body
  const { name, email, password, roleId } = req.body

  // 2. Validate the user data
  if (!name || !email || !password || !roleId) {
    return res.status(400).json({
      message: 'Please provide all the required fields, including roleId'
    })
  }

  // 3. Hash the password
  const hashedPassword = await argon2.hash(password)

  // 4. Check if the user already exists
  const userExists = await prisma.user.findUnique({
    where: { email: email }
  })

  if (userExists) {
    return res.status(400).json({
      message: 'User already exists'
    })
  }

  // 5. Make sure the selected role exists
  const selectedRole = await prisma.role.findUnique({
    where: { id: roleId }
  })

  if (!selectedRole) {
    return res.status(400).json({
      message: 'Selected role does not exist'
    })
  }

  // 6. Create the user with the selected role
  const newUser = await prisma.user.create({
    data: {
      name: name,
      email: email,
      password: hashedPassword,
      roleId: selectedRole.id
    },
    include: {
      role: true
    }
  })

  // 7. Return the created user
  return res.status(201).json({
    message: 'User created successfully',
    user: {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role.name
    }
  })
}
