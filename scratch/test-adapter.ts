import { config } from 'dotenv';
config();

import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const connectionString = process.env.DATABASE_URL;
const isLocalhost = connectionString?.includes('localhost') || connectionString?.includes('127.0.0.1');

const pool = new Pool({ 
  connectionString,
  ssl: isLocalhost ? false : { rejectUnauthorized: false }
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function test() {
  try {
    console.log("Connecting to DB:", connectionString);
    const users = await prisma.user.findMany({ take: 1 });
    console.log("Success:", users);
  } catch (error) {
    console.error("DB Error:", error);
  } finally {
    await prisma.$disconnect();
    process.exit(0);
  }
}

test();
