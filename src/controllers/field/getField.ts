// get filed by Id or all

import { Request, Response } from 'express'
import prisma from '../../lib/prisma'
import asyncHandler from '../../middlewares/asyncHandler'
import { UserRequest } from '../../utils/types'


type FieldParams = {
  id: string
}

type GetFieldRequest = Request<FieldParams> & UserRequest

// get all fields
export const getFields = asyncHandler(
  async (req: UserRequest, res: Response) => {
    
    if (!req.user) {
      res.status(401).json({
        message: 'Not authorized'
      })
      return
    }

    // 1. check if the user is an agent, if yes return only his fields
    const isAgent = req.user.role.name === 'Agent'
    // admin can see all fields, agent can see only his fields
    const isAdmin = req.user.role.name === 'Admin'

    if (!isAdmin && !isAgent) {
      res.status(403).json({
        message: 'Access denied'
      })
      return
    }

    // 2. get the fields from the database
    if (isAdmin) {
      const fields = await prisma.field.findMany({
        include: {
          agent: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          updates: {
            orderBy: {
              createdAt: 'desc'
            },
            include: {
              agent: {
                select: {
                  id: true,
                  name: true,
                  email: true
                }
              }
            }
          }
        }
      })

      return res.status(200).json({
        message: 'Fields retrieved successfully',
        fields
      })
    }

    if (isAgent) {
      const fields = await prisma.field.findMany({
        where: { agentId: req.user.id },
        include: {
          agent: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          updates: {
            orderBy: {
              createdAt: 'desc'
            },
            include: {
              agent: {
                select: {
                  id: true,
                  name: true,
                  email: true
                }
              }
            }
          }
        }
      })

      return res.status(200).json({
        message: 'Fields retrieved successfully',
        fields
      })
    }

    return res.status(403).json({
      message: 'Access denied'
    })
  }
)


// get field by id
export const getFieldById = asyncHandler(
  async (req: GetFieldRequest, res: Response) => {
    // 1. get the field id from the request params
    const { id } = req.params

    if (!req.user) {
      res.status(401).json({
        message: 'Not authorized'
      })
      return
    }

    const isAdmin = req.user.role.name === 'Admin'
    const isAgent = req.user.role.name === 'Agent'

    if (!isAdmin && !isAgent) {
      res.status(403).json({
        message: 'Access denied'
      })
      return
    }

    // 2. Validate the field id
    if (!id) {
      res.status(400).json({
        message: 'Please provide the field id'
      })
      return
    }

    // 2. get the field from the database
    if (isAdmin) {
      const field = await prisma.field.findUnique({
        where: { id },
        include: {
          agent: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          updates: {
            orderBy: {
              createdAt: 'desc'
            },
            include: {
              agent: {
                select: {
                  id: true,
                  name: true,
                  email: true
                }
              }
            }
          }
        }
      })

      if (!field) {
        res.status(404).json({
          message: 'Field not found'
        })
        return
      }

      return res.status(200).json({
        message: 'Field retrieved successfully',
        field
      })
    }

    if (isAgent) {
      const field = await prisma.field.findFirst({
        where: { id, agentId: req.user.id },
        include: {
          agent: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          updates: {
            orderBy: {
              createdAt: 'desc'
            },
            include: {
              agent: {
                select: {
                  id: true,
                  name: true,
                  email: true
                }
              }
            }
          }
        }
      })

      if (!field) {
        res.status(404).json({
          message: 'Field not found'
        })
        return
      }

      return res.status(200).json({
        message: 'Field retrieved successfully',
        field
      })

    }

    return res.status(403).json({
      message: 'Access denied'
    })
  })
