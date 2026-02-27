import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const title = searchParams.get('title') || 'SauceWire — Culture. Connected. Now.';
  const category = searchParams.get('category') || '';
  const author = searchParams.get('author') || '';
  const date = searchParams.get('date') || '';
  const isBreaking = searchParams.get('breaking') === 'true';

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#111111',
          padding: '60px',
          fontFamily: 'sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background gradient accent */}
        <div
          style={{
            position: 'absolute',
            top: '-100px',
            right: '-100px',
            width: '400px',
            height: '400px',
            background: 'radial-gradient(circle, rgba(230, 57, 70, 0.15) 0%, transparent 70%)',
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
            background: 'radial-gradient(circle, rgba(29, 161, 242, 0.1) 0%, transparent 70%)',
            borderRadius: '50%',
          }}
        />

        {/* Top section */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Logo + Category */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'baseline' }}>
              <span style={{ fontSize: '42px', fontWeight: 900, color: '#FFFFFF', letterSpacing: '-1px' }}>
                SAUCE
              </span>
              <span style={{ fontSize: '42px', fontWeight: 900, color: '#E63946', letterSpacing: '-1px' }}>
                WIRE
              </span>
            </div>

            {isBreaking && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: '#E63946',
                  padding: '6px 16px',
                  borderRadius: '6px',
                }}
              >
                <span style={{ fontSize: '14px', fontWeight: 800, color: '#FFFFFF', letterSpacing: '2px' }}>
                  ⚡ BREAKING
                </span>
              </div>
            )}
          </div>

          {/* Category tag */}
          {category && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <div
                style={{
                  width: '4px',
                  height: '20px',
                  background: '#E63946',
                  borderRadius: '2px',
                }}
              />
              <span
                style={{
                  fontSize: '16px',
                  fontWeight: 600,
                  color: '#1DA1F2',
                  letterSpacing: '3px',
                  textTransform: 'uppercase',
                }}
              >
                {category}
              </span>
            </div>
          )}
        </div>

        {/* Title */}
        <div style={{ display: 'flex', flex: 1, alignItems: 'center', paddingTop: '20px', paddingBottom: '20px' }}>
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
            borderTop: '1px solid rgba(255,255,255,0.1)',
            paddingTop: '24px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {author && (
              <span style={{ fontSize: '16px', color: '#8D99AE' }}>
                By <span style={{ color: '#1DA1F2' }}>{author}</span>
              </span>
            )}
            {date && (
              <span style={{ fontSize: '14px', color: '#8D99AE', fontFamily: 'monospace' }}>
                {date}
              </span>
            )}
          </div>
          <span style={{ fontSize: '14px', color: '#8D99AE', fontFamily: 'monospace', letterSpacing: '1px' }}>
            saucewire.com
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
