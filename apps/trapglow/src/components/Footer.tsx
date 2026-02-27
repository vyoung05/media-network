import React from 'react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-glow-deep border-t border-white/[0.06] mt-auto relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="container-glow py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-baseline mb-4">
              <span className="text-xl font-accent font-bold text-white tracking-tight">TRAP</span>
              <span className="text-xl font-accent font-bold text-gradient tracking-tight">GLOW</span>
            </Link>
            <p className="text-sm text-white/50 mb-4 font-body leading-relaxed">
              Shining Light on What&apos;s Next. Discover tomorrow&apos;s biggest artists today.
            </p>
            <p className="text-xs text-white/30">
              Part of the Media Network
            </p>
            <div className="flex gap-2 mt-3">
              {['SauceCaviar', 'SauceWire', 'TrapFrequency'].map((brand) => (
                <span key={brand} className="text-[10px] text-white/20 font-body">{brand}</span>
              ))}
            </div>
          </div>

          {/* Discover */}
          <div>
            <h4 className="text-sm font-headline font-bold text-white uppercase tracking-wider mb-4">Discover</h4>
            <ul className="space-y-2.5">
              {['Hip-Hop', 'R&B', 'Afrobeats', 'Electronic', 'Latin', 'Alternative'].map((genre) => (
                <li key={genre}>
                  <Link
                    href={`/discover?genre=${genre.toLowerCase()}`}
                    className="text-sm text-white/40 hover:text-accent transition-colors font-body"
                  >
                    {genre}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contribute */}
          <div>
            <h4 className="text-sm font-headline font-bold text-white uppercase tracking-wider mb-4">Contribute</h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="/submit" className="text-sm text-white/40 hover:text-accent transition-colors font-body">
                  Submit an Artist
                </Link>
              </li>
              <li>
                <Link href="/write" className="text-sm text-white/40 hover:text-accent transition-colors font-body">
                  Write for TrapGlow
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-sm text-white/40 hover:text-accent transition-colors font-body">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/feed.xml" className="text-sm text-white/40 hover:text-accent transition-colors font-body">
                  RSS Feed
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="text-sm font-headline font-bold text-white uppercase tracking-wider mb-4">Connect</h4>
            <ul className="space-y-2.5">
              {[
                { name: 'Twitter / X', href: 'https://twitter.com/trapglow' },
                { name: 'Instagram', href: 'https://instagram.com/trapglow' },
                { name: 'TikTok', href: 'https://tiktok.com/@trapglow' },
              ].map((social) => (
                <li key={social.name}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-white/40 hover:text-accent transition-colors font-body"
                  >
                    {social.name}
                  </a>
                </li>
              ))}
              <li>
                <a href="mailto:submit@trapglow.com" className="text-sm text-white/40 hover:text-accent transition-colors font-body">
                  submit@trapglow.com
                </a>
              </li>
            </ul>

            {/* Newsletter mini */}
            <div className="mt-6">
              <p className="text-xs text-white/30 mb-2 font-body">Stay in the glow ✨</p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="flex-1 px-3 py-2 text-xs bg-surface border border-white/10 rounded-lg text-white placeholder-white/20 focus:outline-none focus:border-primary"
                />
                <button className="px-3 py-2 text-xs bg-primary text-white font-bold rounded-lg hover:bg-primary/80 transition-colors">
                  Go
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-white/[0.06] flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/30 font-body">
            © {new Date().getFullYear()} TrapGlow. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <span className="text-xs text-white/20 font-body">
              Powered by Media Network
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
