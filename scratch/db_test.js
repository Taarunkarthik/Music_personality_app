const { PrismaClient } = require('../src/generated/prisma/client')
const { PrismaPg } = require('@prisma/adapter-pg')
const { Pool } = require('pg')
require('dotenv').config()

const connectionString = process.env.DATABASE_URL
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  try {
    console.log("Connecting to Supabase via Adapter...")
    await prisma.$connect()
    console.log("SUCCESS: Connected to Supabase!")
    const users = await prisma.user.count()
    console.log("Current user count:", users)
  } catch (e) {
    console.error("FAILURE: Could not connect to Supabase", e)
  } finally {
    await prisma.$disconnect()
  }
}

main()
