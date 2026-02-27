import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { LenisProvider } from '@/components/LenisProvider';
import { ScrollProgress } from '@/components/ScrollProgress';
import { PageTransition } from '@/components/PageTransition';
import { CustomCursor } from '@/components/CustomCursor';

export const metadata: Metadata = {
  title: {
    default: 'TrapGlow — Shining Light on What\'s Next',
    template: '%s | TrapGlow',
  },
  description:
    'Discover tomorrow\'s biggest artists today. Music discovery, artist spotlights, curated playlists, and the Glow Up leaderboard.',
  keywords: ['music discovery', 'emerging artists', 'hip-hop', 'R&B', 'Afrobeats', 'artist spotlight', 'new music', 'trap', 'glow up'],
  openGraph: {
    title: 'TrapGlow — Shining Light on What\'s Next',
    description: 'Discover tomorrow\'s biggest artists today.',
    siteName: 'TrapGlow',
    type: 'website',
    url: 'https://trapglow.com',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TrapGlow',
    description: 'Shining Light on What\'s Next.',
  },
  alternates: {
    types: {
      'application/rss+xml': '/feed.xml',
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen flex flex-col bg-secondary">
        <LenisProvider>
          <CustomCursor />
          <ScrollProgress />
          <Header />
          <main className="flex-1">
            <PageTransition>{children}</PageTransition>
          </main>
          <Footer />
        </LenisProvider>
      </body>
    </html>
  );
}
