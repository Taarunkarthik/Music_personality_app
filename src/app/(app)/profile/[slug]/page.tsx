import { auth } from "@/auth"
import { notFound, redirect } from "next/navigation"
import { ProfileReveal, ProfileData } from "@/components/profile-reveal"

export const dynamic = 'force-dynamic'

export default async function ProfilePage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const { slug } = await params
  const session = await auth()

  if (process.env.NEXT_PHASE === 'phase-production-build') {
    return <div className="p-20 text-center">Building...</div>
  }

  try {
    const { db } = await import("@/lib/db")
    
    const profile = await db.profile.findUnique({
      where: { shareSlug: slug },
      include: { user: true }
    })

    if (!profile) {
      notFound()
    }

    // Only owner can see the private profile route
    if (session?.user?.id !== profile.userId) {
      redirect(`/p/${slug}`)
    }

    const data = JSON.parse(profile.data) as ProfileData

    return (
      <ProfileReveal 
        data={data} 
        userName={profile.user.name || "Music Lover"} 
        userImage={profile.user.image}
        isOwner={true}
        shareSlug={profile.shareSlug}
      />
    )
  } catch (error) {
    return <div className="p-20 text-center">Error loading profile.</div>
  }
}
