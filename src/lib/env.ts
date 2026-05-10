import { z } from "zod"

const envSchema = z.object({
  SPOTIFY_CLIENT_ID: z.string().min(1),
  SPOTIFY_CLIENT_SECRET: z.string().min(1),
  SPOTIFY_REDIRECT_URI: z.string().url(),
  GEMINI_API_KEY: z.string().min(1),
  AUTH_SECRET: z.string().min(1),
  DATABASE_URL: z.string().min(1),
})

const processEnv = {
  SPOTIFY_CLIENT_ID: process.env.SPOTIFY_CLIENT_ID,
  SPOTIFY_CLIENT_SECRET: process.env.SPOTIFY_CLIENT_SECRET,
  SPOTIFY_REDIRECT_URI: process.env.SPOTIFY_REDIRECT_URI,
  GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  AUTH_SECRET: process.env.AUTH_SECRET,
  DATABASE_URL: process.env.DATABASE_URL,
}

const parsed = envSchema.safeParse(processEnv)

if (!parsed.success) {
  const isBuild = process.env.NEXT_PHASE === 'phase-production-build' || process.env.CI === 'true'
  
  if (isBuild) {
    console.warn("⚠️ Some environment variables are missing during build. This is expected if they are not needed for static generation.")
  } else {
    console.error("❌ Invalid environment variables:", JSON.stringify(parsed.error.flatten().fieldErrors, null, 2))
    
    // In production, we must have all environment variables
    if (process.env.NODE_ENV === 'production') {
      throw new Error(`Invalid environment variables: ${Object.keys(parsed.error.flatten().fieldErrors).join(", ")}`)
    }
  }
}

export const env = (parsed.success ? parsed.data : processEnv) as z.infer<typeof envSchema>
