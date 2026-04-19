import { Request } from "express"

// User type 

export interface User {
  id: string
  email: string
  name: string | null
  password: string
  createdAt: Date
  role: {
    id: string
    name: string
    createdAt: Date
  }
}

export interface UserRequest extends Request {
  user?: User
}
