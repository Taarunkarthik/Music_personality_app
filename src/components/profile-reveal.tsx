import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Sparkles, Zap, Share2 } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export interface ProfileData {
  aura: string
  archetype: {
    title: string
    tagline: string
    description: string
  }
  dna_traits: {
    label: string
    value: string
    evidence: string
  }[]
  roast: string
  praise: string
}

interface ProfileRevealProps {
  data: ProfileData
  userName: string
  userImage?: string | null
  isOwner?: boolean
  currentUserProfileSlug?: string | null
  shareSlug: string
}

export function ProfileReveal({ data, userName, userImage, isOwner, currentUserProfileSlug, shareSlug }: ProfileRevealProps) {
  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      {/* Dynamic Background Aura */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div 
          className="absolute -top-[10%] -left-[10%] h-[50%] w-[50%] rounded-full opacity-20 blur-[120px]"
          style={{ backgroundColor: 'var(--primary)' }}
        />
        <div 
          className="absolute top-[60%] -right-[10%] h-[60%] w-[60%] rounded-full opacity-10 blur-[120px]"
          style={{ backgroundColor: data.aura || 'var(--primary)' }}
        />
      </div>

      <div className="mx-auto max-w-3xl px-6 pt-24">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
             <div className="h-20 w-20 rounded-full bg-primary/20 ring-1 ring-primary/40 flex items-center justify-center overflow-hidden relative">
                {userImage ? (
                  <img src={userImage} alt={userName} className="h-full w-full object-cover" />
                ) : (
                  <span className="text-2xl font-bold text-primary">{userName.charAt(0)}</span>
                )}
              </div>
          </div>
          <Badge variant="outline" className="mb-4 px-4 py-1 border-primary/30 text-primary">
            {data.aura} Energy
          </Badge>
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-7xl mb-4">
            {data.archetype.title}
          </h1>
          <p className="text-xl text-muted-foreground italic">
            &quot;{data.archetype.tagline}&quot;
          </p>
        </div>

        {/* Archetype Description Card */}
        <Card className="p-8 mb-12 bg-white/5 border-white/10 backdrop-blur-md">
          <div className="flex gap-4 items-start mb-4">
            <div className="p-3 bg-primary/20 rounded-2xl">
              <Sparkles className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">The Analysis</h3>
              <p className="text-muted-foreground leading-relaxed">
                {data.archetype.description}
              </p>
            </div>
          </div>
        </Card>

        {/* DNA Traits Section */}
        <div className="grid gap-6 mb-12">
          <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
            <Zap className="w-6 h-6 text-primary" />
            Music DNA
          </h2>
          {data.dna_traits.map((trait, i: number) => (
            <Card key={i} className="p-6 bg-white/5 border-white/10 backdrop-blur-sm">
              <div className="flex justify-between items-end mb-3">
                <span className="font-bold text-lg">{trait.label}</span>
                <span className="text-primary font-mono">{trait.value}%</span>
              </div>
              <Progress value={parseInt(trait.value)} className="h-2 mb-4" />
              <p className="text-sm text-muted-foreground">
                {trait.evidence}
              </p>
            </Card>
          ))}
        </div>

        {/* Roast & Praise Section */}
        <div className="grid sm:grid-cols-2 gap-6 mb-16">
          <Card className="p-8 border-destructive/20 bg-destructive/5">
            <h3 className="text-destructive font-bold mb-4">The Roast</h3>
            <p className="text-muted-foreground italic">&quot;{data.roast}&quot;</p>
          </Card>
          <Card className="p-8 border-primary/20 bg-primary/5">
            <h3 className="text-primary font-bold mb-4">The Praise</h3>
            <p className="text-muted-foreground italic">&quot;{data.praise}&quot;</p>
          </Card>
        </div>

        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
          {currentUserProfileSlug && !isOwner && (
            <Link href={`/compare/${currentUserProfileSlug}/${shareSlug}`}>
              <Button size="lg" className="w-full sm:w-auto h-14 px-10 gap-2 font-bold shadow-lg shadow-primary/20 bg-primary">
                <Zap className="w-5 h-5 fill-current" />
                Vibe Check With Me
              </Button>
            </Link>
          )}
          
          <Button size="lg" variant={currentUserProfileSlug && !isOwner ? "outline" : "default"} className="w-full sm:w-auto h-14 px-10 gap-2 font-bold shadow-lg">
            <Share2 className="w-5 h-5" />
            Share Profile
          </Button>
          
          {!isOwner ? (
             <Link href="/">
              <Button variant="outline" size="lg" className="w-full sm:w-auto h-14 px-10">
                Get Your Own Profile
              </Button>
            </Link>
          ) : (
            <Link href="/dashboard">
              <Button variant="outline" size="lg" className="w-full sm:w-auto h-14 px-10">
                Back to Dashboard
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
