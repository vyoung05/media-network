import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const title = searchParams.get('title') || 'TrapGlow — Shining Light on What\'s Next';
  const artist = searchParams.get('artist') || '';
  const genre = searchParams.get('genre') || '';
  const score = searchParams.get('score') || '';
  const type = searchParams.get('type') || 'default'; // default | artist | blog

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#0F0B2E',
          padding: '60px',
          fontFamily: 'sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background gradient orbs */}
        <div
          style={{
            position: 'absolute',
            top: '-80px',
            right: '-80px',
            width: '400px',
            height: '400px',
            background: 'radial-gradient(circle, rgba(139, 92, 246, 0.2) 0%, transparent 70%)',
            borderRadius: '50%',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-60px',
            left: '-60px',
            width: '350px',
            height: '350px',
            background: 'radial-gradient(circle, rgba(6, 245, 214, 0.12) 0%, transparent 70%)',
            borderRadius: '50%',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '50%',
            right: '20%',
            width: '200px',
            height: '200px',
            background: 'radial-gradient(circle, rgba(255, 107, 53, 0.08) 0%, transparent 70%)',
            borderRadius: '50%',
          }}
        />

        {/* Top section */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
              <span style={{ fontSize: '38px', fontWeight: 900, color: '#F8F8FF', letterSpacing: '-1px' }}>
                TRAP
              </span>
              <span style={{ fontSize: '38px', fontWeight: 900, color: '#8B5CF6', letterSpacing: '-1px' }}>
                GLOW
              </span>
              <div
                style={{
                  width: '8px',
                  height: '8px',
                  background: '#06F5D6',
                  borderRadius: '50%',
                  marginLeft: '6px',
                }}
              />
            </div>

            {score && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'rgba(6, 245, 214, 0.15)',
                  padding: '6px 14px',
                  borderRadius: '20px',
                  border: '1px solid rgba(6, 245, 214, 0.3)',
                }}
              >
                <span style={{ fontSize: '14px', fontWeight: 800, color: '#06F5D6' }}>
                  🔥 GLOW SCORE: {score}
                </span>
              </div>
            )}
          </div>

          {/* Genre/Type tag */}
          {(genre || type === 'artist') && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  width: '4px',
                  height: '20px',
                  background: 'linear-gradient(to bottom, #8B5CF6, #06F5D6)',
                  borderRadius: '2px',
                }}
              />
              <span
                style={{
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#06F5D6',
                  letterSpacing: '3px',
                  textTransform: 'uppercase',
                }}
              >
                {type === 'artist' ? 'Artist Spotlight' : genre}
              </span>
            </div>
          )}
        </div>

        {/* Title */}
        <div style={{ display: 'flex', flex: 1, alignItems: 'center', paddingTop: '20px', paddingBottom: '20px' }}>
          <h1
            style={{
              fontSize: title.length > 80 ? '40px' : title.length > 50 ? '50px' : '58px',
              fontWeight: 900,
              color: '#F8F8FF',
              lineHeight: 1.15,
              letterSpacing: '-1px',
              maxWidth: '95%',
            }}
          >
            {title}
          </h1>
        </div>

        {/* Bottom section */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: '1px solid rgba(255,255,255,0.06)',
            paddingTop: '24px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {artist && (
              <span style={{ fontSize: '16px', color: 'rgba(248,248,255,0.5)' }}>
                Featuring <span style={{ color: '#8B5CF6', fontWeight: 700 }}>{artist}</span>
              </span>
            )}
          </div>
          <span style={{ fontSize: '14px', color: 'rgba(248,248,255,0.3)', letterSpacing: '1px' }}>
            trapglow.com
          </span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
