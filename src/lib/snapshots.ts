import { db } from "./db"
import { spotifyFetch } from "./spotify"
import crypto from "crypto"

export type TimeRange = "short_term" | "medium_term" | "long_term"

export async function getListeningSnapshot(userId: string, timeRange: TimeRange = "medium_term") {
  // 1. Check for existing cached snapshot (TTL: 24 hours)
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)
  
  const cachedSnapshot = await db.snapshot.findFirst({
    where: {
      userId,
      timeRange,
      createdAt: { gte: oneDayAgo }
    },
    orderBy: { createdAt: 'desc' }
  })

  if (cachedSnapshot) {
    console.log(`Using cached snapshot for user ${userId} (${timeRange})`)
    return JSON.parse(cachedSnapshot.data)
  }

  // 2. Fetch fresh data from Spotify
  console.log(`Fetching fresh Spotify data for user ${userId}...`)
  
  const [artistsRes, tracksRes] = await Promise.all([
    spotifyFetch(userId, `/me/top/artists?time_range=${timeRange}&limit=50`),
    spotifyFetch(userId, `/me/top/tracks?time_range=${timeRange}&limit=50`)
  ])

  if (!artistsRes.ok || !tracksRes.ok) {
    throw new Error("Failed to fetch data from Spotify")
  }

  const artistsData = await artistsRes.json()
  const tracksData = await tracksRes.json()

  // 3. Normalize the data
  const normalizedData = {
    artists: artistsData.items.map((a: { id: string; name: string; genres: string[]; popularity: number; images: { url: string }[] }) => ({
      id: a.id,
      name: a.name,
      genres: a.genres,
      popularity: a.popularity,
      image: a.images[0]?.url
    })),
    tracks: tracksData.items.map((t: { id: string; name: string; artists: { name: string }[]; album: { name: string; release_date: string }; popularity: number; duration_ms: number; preview_url: string | null }) => ({
      id: t.id,
      name: t.name,
      artists: t.artists.map((a) => a.name),
      album: t.album.name,
      release_date: t.album.release_date,
      popularity: t.popularity,
      duration_ms: t.duration_ms,
      preview_url: t.preview_url
    }))
  }

  const dataString = JSON.stringify(normalizedData)
  const snapshotHash = crypto.createHash('md5').update(dataString).digest('hex')

  // 4. Store in DB
  await db.snapshot.create({
    data: {
      userId,
      timeRange,
      snapshotHash,
      data: dataString
    }
  })

  return normalizedData
}
