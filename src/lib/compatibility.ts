import { SnapshotData } from "./metrics"

export interface CompatibilityResult {
  score: number // 0-100
  commonArtists: string[]
  commonGenres: string[]
  differenceFactor: "high" | "medium" | "low"
  matchAnalysis: string
}

export function computeCompatibility(
  dataA: SnapshotData,
  dataB: SnapshotData
): CompatibilityResult {
  // 1. Shared Artists
  const setA = new Set(dataA.artists.map(a => a.id))
  const commonArtists = dataB.artists
    .filter(a => setA.has(a.id))
    .map(a => a.name)

  // 2. Shared Genres
  const genresA = new Set(dataA.artists.flatMap(a => a.genres || []))
  const genresB = new Set(dataB.artists.flatMap(a => a.genres || []))
  const commonGenres = Array.from(genresA).filter(g => genresB.has(g))

  // 3. Mainstream Score Gap
  const avgPopA = dataA.artists.reduce((s, a) => s + a.popularity, 0) / (dataA.artists.length || 1)
  const avgPopB = dataB.artists.reduce((s, a) => s + a.popularity, 0) / (dataB.artists.length || 1)
  const mainstreamGap = Math.abs(avgPopA - avgPopB)

  // 4. Calculate Score
  // Artist match is worth 50%, Genre match 30%, Popularity similarity 20%
  const artistScore = Math.min((commonArtists.length / 10) * 50, 50)
  const genreScore = Math.min((commonGenres.length / 15) * 30, 30)
  const popularityScore = Math.max(20 - (mainstreamGap / 5), 0)

  const rawScore = Math.round(artistScore + genreScore + popularityScore)
  const score = Math.max(10, Math.min(rawScore + 30, 100)) // Floor at 10, offset by 30 for "vibe"

  let differenceFactor: "high" | "medium" | "low" = "medium"
  if (score > 80) differenceFactor = "low"
  if (score < 40) differenceFactor = "high"

  return {
    score,
    commonArtists: commonArtists.slice(0, 5),
    commonGenres: commonGenres.slice(0, 5),
    differenceFactor,
    matchAnalysis: "" // Will be filled by Gemini in next step
  }
}
