

// update the stages and  update the status of the field
import { Request, Response } from 'express'
import prisma from '../../lib/prisma'
import asyncHandler from '../../middlewares/asyncHandler'
import { Stage } from '../../../generated/prisma/enums'
import { UserRequest } from '../../utils/types'
import { computeFieldStatus } from '../../services/statusCompute'

type FieldParm = {
  id: string
}

type TrackStageBody = {
  stage: Stage
  notes?: string
}

type TrackStageRequest = Request<FieldParm, {}, TrackStageBody> & UserRequest

export const trackStage = asyncHandler(
  async (req: TrackStageRequest, res: Response) => {
    // 1. get field id
    const { id } = req.params
    // 2. get stage and note from the body
    const { stage, notes } = req.body

    // 3.validate
    if (!stage) {
      res.status(400).json({
        message: 'Stage is required'
      })
      return
    }

    // 4. find the field
    const field = await prisma.field.findUnique({
      where: { id },
      include: {
        agent: {
          select: {
            name: true,
            id: true
          }
        }
      }
    })

    if (!field) {
      return res.status(404).json({
        message: 'Field not found'
      })
    }



    // 5. Check if current user can update  the field stage (only assigned agent or admin can update)
    if (field.agentId !== req.user?.id && req.user?.role.name !== 'Admin') {
      return res.status(403).json({
        message: 'You are not authorized to update the stage of this field'
      })
    }

    // 6. compute status 
    const status = computeFieldStatus({
      currentStage: stage,
      plantingDate: field.plantingDate
    })

    // 7. use a transaction to update
    const [fieldUpdate, updatedField] = await prisma.$transaction([
      prisma.fieldUpdate.create({
        data: {
          fieldId: field.id,
          agentId: field.agentId,
          stage,
          notes
        }
      }),
      prisma.field.update({
        where: { id: field.id },
        data: {
          currentStage: stage,
          status
        },
        include: {
          agent: {
            select: {
              name: true,
              email: true
            }
          },
          updates: {
            orderBy: {
              createdAt: 'desc'
            },
          }
        }
      })
    ])

    res.status(200).json({
      message: 'Field stage updated successfully',
      update: fieldUpdate,
      field: updatedField
    })
  }
)