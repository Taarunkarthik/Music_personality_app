import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Sparkles, Music2 } from "lucide-react"
import { ProfileData } from "@/components/profile-reveal"

export const dynamic = 'force-dynamic'

export default async function ExplorePage() {
  let profiles: (any & { user: any })[] = []
  
  if (process.env.NEXT_PHASE === 'phase-production-build') {
     return <div className="p-20 text-center">Building...</div>
  }

  try {
    const { db } = await import("@/lib/db")
    profiles = await db.profile.findMany({
      where: { isPublic: true },
      orderBy: { createdAt: 'desc' },
      include: { user: true },
      take: 20
    })
  } catch (error) {
    console.error("Explore page DB error:", error)
  }

  return (
    <div className="min-h-screen bg-background text-foreground pb-20 pt-24 px-6">
      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl mb-4">
            Explore <span className="text-primary">Archetypes</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Discover how the world is listening. From the mainstream lovers to the obscure archivists.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {profiles.map((profile) => {
            const data = JSON.parse(profile.data) as ProfileData
            return (
              <Link key={profile.id} href={`/p/${profile.shareSlug}`}>
                <Card className="group relative overflow-hidden p-6 h-full transition-all hover:scale-[1.02] hover:shadow-2xl hover:shadow-primary/10 border-white/10 bg-white/5 backdrop-blur-sm">
                  {/* Hover Aura */}
                  <div 
                    className="absolute inset-0 -z-10 opacity-0 group-hover:opacity-10 transition-opacity blur-3xl"
                    style={{ backgroundColor: data.aura || 'var(--primary)' }}
                  />
                  
                  <div className="flex items-center gap-3 mb-6">
                    <div className="h-10 w-10 rounded-full overflow-hidden ring-1 ring-white/20">
                       {profile.user.image ? (
                          <img src={profile.user.image} alt="" className="h-full w-full object-cover" />
                       ) : (
                          <div className="h-full w-full flex items-center justify-center bg-primary/20 text-xs font-bold text-primary">
                            {profile.user.name?.charAt(0)}
                          </div>
                       )}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold">{profile.user.name}</span>
                      <Badge variant="outline" className="text-[10px] h-4 px-1.5 uppercase tracking-tighter opacity-70">
                        {data.aura}
                      </Badge>
                    </div>
                  </div>

                  <h3 className="text-2xl font-black mb-2 group-hover:text-primary transition-colors">
                    {data.archetype.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 italic mb-6">
                    &quot;{data.archetype.tagline}&quot;
                  </p>

                  <div className="flex flex-wrap gap-x-4 gap-y-2 mt-auto pt-4 border-t border-white/5">
                    {data.dna_traits.slice(0, 2).map((trait, i: number) => (
                      <div key={i} className="flex items-center gap-1.5 text-xs text-primary/80">
                         <Sparkles className="w-3 h-3" />
                         {trait.label}
                      </div>
                    ))}
                  </div>
                </Card>
              </Link>
            )
          })}
        </div>

        {profiles.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center opacity-50">
            <Music2 className="w-16 h-16 mb-4" />
            <p className="text-xl">No public profiles yet. Be the first!</p>
            <Link href="/dashboard" className="mt-4 text-primary underline">Go to Dashboard</Link>
          </div>
        )}
      </div>
    </div>
  )
}
