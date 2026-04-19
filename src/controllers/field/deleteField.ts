import { Request, Response } from 'express'
import asynHandler from '../../middlewares/asyncHandler'
import { UserRequest } from '../../utils/types'
import prisma from '../../lib/prisma'


type FieldParams = {
  id: string
}

type DeleteFieldRequest = Request<FieldParams> & UserRequest


export const deleteField = asynHandler(
  async (req: DeleteFieldRequest, res: Response) => {

    const { id } = req.params

    if (!req.user) {
      res.status(401).json({
        message: 'Not authorized'
      })
      return
    }

    if (req.user.role.name !== 'Admin') {
      res.status(403).json({
        message: 'Access denied. Admin only.'
      })
      return
    }

    if (!id) {
      res.status(400).json({
        message: 'Please provide the field id'
      })
      return
    }

    const field = await prisma.field.findUnique({
      where: { id}
    })

    if (!field) {
      res.status(404).json({
        message: 'Field not found'
      })
      return
    }

    await prisma.fieldUpdate.deleteMany({
      where: { fieldId: id }
    })

    await prisma.field.delete({
      where: { id }
    })

    res.status(200).json({
      message: 'Field deleted successfully'
    })
  }
)