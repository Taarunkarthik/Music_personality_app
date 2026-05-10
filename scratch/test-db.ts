import "dotenv/config";
import { db } from '../src/lib/db';

async function test() {
  try {
    console.log("Connecting to Database...");
    console.log("DATABASE_URL:", process.env.DATABASE_URL?.split('@')[1]); // Log host part for safety
    
    const userCount = await db.user.count();
    console.log("Success! Total users in DB:", userCount);
    
    const users = await db.user.findMany({ take: 1 });
    console.log("Sample user:", users);
    
  } catch (error) {
    console.error("DB Error Details:", error);
  } finally {
    await db.$disconnect();
    process.exit(0);
  }
}

test();
