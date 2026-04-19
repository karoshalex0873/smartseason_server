import dotenv from 'dotenv'
import { PrismaPg } from '@prisma/adapter-pg'

import { PrismaClient } from '../../generated/prisma/client'

dotenv.config()

const connectionString = process.env.DATABASE_URL

if (!connectionString) {
  throw new Error('DATABASE_URL is missing. Add it to your .env file before starting the server.')
}

const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({ adapter })

export default prisma
