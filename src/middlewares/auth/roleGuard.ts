import { Request, Response, NextFunction } from "express"
import { UserRequest } from "../../utils/types"
import asyncHandler from "../asyncHandler"

const roleGuard = (allowedRoles: string[]) => {
  return asyncHandler<void, UserRequest>(
    async (req: UserRequest, res: Response, next: NextFunction) => {
      if (!req.user || !allowedRoles.includes(req.user.role.name)) {
        res.status(403).json({ message: "Forbidden" })
        return
      }

      console.log(`User role: ${req.user.role.name}, Allowed roles: ${allowedRoles.join(", ")}`)

      next()
    }
  )
}

const admin = roleGuard(['Admin'])
const agent = roleGuard(['Agent'])
const adminOrAgent = roleGuard(['Admin', 'Agent'])

export { admin, agent, adminOrAgent }