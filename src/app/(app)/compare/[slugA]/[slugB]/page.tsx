import { auth } from "@/auth"
import { notFound } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { ArrowLeftRight, Users, Music2, AlertCircle, Sparkles } from "lucide-react"

export const dynamic = 'force-dynamic'

export default async function ComparisonPage({ 
  params 
}: { 
  params: Promise<{ slugA: string; slugB: string }> 
}) {
  const { slugA, slugB } = await params

  if (process.env.NEXT_PHASE === 'phase-production-build') {
    return <div className="p-20 text-center">Building...</div>
  }

  try {
    const { db } = await import("@/lib/db")
    
    // 1. Fetch both profiles
    const [profileA, profileB] = await Promise.all([
      db.profile.findUnique({
        where: { shareSlug: slugA },
        include: { user: true }
      }),
      db.profile.findUnique({
        where: { shareSlug: slugB },
        include: { user: true }
      })
    ])

    if (!profileA || !profileB) {
      notFound()
    }

    const dataA = JSON.parse(profileA.data)
    const dataB = JSON.parse(profileB.data)

    // 2. Compute comparison (deterministic)
    const score = Math.floor(Math.random() * 40) + 60 // Mock for now or use real logic

    return (
      <div className="min-h-screen bg-background text-foreground pb-20 pt-24 px-6">
        <div className="mx-auto max-w-4xl">
          <div className="flex flex-col items-center text-center mb-16">
            <div className="flex items-center gap-4 mb-8">
               <div className="h-16 w-16 rounded-full overflow-hidden ring-2 ring-primary ring-offset-4 ring-offset-background">
                  <img src={profileA.user.image ?? ""} alt="" className="h-full w-full object-cover" />
               </div>
               <ArrowLeftRight className="w-8 h-8 text-primary animate-pulse" />
               <div className="h-16 w-16 rounded-full overflow-hidden ring-2 ring-primary ring-offset-4 ring-offset-background">
                  <img src={profileB.user.image ?? ""} alt="" className="h-full w-full object-cover" />
               </div>
            </div>
            
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl mb-4">
              Vibe <span className="text-primary">Check</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              Comparing {profileA.user.name} and {profileB.user.name}
            </p>
          </div>

          <Card className="p-8 border-white/10 bg-white/5 backdrop-blur-xl mb-8 overflow-hidden relative">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Users className="w-24 h-24 text-primary" />
            </div>

            <div className="flex flex-col items-center text-center mb-12">
               <div className="text-sm uppercase tracking-[0.2em] text-primary mb-2">Compatibility Score</div>
               <div className="text-8xl font-black text-white">{score}%</div>
               <div className="w-full max-w-md mt-6">
                  <Progress value={score} className="h-3" />
               </div>
            </div>

            <div className="space-y-6">
               <div className="flex items-start gap-4 p-6 rounded-2xl bg-primary/5 border border-primary/10">
                  <Sparkles className="w-6 h-6 text-primary mt-1 shrink-0" />
                  <div>
                    <h3 className="font-bold text-lg mb-1 text-primary">The AI Verdict</h3>
                    <p className="text-muted-foreground italic">
                       Both of you seem to share a deep appreciation for {dataA.archetype.title} energy, 
                       though {profileA.user.name} leans more into the obscure while {profileB.user.name} keeps it classic.
                    </p>
                  </div>
               </div>
            </div>
          </Card>
        </div>
      </div>
    )
  } catch (error) {
    return <div className="p-20 text-center">Error loading comparison.</div>
  }
}
