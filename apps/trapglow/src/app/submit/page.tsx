import type { Metadata } from 'next';
import { SubmitPageClient } from './SubmitPageClient';

export const metadata: Metadata = {
  title: 'Submit Your Music',
  description: 'Submit your music to be featured on TrapGlow. We spotlight emerging artists across hip-hop, R&B, Afrobeats, electronic, and more.',
  openGraph: {
    title: 'Submit Your Music | TrapGlow',
    description: 'Get featured on the premier music discovery platform.',
  },
};

export default function SubmitPage() {
  return (
    <div className="container-glow py-8 md:py-12">
      {/* Header */}
      <div className="max-w-2xl mx-auto text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-headline font-bold text-white mb-3">
          Submit Your <span className="text-gradient">Music</span>
        </h1>
        <p className="text-white/50 font-body max-w-lg mx-auto">
          Ready to glow? Submit your music and get featured in front of thousands of fans, 
          industry professionals, and fellow artists.
        </p>
      </div>

      {/* Info cards */}
      <div className="max-w-2xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        <div className="card-glow p-5 text-center">
          <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center mx-auto mb-3">
            <span className="text-xl">🎵</span>
          </div>
          <h3 className="text-sm font-headline font-bold text-white mb-1">Get Featured</h3>
          <p className="text-xs text-white/40 font-body">Spotlight cards, blog features, and social promotion.</p>
        </div>
        <div className="card-glow p-5 text-center">
          <div className="w-10 h-10 rounded-xl bg-accent/15 flex items-center justify-center mx-auto mb-3">
            <span className="text-xl">📊</span>
          </div>
          <h3 className="text-sm font-headline font-bold text-white mb-1">Track Your Glow</h3>
          <p className="text-xs text-white/40 font-body">Climb the Glow Up leaderboard with real metrics.</p>
        </div>
        <div className="card-glow p-5 text-center">
          <div className="w-10 h-10 rounded-xl bg-warm/15 flex items-center justify-center mx-auto mb-3">
            <span className="text-xl">🔥</span>
          </div>
          <h3 className="text-sm font-headline font-bold text-white mb-1">Join the Network</h3>
          <p className="text-xs text-white/40 font-body">Access across SauceCaviar, SauceWire, and TrapFrequency.</p>
        </div>
      </div>

      {/* Form */}
      <SubmitPageClient />
    </div>
  );
}
