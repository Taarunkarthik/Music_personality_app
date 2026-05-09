import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { GenerateButton } from "@/components/generate-button"

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  // Safety check: Skip everything during build to prevent DB connection errors
  if (process.env.NEXT_PHASE === 'phase-production-build') {
    return <div className="p-20 text-center text-white">Building...</div>
  }

  // Only import auth and actions at runtime
  const { auth, signOut } = await import("@/auth")
  const { deleteUserDataAction } = await import("@/app/actions/user")

  const session = await auth()
  
  if (!session) {
    redirect("/login")
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background px-6 text-foreground">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -bottom-[10%] -right-[10%] h-[40%] w-[40%] rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute -top-[10%] -left-[10%] h-[30%] w-[30%] rounded-full bg-primary/5 blur-[120px]" />
      </div>

      <div className="z-10 flex flex-col items-center text-center">
        <div className="mb-6 h-24 w-24 rounded-full bg-primary/20 ring-1 ring-primary/40 flex items-center justify-center overflow-hidden">
          {session.user?.image ? (
            <img src={session.user.image} alt={session.user.name ?? ""} className="h-full w-full object-cover" />
          ) : (
            <span className="text-3xl font-bold text-primary">{session.user?.name?.charAt(0)}</span>
          )}
        </div>
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl text-white">Hey, {session.user?.name?.split(' ')[0]}</h1>
        <p className="mt-4 max-w-sm text-muted-foreground sm:text-lg">
          Your Spotify is connected. Ready to see the archetype behind your listening habits?
        </p>
        
        <div className="mt-12 flex flex-col gap-4">
          <GenerateButton />
          
          <div className="flex gap-4 justify-center">
            <form action={async () => {
              "use server"
              const { signOut } = await import("@/auth")
              await signOut({ redirectTo: "/" })
            }}>
              <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
                Sign Out
              </Button>
            </form>

            <form action={deleteUserDataAction} onSubmit={(e) => {
               if(!confirm("Are you sure? This will permanently delete your profiles.")) e.preventDefault();
            }}>
              <Button variant="ghost" className="text-muted-foreground hover:text-destructive transition-colors flex items-center gap-2">
                <Trash2 className="w-4 h-4" />
                Delete My Data
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
