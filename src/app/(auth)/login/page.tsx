import { SignInButton } from "@/components/sign-in-button"

export default function LoginPage() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background px-6 text-foreground">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-[20%] -left-[10%] h-[40%] w-[40%] rounded-full bg-primary/10 blur-[120px]" />
      </div>

      <div className="z-10 flex flex-col items-center text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">Connect Your Sound</h1>
        <p className="mt-4 max-w-sm text-muted-foreground sm:text-lg">
          We need your permission to analyze your listening history and generate your personality.
        </p>
        <div className="mt-10">
          <SignInButton />
        </div>
      </div>
    </div>
  )
}
