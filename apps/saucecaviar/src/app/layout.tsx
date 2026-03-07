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

export const metadata: Metadata = {
  verification: {
    google: 'fGmwaXxcmHyfINrlUZrh3AOR59oMhLpzs3BabTIAcsE',
  },
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
        url: 'https://heyboss.heeyo.ai/replicate-z-image-turbo-1772241222-81943aed.jpeg',
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
    images: ['https://heyboss.heeyo.ai/replicate-z-image-turbo-1772241222-81943aed.jpeg'],
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
          <main className="flex-1">
            <PageTransition>{children}</PageTransition>
          </main>
          <Footer />
          <PageViewTracker brand="saucecaviar" />
        </LenisProvider>
      </body>
    </html>
  );
}
