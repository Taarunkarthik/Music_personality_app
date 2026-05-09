import { db } from "./db"

export async function getSpotifyAccessToken(userId: string) {
  const account = await db.account.findFirst({
    where: { userId, provider: "spotify" },
  })

  if (!account) return null

  // Check if token is expired (or expires soon - 5 mins buffer)
  if (account.expires_at && Date.now() / 1000 < account.expires_at - 300) {
    return account.access_token
  }

  // Token expired, refresh it
  if (!account.refresh_token) return null

  try {
    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(
          `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
        ).toString("base64")}`,
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: account.refresh_token,
      }),
    })

    const data = await response.json()

    if (!response.ok) throw data

    const updatedAccount = await db.account.update({
      where: { id: account.id },
      data: {
        access_token: data.access_token,
        expires_at: Math.floor(Date.now() / 1000) + data.expires_in,
        refresh_token: data.refresh_token ?? account.refresh_token,
      },
    })

    return updatedAccount.access_token
  } catch (error) {
    console.error("Error refreshing Spotify token:", error)
    return null
  }
}

export async function spotifyFetch(userId: string, endpoint: string, options: RequestInit = {}) {
  const accessToken = await getSpotifyAccessToken(userId)
  
  if (!accessToken) {
    throw new Error("No Spotify access token available")
  }

  const response = await fetch(`https://api.spotify.com/v1${endpoint}`, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${accessToken}`,
    },
  })

  if (response.status === 429) {
    const retryAfter = response.headers.get("Retry-After")
    console.warn(`Spotify API rate limited. Retry after ${retryAfter}s`)
  }

  return response
}
