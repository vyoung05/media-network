import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const title = searchParams.get('title') || 'TrapFrequency — Tune Into The Craft';
  const category = searchParams.get('category') || '';
  const author = searchParams.get('author') || '';
  const image = searchParams.get('image') || '';
  const type = searchParams.get('type') || 'article'; // article, beat, gear, producer

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#0D0D0D',
          padding: '60px',
          fontFamily: 'sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Cover image background */}
        {image && (
          <img
            src={image}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        )}
        {/* Dark overlay */}
        {image && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'linear-gradient(180deg, rgba(13,13,13,0.7) 0%, rgba(13,13,13,0.92) 100%)',
            }}
          />
        )}

        {/* Grid background */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'linear-gradient(rgba(57, 255, 20, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(57, 255, 20, 0.03) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        {/* Green glow accent */}
        <div
          style={{
            position: 'absolute',
            top: '-100px',
            right: '-100px',
            width: '400px',
            height: '400px',
            background: 'radial-gradient(circle, rgba(57, 255, 20, 0.12) 0%, transparent 70%)',
            borderRadius: '50%',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-50px',
            left: '-50px',
            width: '300px',
            height: '300px',
            background: 'radial-gradient(circle, rgba(67, 97, 238, 0.08) 0%, transparent 70%)',
            borderRadius: '50%',
          }}
        />

        {/* Top section */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative' }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'baseline' }}>
              <span style={{ fontSize: '38px', fontWeight: 900, color: '#FFFFFF', letterSpacing: '2px' }}>
                TRAP
              </span>
              <span style={{ fontSize: '38px', fontWeight: 900, color: '#39FF14', letterSpacing: '2px' }}>
                FREQUENCY
              </span>
            </div>

            {type === 'beat' && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'rgba(57, 255, 20, 0.1)',
                  border: '1px solid rgba(57, 255, 20, 0.3)',
                  padding: '6px 16px',
                  borderRadius: '8px',
                }}
              >
                <span style={{ fontSize: '14px', fontWeight: 800, color: '#39FF14', letterSpacing: '2px' }}>
                  🎵 BEAT
                </span>
              </div>
            )}
          </div>

          {/* Category */}
          {category && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '4px', height: '20px', background: '#39FF14', borderRadius: '2px' }} />
              <span style={{ fontSize: '16px', fontWeight: 600, color: '#FFB800', letterSpacing: '3px', textTransform: 'uppercase' }}>
                {category}
              </span>
            </div>
          )}
        </div>

        {/* Title */}
        <div style={{ display: 'flex', flex: 1, alignItems: 'center', paddingTop: '20px', paddingBottom: '20px', position: 'relative' }}>
          <h1
            style={{
              fontSize: title.length > 80 ? '42px' : title.length > 50 ? '52px' : '60px',
              fontWeight: 900,
              color: '#FFFFFF',
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
            borderTop: '1px solid rgba(57, 255, 20, 0.15)',
            paddingTop: '24px',
            position: 'relative',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {author && (
              <span style={{ fontSize: '16px', color: '#E0E0E0' }}>
                By <span style={{ color: '#39FF14' }}>{author}</span>
              </span>
            )}
          </div>
          <span style={{ fontSize: '14px', color: '#E0E0E0', fontFamily: 'monospace', letterSpacing: '1px', opacity: 0.5 }}>
            trapfrequency.com
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
