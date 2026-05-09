'use server'

import { auth } from "@/auth"
import { getListeningSnapshot, TimeRange } from "@/lib/snapshots"
import { computeMetrics } from "@/lib/metrics"
import { generateMusicProfile } from "@/lib/gemini"
import { db } from "@/lib/db"
import { redirect } from "next/navigation"

export async function generateProfileAction(timeRange: TimeRange = "medium_term") {
  const session = await auth()
  
  if (!session?.user?.id) {
    throw new Error("Unauthorized")
  }

  const userId = session.user.id

  // 1. Get/Create Snapshot
  const snapshot = await getListeningSnapshot(userId, timeRange)
  
  // 2. Check for existing profile linked to this snapshot
  const dbSnapshot = await db.snapshot.findFirst({
    where: { userId, timeRange },
    orderBy: { createdAt: 'desc' }
  })

  if (!dbSnapshot) throw new Error("Snapshot not found")

  const existingProfile = await db.profile.findFirst({
    where: { snapshotId: dbSnapshot.id }
  })

  if (existingProfile) {
    console.log("Profile already exists for this snapshot, redirecting...")
    redirect(`/profile/${existingProfile.shareSlug}`)
  }

  // 3. Compute Metrics
  const metrics = computeMetrics(snapshot)

  // 4. Generate AI Profile
  const profileData = await generateMusicProfile(metrics, session.user.name || "Music Lover")

  // 5. Store Profile in DB
  const profile = await db.profile.create({
    data: {
      userId,
      snapshotId: dbSnapshot.id,
      data: JSON.stringify(profileData),
      isPublic: true, // Default to public for easy sharing in MVP
    }
  })

  // 6. Redirect to the new profile page
  redirect(`/profile/${profile.shareSlug}`)
}
