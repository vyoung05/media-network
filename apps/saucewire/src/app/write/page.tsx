import type { Metadata } from 'next';
import { WritePageClient } from './WritePageClient';

export const metadata: Metadata = {
  title: 'Write for SauceWire',
  description: 'Join the SauceWire contributor team. Pitch articles, submit stories, and build your portfolio covering culture.',
};

export default function WritePage() {
  return (
    <div className="container-wire py-8">
      {/* Hero */}
      <div className="max-w-3xl mx-auto mb-12">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent/10 text-accent rounded text-xs font-mono uppercase tracking-wider mb-4">
            <span className="w-2 h-2 bg-accent rounded-full"></span>
            Now Accepting Contributors
          </div>
          <h1 className="text-3xl md:text-4xl font-headline text-white mb-3">
            Write for <span className="text-primary">SauceWire</span>
          </h1>
          <p className="text-neutral max-w-lg mx-auto text-lg">
            Got a voice the culture needs to hear? We're looking for writers who live 
            and breathe music, fashion, entertainment, sports, and tech.
          </p>
        </div>

        {/* What we're looking for */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div className="bg-surface rounded-lg p-6 border border-gray-800/50">
            <h3 className="text-lg font-bold text-white mb-3">What We Publish</h3>
            <ul className="space-y-2 text-sm text-neutral">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">→</span>
                <span>Breaking news coverage (300-500 words)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">→</span>
                <span>Feature stories and deep dives (800-2000 words)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">→</span>
                <span>Op-eds and analysis pieces</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">→</span>
                <span>Interviews with artists, athletes, and creators</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">→</span>
                <span>Trend reports and culture commentary</span>
              </li>
            </ul>
          </div>

          <div className="bg-surface rounded-lg p-6 border border-gray-800/50">
            <h3 className="text-lg font-bold text-white mb-3">What You Get</h3>
            <ul className="space-y-2 text-sm text-neutral">
              <li className="flex items-start gap-2">
                <span className="text-accent mt-0.5">✓</span>
                <span>Published byline on SauceWire</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent mt-0.5">✓</span>
                <span>Portfolio building with a recognized platform</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent mt-0.5">✓</span>
                <span>Editorial support and feedback</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent mt-0.5">✓</span>
                <span>Access to the Media Network contributor community</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent mt-0.5">✓</span>
                <span>Revenue share on high-performing articles (coming soon)</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Categories */}
        <div className="mb-10">
          <h3 className="text-xs font-mono text-neutral uppercase tracking-wider mb-4 text-center">
            Beats We Cover
          </h3>
          <div className="flex flex-wrap justify-center gap-3">
            {['Music', 'Fashion', 'Entertainment', 'Sports', 'Tech'].map((cat) => (
              <span
                key={cat}
                className="px-4 py-2 bg-surface border border-gray-800/50 rounded-lg text-sm font-mono text-white"
              >
                {cat}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Pitch form */}
      <WritePageClient />
    </div>
  );
}
