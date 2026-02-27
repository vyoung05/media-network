import type { Metadata } from 'next';
import { WritePageClient } from './WritePageClient';

export const metadata: Metadata = {
  title: 'Write for TrapGlow',
  description: 'Join our team of music journalists and contributors. Write artist features, interviews, and think pieces for TrapGlow.',
  openGraph: {
    title: 'Write for TrapGlow',
    description: 'Become a TrapGlow contributor.',
  },
};

export default function WritePage() {
  return (
    <div className="container-glow py-8 md:py-12">
      {/* Header */}
      <div className="max-w-2xl mx-auto text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-headline font-bold text-white mb-3">
          Write for <span className="text-gradient">TrapGlow</span>
        </h1>
        <p className="text-white/50 font-body max-w-lg mx-auto">
          Are you a music journalist, critic, or culture writer? Join our contributor team and 
          help shine light on the next generation of artists.
        </p>
      </div>

      {/* What we're looking for */}
      <div className="max-w-2xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
        <div className="card-glow p-5">
          <h3 className="text-sm font-headline font-bold text-white mb-2 flex items-center gap-2">
            <span className="text-accent">📝</span> What We Publish
          </h3>
          <ul className="space-y-1.5 text-xs text-white/50 font-body">
            <li>• Artist features & spotlights</li>
            <li>• In-depth interviews</li>
            <li>• Album & EP reviews</li>
            <li>• Think pieces on music culture</li>
            <li>• Scene reports (city/region deep dives)</li>
            <li>• Listicles (emerging artists, best of, etc.)</li>
          </ul>
        </div>
        <div className="card-glow p-5">
          <h3 className="text-sm font-headline font-bold text-white mb-2 flex items-center gap-2">
            <span className="text-accent">✨</span> What You Get
          </h3>
          <ul className="space-y-1.5 text-xs text-white/50 font-body">
            <li>• Byline credit on all published work</li>
            <li>• Exposure across the Media Network</li>
            <li>• Access to artist connections</li>
            <li>• Portfolio-building clips</li>
            <li>• Early access to submissions & features</li>
            <li>• Path to editor roles</li>
          </ul>
        </div>
      </div>

      {/* Application form */}
      <WritePageClient />
    </div>
  );
}
