import { notFound } from "next/navigation"
import { ProfileReveal, ProfileData } from "@/components/profile-reveal"
import { Metadata } from "next"
import { auth } from "@/auth"

export const dynamic = 'force-dynamic'

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}): Promise<Metadata> {
  const { slug } = await params
  
  if (process.env.NEXT_PHASE === 'phase-production-build') return {}

  try {
    const { db } = await import("@/lib/db")
    const profile = await db.profile.findUnique({
      where: { shareSlug: slug },
      include: { user: true }
    })

    if (!profile) return {}

    const data = JSON.parse(profile.data) as ProfileData
    
    return {
      title: `${profile.user.name}'s Music Personality: ${data.archetype.title}`,
      description: data.archetype.tagline,
      openGraph: {
        title: `${profile.user.name} is a ${data.archetype.title}`,
        description: data.archetype.tagline,
        images: [`/api/og/${slug}`],
      },
      twitter: {
        card: "summary_large_image",
        title: `${profile.user.name} is a ${data.archetype.title}`,
        description: data.archetype.tagline,
        images: [`/api/og/${slug}`],
      },
    }
  } catch (e) {
    return {}
  }
}

export default async function PublicProfilePage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const { slug } = await params
  const session = await auth()

  if (process.env.NEXT_PHASE === 'phase-production-build') {
    return <div className="p-20 text-center text-white">Building...</div>
  }

  try {
    const { db } = await import("@/lib/db")
    
    const [profile, currentUserProfile] = await Promise.all([
      db.profile.findUnique({
        where: { shareSlug: slug },
        include: { user: true }
      }),
      session?.user?.id 
        ? db.profile.findFirst({ where: { userId: session.user.id }, orderBy: { createdAt: 'desc' } })
        : null
    ])

    if (!profile || !profile.isPublic) {
      notFound()
    }

    const data = JSON.parse(profile.data) as ProfileData

    return (
      <ProfileReveal 
        data={data} 
        userName={profile.user.name || "Music Lover"} 
        userImage={profile.user.image}
        isOwner={session?.user?.id === profile.userId}
        shareSlug={profile.shareSlug}
        currentUserProfileSlug={currentUserProfile?.shareSlug}
      />
    )
  } catch (error) {
    return <div className="p-20 text-center text-white">Error loading public profile.</div>
  }
}
