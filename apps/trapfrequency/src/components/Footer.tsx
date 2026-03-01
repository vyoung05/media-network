import React from 'react';
import Link from 'next/link';
import { NewsletterSignup } from '@media-network/shared';

export function Footer() {
  return (
    <footer className="bg-secondary border-t border-primary/10 mt-auto">
      {/* Green accent line */}
      <div className="h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      <div className="container-freq py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-3">
              <div className="flex items-end gap-[2px] h-5">
                <div className="w-[2px] h-2 bg-primary rounded-full" />
                <div className="w-[2px] h-4 bg-primary rounded-full" />
                <div className="w-[2px] h-3 bg-primary rounded-full" />
                <div className="w-[2px] h-5 bg-primary rounded-full" />
              </div>
              <div className="flex items-baseline">
                <span className="text-lg font-headline font-bold text-white tracking-wider">TRAP</span>
                <span className="text-lg font-headline font-bold text-primary tracking-wider">FREQUENCY</span>
              </div>
            </Link>
            <p className="text-sm text-neutral/60 mb-2 font-mono">
              Tune Into The Craft
            </p>
            <p className="text-xs text-neutral/40">
              Part of the Media Network — SauceCaviar · TrapGlow · SauceWire · TrapFrequency
            </p>
          </div>

          {/* Content */}
          <div>
            <h4 className="text-sm font-headline font-bold text-primary uppercase tracking-wider mb-4">Explore</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/tutorials" className="text-sm text-neutral/60 hover:text-primary transition-colors font-mono">
                  Tutorials
                </Link>
              </li>
              <li>
                <Link href="/beats" className="text-sm text-neutral/60 hover:text-primary transition-colors font-mono">
                  Beats
                </Link>
              </li>
              <li>
                <Link href="/gear" className="text-sm text-neutral/60 hover:text-primary transition-colors font-mono">
                  Gear Reviews
                </Link>
              </li>
            </ul>
          </div>

          {/* Contribute */}
          <div>
            <h4 className="text-sm font-headline font-bold text-primary uppercase tracking-wider mb-4">Contribute</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/submit" className="text-sm text-neutral/60 hover:text-primary transition-colors font-mono">
                  Submit a Beat
                </Link>
              </li>
              <li>
                <Link href="/submit" className="text-sm text-neutral/60 hover:text-primary transition-colors font-mono">
                  Write for Us
                </Link>
              </li>
              <li>
                <Link href="/feed.xml" className="text-sm text-neutral/60 hover:text-primary transition-colors font-mono">
                  RSS Feed
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="text-sm font-headline font-bold text-primary uppercase tracking-wider mb-4">Connect</h4>
            <ul className="space-y-2">
              <li>
                <a href="https://twitter.com/trapfrequency" target="_blank" rel="noopener noreferrer" className="text-sm text-neutral/60 hover:text-cool transition-colors font-mono">
                  Twitter / X
                </a>
              </li>
              <li>
                <a href="https://instagram.com/trapfrequency" target="_blank" rel="noopener noreferrer" className="text-sm text-neutral/60 hover:text-cool transition-colors font-mono">
                  Instagram
                </a>
              </li>
              <li>
                <a href="https://youtube.com/@trapfrequency" target="_blank" rel="noopener noreferrer" className="text-sm text-neutral/60 hover:text-cool transition-colors font-mono">
                  YouTube
                </a>
              </li>
              <li>
                <a href="mailto:beats@trapfrequency.com" className="text-sm text-neutral/60 hover:text-cool transition-colors font-mono">
                  beats@trapfrequency.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="mt-10 pt-8 border-t border-primary/10">
          <NewsletterSignup
            brand="trapfrequency"
            brandName="TrapFrequency"
            primaryColor="#39FF14"
          />
        </div>

        {/* Bottom */}
        <div className="mt-10 pt-6 border-t border-primary/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-neutral/40 font-mono">
            © {new Date().getFullYear()} TrapFrequency. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-xs font-mono text-neutral/30">
              Powered by Media Network
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
