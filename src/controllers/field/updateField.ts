import { Request, Response } from 'express'
import prisma from '../../lib/prisma'
import { UserRequest } from '../../utils/types'
import asyncHandler from '../../middlewares/asyncHandler'

type FieldParams = {
  id: string
}

type UpdateFieldBody = {
  name?: string
  cropType?: string
  plantingDate?: string
  agentId?: string
}

type UpdateFieldRequest = Request<FieldParams, {}, UpdateFieldBody> & UserRequest

export const updateField = asyncHandler(
  async (req: UpdateFieldRequest, res: Response) => {
    // 1. destructure body and get param from request
    const { id } = req.params
    const { name, cropType, plantingDate, agentId } = req.body

    if (!req.user) {
      res.status(401).json({
        message: 'Not authorized'
      })
      return
    }

    // 2. Check if the field exists
    const existingField = await prisma.field.findUnique({
      where: { id },
      include: {
        agent: {
          include: { role: true }
        }
      }
    })

    if (!existingField) {
      res.status(404).json({
        message: 'Field not found'
      })
      return
    }

    const isAdmin = req.user.role.name === 'Admin'
    const isAssignedAgent = req.user.role.name === 'Agent' && existingField.agentId === req.user.id

    if (!isAdmin && !isAssignedAgent) {
      res.status(403).json({
        message: 'You are not authorized to update this field'
      })
      return
    }

    if (!isAdmin && agentId !== undefined) {
      res.status(403).json({
        message: 'Only admins can reassign fields'
      })
      return
    }

    // 3. If agentId is provided, check the he is a field agent
    if (agentId !== undefined && agentId !== '') {
      const assignedAgent = await prisma.user.findUnique({
        where: { id: agentId },
        include: { role: true }
      })

      if (!assignedAgent) {
        res.status(404).json({
          message: 'Assigned agent not found'
        })
        return
      }

      if (assignedAgent.role.name !== 'Agent') {
        res.status(400).json({
          message: 'Selected user is not a field agent'
        })
        return
      }
    }
    // 4. update the field
    const updatedField = await prisma.field.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(cropType && { cropType }),
        ...(plantingDate && { plantingDate: new Date(plantingDate) }),
        ...(agentId !== undefined
          ? { agentId: agentId === '' ? null : agentId }
          : {})
      },
      include: {
        agent: {
          select: {
            id: true,
            name: true,
            email: true,
            role: {
              select: {
                name: true
              }
            }
          }
        },
        updates: true
      }
    })

    res.status(200).json({
      message: 'Field updated successfully',
      field: updatedField
    })
  }
)
