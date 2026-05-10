import { auth, signOut } from "@/auth"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { GenerateButton } from "@/components/generate-button"
import Image from "next/image"
import { deleteUserDataAction } from "@/app/actions/user"

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  try {
    const session = await auth()
    
    if (!session) {
      redirect("/login")
    }

    const handleSignOut = async () => {
      "use server"
      await signOut({ redirectTo: "/" })
    }

    return (
      <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background px-6 text-foreground">
        {/* ... existing content ... */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -bottom-[10%] -right-[10%] h-[40%] w-[40%] rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute -top-[10%] -left-[10%] h-[30%] w-[30%] rounded-full bg-primary/5 blur-[120px]" />
      </div>

      <div className="z-10 flex flex-col items-center text-center">
        <div className="mb-6 h-24 w-24 rounded-full bg-primary/20 ring-1 ring-primary/40 flex items-center justify-center overflow-hidden relative">
          {session.user?.image ? (
            <Image src={session.user.image} alt={session.user.name ?? ""} width={96} height={96} className="h-full w-full object-cover" />
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
            <form action={handleSignOut}>
              <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
                Sign Out
              </Button>
            </form>

            <form action={deleteUserDataAction}>
              <Button 
                variant="ghost" 
                className="text-muted-foreground hover:text-destructive transition-colors flex items-center gap-2"
                // Confirm dialog should be handled by a client component or a button with onClick if we want it to work before submission
              >
                <Trash2 className="w-4 h-4" />
                Delete My Data
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
    )
  } catch (error: any) {
    console.error("Dashboard Render Error:", error)
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background p-6 text-center">
        <h2 className="text-2xl font-bold text-white mb-4">Something went wrong</h2>
        <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg max-w-2xl overflow-auto">
          <code className="text-destructive text-sm font-mono whitespace-pre-wrap text-left block">
            {error.message || "Unknown error"}
          </code>
        </div>
        <p className="mt-4 text-muted-foreground">Check your environment variables and database connection.</p>
      </div>
    )
  }
}
