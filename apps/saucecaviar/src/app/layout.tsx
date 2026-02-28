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
    default: 'SauceCaviar — Culture Served Premium',
    template: '%s | SauceCaviar',
  },
  description:
    'SauceCaviar is a luxury interactive digital magazine exploring fashion, music, art, and the creative forces shaping culture. Experience editorial content through our immersive page-flip magazine reader.',
  keywords: ['magazine', 'culture', 'fashion', 'music', 'art', 'luxury', 'editorial', 'digital magazine'],
  openGraph: {
    title: 'SauceCaviar — Culture Served Premium',
    description: 'A luxury interactive digital magazine. Fashion. Music. Art. Culture.',
    siteName: 'SauceCaviar',
    type: 'website',
    url: 'https://saucecaviar.com',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'SauceCaviar - Culture Served Premium',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SauceCaviar',
    description: 'Culture Served Premium. The digital magazine experience.',
    images: ['/og-image.png'],
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
