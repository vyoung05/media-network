import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { LenisProvider } from '@/components/LenisProvider';
import { ScrollProgress } from '@/components/ScrollProgress';
import { PageTransition } from '@/components/PageTransition';
import { CustomCursor } from '@/components/CustomCursor';
import { PageViewTracker } from '@/components/PageViewTracker';
import { OrganizationSchema } from '@/components/StructuredData';
import { CartProvider } from '@media-network/ui';

export const metadata: Metadata = {
  title: {
    default: 'SauceWire — Culture. Connected. Now.',
    template: '%s | SauceWire',
  },
  description:
    'Breaking news and culture coverage — hip-hop, fashion, entertainment, sports, and tech. Always on, always plugged in.',
  keywords: ['news', 'hip-hop', 'culture', 'entertainment', 'fashion', 'sports', 'tech'],
  openGraph: {
    title: 'SauceWire — Culture. Connected. Now.',
    description: 'Breaking culture news. Always on.',
    siteName: 'SauceWire',
    type: 'website',
    url: 'https://saucewire.com',
    images: [
      {
        url: 'https://saucewire.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'SauceWire - Culture. Connected. Now.',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@SauceWire',
    title: 'SauceWire',
    description: 'Breaking hip-hop, culture, fashion, entertainment and sports news. Always on, always plugged in.',
    images: ['https://saucewire.com/og-image.png'],
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
  alternates: {
    canonical: 'https://saucewire.com',
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
        <OrganizationSchema />
        <CartProvider>
          <LenisProvider>
            <CustomCursor />
            <ScrollProgress />
            <Header />
            <main className="flex-1">
              <PageTransition>{children}</PageTransition>
            </main>
            <Footer />
            <PageViewTracker brand="saucewire" />
          </LenisProvider>
        </CartProvider>
      </body>
    </html>
  );
}
