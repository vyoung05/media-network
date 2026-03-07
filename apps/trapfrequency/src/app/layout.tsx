import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { LenisProvider } from '@/components/LenisProvider';
import { ScrollProgress } from '@/components/ScrollProgress';
import { PageTransition } from '@/components/PageTransition';
import { CustomCursor } from '@/components/CustomCursor';
import { PageViewTracker } from '@/components/PageViewTracker';
import { OrganizationSchema } from '@/components/StructuredData';
import { AdBannerSlot } from '@/components/AdBannerSlot';

export const metadata: Metadata = {
  title: {
    default: 'TrapFrequency — Tune Into The Craft',
    template: '%s | TrapFrequency',
  },
  description:
    'Music production tutorials, beats, gear reviews, and producer spotlights. The ultimate hub for producers, beatmakers, and audio engineers.',
  keywords: [
    'music production', 'beats', 'tutorials', 'FL Studio', 'Ableton',
    'Logic Pro', 'gear reviews', 'producers', 'beatmaking', 'mixing',
    'mastering', 'sound design', '808', 'trap beats',
  ],
  openGraph: {
    title: 'TrapFrequency — Tune Into The Craft',
    description: 'Music production tutorials, beats, gear reviews, and producer spotlights.',
    siteName: 'TrapFrequency',
    type: 'website',
    url: 'https://trapfrequency.com',
    images: [
      {
        url: 'https://heyboss.heeyo.ai/replicate-z-image-turbo-1772241201-ce4e6fb9.jpeg',
        width: 1200,
        height: 630,
        alt: 'TrapFrequency - Tune Into The Craft',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TrapFrequency',
    description: 'Tune Into The Craft — Music Production Hub',
    images: ['https://heyboss.heeyo.ai/replicate-z-image-turbo-1772241201-ce4e6fb9.jpeg'],
  },
  icons: {
    icon: '/icon.svg',
    apple: '/icon.svg',
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
  const adsenseClientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

  return (
    <html lang="en" className="dark">
      <head>
        {adsenseClientId && (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClientId}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        )}
      </head>
      <body className="min-h-screen flex flex-col bg-secondary">
        <OrganizationSchema />
        <LenisProvider>
          <CustomCursor />
          <ScrollProgress />
          <Header />
          {/* Header leaderboard ad */}
          <AdBannerSlot slot="tf-header-leaderboard" format="horizontal" className="bg-secondary border-b border-primary/10" />
          <main className="flex-1">
            <PageTransition>{children}</PageTransition>
          </main>
          {/* Footer banner ad */}
          <AdBannerSlot slot="tf-footer-banner" format="horizontal" className="bg-secondary border-t border-primary/10" />
          <Footer />
          <PageViewTracker brand="trapfrequency" />
        </LenisProvider>
      </body>
    </html>
  );
}
