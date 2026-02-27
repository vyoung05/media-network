'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export function Footer() {
  return (
    <footer className="relative bg-secondary border-t border-primary/10">
      {/* Gold line accent */}
      <div className="divider-gold" />

      <div className="container-caviar py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8">
          {/* Brand column */}
          <div className="md:col-span-5">
            <Link href="/" className="inline-block group">
              <h2 className="text-3xl font-headline tracking-[0.15em] text-text group-hover:text-primary transition-colors duration-500">
                SAUCE<span className="text-primary group-hover:text-text transition-colors duration-500">CAVIAR</span>
              </h2>
            </Link>
            <p className="mt-4 text-sm text-text/40 font-accent italic leading-relaxed max-w-sm">
              Culture Served Premium. A luxury interactive digital magazine
              exploring fashion, music, art, and the creative forces shaping our world.
            </p>
            <p className="mt-6 text-[10px] tracking-[0.3em] uppercase text-primary/40 font-body">
              Part of the Sauce Media Network
            </p>
          </div>

          {/* Navigation */}
          <div className="md:col-span-2">
            <h3 className="text-[10px] tracking-[0.3em] uppercase text-primary/60 font-body mb-6">
              Navigate
            </h3>
            <ul className="space-y-3">
              {['Issues', 'About', 'Submit', 'Advertise', 'Subscribe'].map((item) => (
                <li key={item}>
                  <Link
                    href={`/${item.toLowerCase()}`}
                    className="text-sm text-text/40 hover:text-primary transition-colors duration-300 font-body"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Network */}
          <div className="md:col-span-2">
            <h3 className="text-[10px] tracking-[0.3em] uppercase text-primary/60 font-body mb-6">
              Network
            </h3>
            <ul className="space-y-3">
              {[
                { name: 'SauceWire', url: 'https://saucewire.com' },
                { name: 'TrapGlow', url: 'https://trapglow.com' },
                { name: 'TrapFrequency', url: 'https://trapfrequency.com' },
              ].map((site) => (
                <li key={site.name}>
                  <a
                    href={site.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-text/40 hover:text-primary transition-colors duration-300 font-body"
                  >
                    {site.name} ↗
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div className="md:col-span-3">
            <h3 className="text-[10px] tracking-[0.3em] uppercase text-primary/60 font-body mb-6">
              Connect
            </h3>
            <ul className="space-y-3">
              {[
                { name: 'Instagram', url: '#' },
                { name: 'Twitter / X', url: '#' },
                { name: 'TikTok', url: '#' },
                { name: 'YouTube', url: '#' },
              ].map((social) => (
                <li key={social.name}>
                  <a
                    href={social.url}
                    className="text-sm text-text/40 hover:text-primary transition-colors duration-300 font-body"
                  >
                    {social.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-surface/20">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-[10px] tracking-[0.2em] text-text/20 font-body uppercase">
              © {new Date().getFullYear()} SauceCaviar Magazine. All Rights Reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link href="/privacy" className="text-[10px] tracking-[0.2em] text-text/20 hover:text-primary/60 transition-colors font-body uppercase">
                Privacy
              </Link>
              <Link href="/terms" className="text-[10px] tracking-[0.2em] text-text/20 hover:text-primary/60 transition-colors font-body uppercase">
                Terms
              </Link>
              <Link href="/feed.xml" className="text-[10px] tracking-[0.2em] text-text/20 hover:text-primary/60 transition-colors font-body uppercase">
                RSS
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
