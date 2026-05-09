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
  // During build or CI, we might not have all env vars. 
  // We only throw if we're definitely in a runtime production environment.
  const isBuild = process.env.NEXT_PHASE === 'phase-production-build' || process.env.CI
  
  if (!isBuild) {
    console.error("❌ Invalid environment variables:", parsed.error.flatten().fieldErrors)
    throw new Error("Invalid environment variables")
  }
}

export const env = (parsed.success ? parsed.data : processEnv) as z.infer<typeof envSchema>
