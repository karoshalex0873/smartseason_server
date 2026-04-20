import dotenv from 'dotenv'
import { PrismaPg } from '@prisma/adapter-pg'
import type { PoolConfig } from 'pg'

import { PrismaClient } from '../../generated/prisma/client'

dotenv.config()

const connectionString = process.env.DATABASE_URL

if (!connectionString) {
  throw new Error('DATABASE_URL is missing. Add it to your .env file before starting the server.')
}

const databaseUrl = new URL(connectionString)
const isLocalDatabase = ['localhost', '127.0.0.1'].includes(databaseUrl.hostname)

const poolConfig: PoolConfig = {
  connectionString,
}

if (!isLocalDatabase) {
  poolConfig.ssl = { rejectUnauthorized: false }
}

const adapter = new PrismaPg(poolConfig)
const prisma = new PrismaClient({ adapter })

export default prisma
