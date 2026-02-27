import React from 'react';
import Link from 'next/link';
import { SAUCEWIRE_CATEGORIES } from '@media-network/shared';

export function Footer() {
  return (
    <footer className="bg-secondary border-t border-gray-800 mt-auto">
      <div className="container-wire py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-baseline mb-3">
              <span className="text-xl font-headline text-white tracking-tight">SAUCE</span>
              <span className="text-xl font-headline text-primary tracking-tight">WIRE</span>
            </Link>
            <p className="text-sm text-neutral mb-4">
              Culture. Connected. Now.
            </p>
            <p className="text-xs text-neutral/60">
              Part of the Media Network — SauceCaviar · TrapGlow · SauceWire · TrapFrequency
            </p>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Wires</h4>
            <ul className="space-y-2">
              {SAUCEWIRE_CATEGORIES.map((category) => (
                <li key={category}>
                  <Link
                    href={`/category/${category.toLowerCase()}`}
                    className="text-sm text-neutral hover:text-white transition-colors"
                  >
                    {category}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contribute */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Contribute</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/submit" className="text-sm text-neutral hover:text-white transition-colors">
                  Submit a Tip
                </Link>
              </li>
              <li>
                <Link href="/write" className="text-sm text-neutral hover:text-white transition-colors">
                  Write for Us
                </Link>
              </li>
              <li>
                <Link href="/archive" className="text-sm text-neutral hover:text-white transition-colors">
                  Archive
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Connect</h4>
            <ul className="space-y-2">
              <li>
                <a href="https://twitter.com/saucewire" target="_blank" rel="noopener noreferrer" className="text-sm text-neutral hover:text-accent transition-colors">
                  Twitter / X
                </a>
              </li>
              <li>
                <a href="https://instagram.com/saucewire" target="_blank" rel="noopener noreferrer" className="text-sm text-neutral hover:text-accent transition-colors">
                  Instagram
                </a>
              </li>
              <li>
                <a href="mailto:tips@saucewire.com" className="text-sm text-neutral hover:text-accent transition-colors">
                  tips@saucewire.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-neutral/60">
            © {new Date().getFullYear()} SauceWire. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-xs font-mono text-neutral/40">
              Powered by Media Network
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
