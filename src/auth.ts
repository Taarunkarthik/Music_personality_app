import NextAuth from "next-auth"
import Spotify from "next-auth/providers/spotify"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { db } from "@/lib/db"
import { env } from "@/lib/env"

console.log("Auth debug: Spotify client present:", !!env.SPOTIFY_CLIENT_ID)
console.log("Auth debug: AUTH_URL is:", process.env.AUTH_URL)

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db),
  secret: process.env.AUTH_SECRET,
  trustHost: true,
  basePath: "/api/auth",
  providers: [
    Spotify({
      clientId: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    }),
  ],
  debug: true,
  callbacks: {
    async session({ session, user }) {
      if (session.user && user) {
        session.user.id = user.id
      }
      return session
    },
  },
  // Use default Auth.js sign-in handling so provider-specific signins work
})
