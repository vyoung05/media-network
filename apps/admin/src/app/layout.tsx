import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Admin — Media Network',
    template: '%s | Admin — Media Network',
  },
  description: 'Media Network administration dashboard. Manage content, writers, and submissions across all brands.',
  robots: 'noindex, nofollow',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-admin-bg">
        {children}
      </body>
    </html>
  );
}
