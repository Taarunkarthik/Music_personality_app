'use client'

import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Music2 } from "lucide-react"

export function SignInButton() {
  return (
    <Button 
      onClick={() => signIn("spotify", { redirectTo: "/dashboard" })}
      size="lg" 
      className="h-14 px-8 text-lg font-semibold shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95"
    >
      <Music2 className="mr-2 h-5 w-5" />
      Connect Spotify
    </Button>
  )
}
