import { describe, it, expect } from 'vitest'
import { computeMetrics, SnapshotData } from './metrics'

describe('computeMetrics', () => {
  const mockSnapshot: SnapshotData = {
    artists: [
      { id: '1', name: 'Niche Band', genres: ['indie'], popularity: 20 },
      { id: '2', name: 'Pop Star', genres: ['pop'], popularity: 90 },
    ],
    tracks: [
      { id: 't1', name: 'Song 1', artists: ['Pop Star'], album: 'Album', release_date: '2023-01-01', popularity: 80, duration_ms: 200000, preview_url: null },
      { id: 't2', name: 'Song 2', artists: ['Niche Band'], album: 'Album 2', release_date: '1975-01-01', popularity: 10, duration_ms: 300000, preview_url: null },
    ]
  }

  it('calculates the correct mainstream score', () => {
    const metrics = computeMetrics(mockSnapshot)
    expect(metrics.mainstreamScore).toBe(55) // (20 + 90) / 2
  })

  it('identifies niche artists', () => {
    const metrics = computeMetrics(mockSnapshot)
    expect(metrics.nicheArtists).toContain('Niche Band')
    expect(metrics.nicheArtists).not.toContain('Pop Star')
  })

  it('detects era bias correctly', () => {
    const metrics = computeMetrics(mockSnapshot)
    expect(metrics.eraBias['2020s']).toBe(1)
    expect(metrics.eraBias['1970s']).toBe(1)
  })
})
