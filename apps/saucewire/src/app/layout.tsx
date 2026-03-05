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
        url: 'https://heyboss.heeyo.ai/replicate-z-image-turbo-1772241235-870da467.jpeg',
        width: 1200,
        height: 630,
        alt: 'SauceWire - Culture. Connected. Now.',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SauceWire',
    description: 'Culture. Connected. Now.',
    images: ['https://heyboss.heeyo.ai/replicate-z-image-turbo-1772241235-870da467.jpeg'],
  },
  icons: {
    icon: '/icon.svg',
    apple: '/apple-touch-icon.svg',
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
        <OrganizationSchema />
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
      </body>
    </html>
  );
}
