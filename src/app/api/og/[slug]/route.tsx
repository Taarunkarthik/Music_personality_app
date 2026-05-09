import { ImageResponse } from 'next/og'

export const dynamic = 'force-dynamic'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  if (process.env.NEXT_PHASE === 'phase-production-build') {
    return new Response('Building...', { status: 200 })
  }

  try {
    const { slug } = await params
    // Dynamically import DB
    const { db } = await import('@/lib/db')
    
    const profile = await db.profile.findUnique({
      where: { shareSlug: slug },
      include: { user: true }
    })

    if (!profile) {
      return new Response('Not Found', { status: 444 })
    }

    const data = JSON.parse(profile.data)

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#121212',
            backgroundImage: `radial-gradient(circle at 0% 0%, #1DB95433 0%, transparent 50%), radial-gradient(circle at 100% 100%, ${data.aura || '#1DB954'}22 0%, transparent 50%)`,
            padding: '40px',
            color: 'white',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <div style={{ fontSize: 24, fontWeight: 'bold', color: '#1DB954', marginBottom: 20, textTransform: 'uppercase', letterSpacing: 4 }}>
              Music Personality
            </div>
            <div style={{ fontSize: 72, fontWeight: 'black', marginBottom: 10, lineHeight: 1.1 }}>
              {data.archetype.title}
            </div>
            <div style={{ fontSize: 32, fontStyle: 'italic', color: '#a1a1aa', maxWidth: '800px' }}>
              &quot;{data.archetype.tagline}&quot;
            </div>
          </div>

          <div style={{ display: 'flex', marginTop: 60, gap: 20 }}>
            {data.dna_traits.slice(0, 3).map((trait: { label: string; value: string }, i: number) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', backgroundColor: 'rgba(255,255,255,0.05)', padding: '20px 30px', borderRadius: 20, border: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ fontSize: 16, color: '#a1a1aa', textTransform: 'uppercase', marginBottom: 5 }}>{trait.label}</div>
                <div style={{ fontSize: 32, fontWeight: 'bold', color: '#1DB954' }}>{trait.value}%</div>
              </div>
            ))}
          </div>

          <div style={{ position: 'absolute', bottom: 40, display: 'flex', alignItems: 'center' }}>
            <div style={{ fontSize: 20, color: '#a1a1aa' }}>
              Created by <span style={{ color: 'white', fontWeight: 'bold' }}>{profile.user.name}</span>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    )
  } catch (e: any) {
    return new Response(`Failed to generate the image`, {
      status: 500,
    })
  }
}
