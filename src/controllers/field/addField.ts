// function to add new field by admin

import { Response } from "express"
import { UserRequest } from "../../utils/types"
import prisma from "../../lib/prisma"
import asyncHandler from "../../middlewares/asyncHandler"

export const addField = asyncHandler(
  async (req: UserRequest, res: Response) => {
    // 1. destructure field data from request body
    const { name, cropType, plantingDate, agentId } = req.body

    // 2. validate the field data
    if (!name || !cropType || !plantingDate || !agentId) {
      res.status(400).json({
        message: 'Please provide all the required fields'
      })
      return
    }

    // 3. check if the field exists
    const fieldExists = await prisma.field.findFirst({
      where: { name }
    })
    if (fieldExists) {
      res.status(400).json({
        message: 'Field with this name already exists'
      })
      return
    }

    // 4. create the field
    const newField = await prisma.field.create({
      data: {
        name: name,
        cropType: cropType,
        plantingDate: new Date(plantingDate),
        currentStage: 'ready',
        status:'active',
        agent:{
          connect: { id: agentId }
        }
      }
    })

    // 5. return the created field
    res.status(201).json({
      message: 'Field created successfully',
      field: newField
    })
  }
)
