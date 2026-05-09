export interface SpotifyArtist {
  id: string
  name: string
  genres: string[]
  popularity: number
  image?: string
}

export interface SpotifyTrack {
  id: string
  name: string
  artists: string[]
  album: string
  release_date: string
  popularity: number
  duration_ms: number
  preview_url: string | null
}

export interface SnapshotData {
  artists: SpotifyArtist[]
  tracks: SpotifyTrack[]
}

export interface ComputedMetrics {
  mainstreamScore: number // 0-100
  genreDiversity: number // 0-100
  topGenres: { name: string; count: number }[]
  eraBias: { [decade: string]: number }
  nicheArtists: string[]
}

export function computeMetrics(snapshot: SnapshotData): ComputedMetrics {
  const { artists, tracks } = snapshot

  // 1. Calculate Mainstream Score (Average Popularity)
  const totalPopularity = artists.reduce((sum, a) => sum + (a.popularity || 0), 0)
  const mainstreamScore = Math.round(totalPopularity / (artists.length || 1))

  // 2. Genre Distribution & Top Genres
  const genreCounts: { [key: string]: number } = {}
  artists.forEach(artist => {
    artist.genres?.forEach((genre: string) => {
      genreCounts[genre] = (genreCounts[genre] || 0) + 1
    })
  })

  const topGenres = Object.entries(genreCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)

  // 3. Genre Diversity (Simplified Entropy)
  const uniqueGenres = Object.keys(genreCounts).length
  const genreDiversity = Math.min(Math.round((uniqueGenres / 30) * 100), 100)

  // 4. Era Bias (Release Decades)
  const eraCounts: { [key: string]: number } = {}
  tracks.forEach(track => {
    if (track.release_date) {
      const year = parseInt(track.release_date.split('-')[0])
      const decade = Math.floor(year / 10) * 10 + 's'
      eraCounts[decade] = (eraCounts[decade] || 0) + 1
    }
  })

  // 5. Niche Artists (Popularity < 30)
  const nicheArtists = artists
    .filter(a => a.popularity < 30)
    .map(a => a.name)
    .slice(0, 5)

  return {
    mainstreamScore,
    genreDiversity,
    topGenres,
    eraBias: eraCounts,
    nicheArtists
  }
}
