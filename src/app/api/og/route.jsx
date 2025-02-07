import { ImageResponse } from 'next/og';

// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const runtime = 'edge';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const title = searchParams.get('title') || 'CheckMate';

    return new ImageResponse(
      (
        <div
          style={{
            background: 'linear-gradient(to bottom right, #1a1a1a, #2a2a2a)',
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px',
          }}
        >
          {/* Logo placeholder */}
          <img
            src={new URL('/logo.png', request.url).toString()}
            alt="CheckMate Logo"
            width="120"
            height="120"
            style={{ marginBottom: '20px' }}
          />
          <div
            style={{
              fontSize: '60px',
              fontWeight: 'bold',
              color: '#ffffff',
              textAlign: 'center',
              marginBottom: '20px',
            }}
          >
            {title}
          </div>
          <div
            style={{
              fontSize: '30px',
              color: '#cccccc',
              textAlign: 'center',
              maxWidth: '800px',
            }}
          >
            Stay organized, focused, and inspired
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (error) {
    console.error('Error generating OG image:', error);
    return new Response('Error generating image', { status: 500 });
  }
}
