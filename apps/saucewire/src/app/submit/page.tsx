import type { Metadata } from 'next';
import { SubmitPageClient } from './SubmitPageClient';

export const metadata: Metadata = {
  title: 'Submit a Tip',
  description: 'Got a story the culture needs to hear? Submit an anonymous or credited news tip to SauceWire.',
};

export default function SubmitPage() {
  return (
    <div className="container-wire py-8">
      {/* Header */}
      <div className="max-w-2xl mx-auto text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-headline text-white mb-3">
          Submit a <span className="text-primary">Tip</span>
        </h1>
        <p className="text-neutral max-w-lg mx-auto">
          Got a scoop? Know something before it breaks? Drop it here — 
          anonymously or with your name. We protect our sources.
        </p>
      </div>

      {/* Info cards */}
      <div className="max-w-2xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        <div className="bg-surface rounded-lg p-4 text-center border border-gray-800/50">
          <div className="text-2xl mb-2">🔒</div>
          <h3 className="text-sm font-bold text-white mb-1">Anonymous</h3>
          <p className="text-xs text-neutral">Your identity is protected. Always.</p>
        </div>
        <div className="bg-surface rounded-lg p-4 text-center border border-gray-800/50">
          <div className="text-2xl mb-2">⚡</div>
          <h3 className="text-sm font-bold text-white mb-1">Fast Review</h3>
          <p className="text-xs text-neutral">Tips are reviewed within hours.</p>
        </div>
        <div className="bg-surface rounded-lg p-4 text-center border border-gray-800/50">
          <div className="text-2xl mb-2">📰</div>
          <h3 className="text-sm font-bold text-white mb-1">Get Published</h3>
          <p className="text-xs text-neutral">Verified tips become SauceWire stories.</p>
        </div>
      </div>

      {/* Form */}
      <SubmitPageClient />
    </div>
  );
}
