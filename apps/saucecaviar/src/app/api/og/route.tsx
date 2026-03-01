import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get('title') || 'SauceCaviar';
  const subtitle = searchParams.get('subtitle') || 'Culture Served Premium';
  const issue = searchParams.get('issue') || '';
  const category = searchParams.get('category') || '';
  const author = searchParams.get('author') || '';
  const image = searchParams.get('image') || '';

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
          backgroundColor: '#0A0A0A',
          position: 'relative',
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
        {/* Dark overlay for readability */}
        {image && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'linear-gradient(180deg, rgba(10,10,10,0.6) 0%, rgba(26,10,46,0.85) 100%)',
            }}
          />
        )}

        {/* Gold gradient accent */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'linear-gradient(90deg, #722F37, #C9A84C, #722F37)',
          }}
        />

        {/* Content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px 60px',
            textAlign: 'center',
            position: 'relative',
          }}
        >
          {/* Brand */}
          <div
            style={{
              fontSize: '24px',
              color: '#C9A84C',
              letterSpacing: '6px',
              textTransform: 'uppercase',
              marginBottom: '24px',
              fontWeight: 700,
            }}
          >
            SauceCaviar
          </div>

          {/* Issue badge */}
          {issue && (
            <div
              style={{
                fontSize: '14px',
                color: '#722F37',
                border: '1px solid #722F37',
                padding: '4px 16px',
                borderRadius: '20px',
                marginBottom: '20px',
                letterSpacing: '2px',
                textTransform: 'uppercase',
              }}
            >
              {issue}
            </div>
          )}

          {/* Category badge */}
          {category && !issue && (
            <div
              style={{
                fontSize: '14px',
                color: '#C9A84C',
                border: '1px solid rgba(201, 168, 76, 0.4)',
                padding: '4px 16px',
                borderRadius: '20px',
                marginBottom: '20px',
                letterSpacing: '2px',
                textTransform: 'uppercase',
              }}
            >
              {category}
            </div>
          )}

          {/* Title */}
          <div
            style={{
              fontSize: title.length > 80 ? '40px' : '52px',
              fontWeight: 700,
              color: '#FAFAF7',
              lineHeight: 1.2,
              maxWidth: '900px',
              marginBottom: '16px',
            }}
          >
            {title}
          </div>

          {/* Subtitle / Author */}
          <div
            style={{
              fontSize: '20px',
              color: '#FAFAF780',
              maxWidth: '600px',
            }}
          >
            {author ? `By ${author}` : subtitle}
          </div>
        </div>

        {/* Bottom accent */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'linear-gradient(90deg, #722F37, #C9A84C, #722F37)',
          }}
        />
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
