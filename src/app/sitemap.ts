import { MetadataRoute } from 'next'

export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

  // Safety check: skip DB queries during the build phase to prevent connection errors
  if (process.env.NEXT_PHASE === 'phase-production-build') {
    return [{ url: baseUrl, lastModified: new Date() }]
  }

  try {
    // Dynamically import DB to prevent top-level initialization during build
    const { db } = await import("@/lib/db")
    
    const profiles = await db.profile.findMany({
      where: { isPublic: true },
      select: { shareSlug: true, createdAt: true },
      take: 100
    })

    const profileUrls = profiles.map((p) => ({
      url: `${baseUrl}/p/${p.shareSlug}`,
      lastModified: p.createdAt,
      changeFrequency: 'weekly' as const,
      priority: 0.5,
    }))

    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1,
      },
      ...profileUrls,
    ]
  } catch (error) {
    console.error("Sitemap generation skipped:", error)
    return [{ url: baseUrl, lastModified: new Date() }]
  }
}
