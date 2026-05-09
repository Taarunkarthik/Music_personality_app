'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Sparkles, Loader2 } from 'lucide-react'
import { generateProfileAction } from '@/app/actions/profile'

export function GenerateButton() {
  const [isLoading, setIsLoading] = useState(false)

  const handleGenerate = async () => {
    setIsLoading(true)
    try {
      await generateProfileAction("medium_term")
    } catch (error) {
      console.error("Failed to generate profile:", error)
      setIsLoading(false)
    }
  }

  return (
    <Button 
      onClick={handleGenerate}
      disabled={isLoading}
      size="lg" 
      className="h-14 px-8 text-lg font-bold shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95 bg-primary text-primary-foreground"
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          Analyzing your DNA...
        </>
      ) : (
        <>
          <Sparkles className="mr-2 h-5 w-5" />
          Generate My Personality
        </>
      )}
    </Button>
  )
}
