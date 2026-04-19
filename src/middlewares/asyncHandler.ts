// asyncHandler to handle async errors in Express routes

import { Request, Response, NextFunction } from "express"

const asynHandler = <T = any, R extends Request = Request>(fn: (req: R, res: Response, next: NextFunction) => Promise<T>) => {
  return (req: R, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
}
export default asynHandler;