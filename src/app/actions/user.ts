'use server'

import { auth } from "@/auth"
import { db } from "@/lib/db"
import { redirect } from "next/navigation"

export async function deleteUserDataAction() {
  const session = await auth()
  
  if (!session?.user?.id) {
    throw new Error("Unauthorized")
  }

  const userId = session.user.id

  // 1. Delete all associated data
  // Due to Cascade deletes in Prisma, deleting the user or just their snapshots/profiles
  await db.$transaction([
    db.profile.deleteMany({ where: { userId } }),
    db.snapshot.deleteMany({ where: { userId } }),
    // We keep the User record for Auth.js session stability, 
    // but clear their personal music data.
  ])

  // 2. Redirect back to landing
  redirect("/")
}
