import { Request, Response, NextFunction } from "express"
import { UserRequest } from "../../utils/types"
import asynHandler from "../asyncHandler"





const roleGuard = (allowedRoles: string[]) => {
  asynHandler<void, UserRequest>(
    async (req: UserRequest, res: Response, next: NextFunction) => {
      if (!req.user || !allowedRoles.includes(req.user.role.name)) {
        console.log(req.user?.role.name)
        return
      }

      next()
    }
  )
}

const adminGuard = roleGuard(['Admin'])
const agentGuard = roleGuard(['Agent'])
const adminOrAgentGuard = roleGuard(['Admin', 'Agent'])

export { adminGuard, agentGuard, adminOrAgentGuard }