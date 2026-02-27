import type { Metadata } from 'next';
import { AboutPageClient } from './AboutPageClient';

export const metadata: Metadata = {
  title: 'About',
  description: 'SauceCaviar is a luxury interactive digital magazine exploring fashion, music, art, and the creative forces shaping our world. Meet the team.',
};

export default function AboutPage() {
  return <AboutPageClient />;
}
