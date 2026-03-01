'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { GlassMorphCard } from '@/components/GlassMorphCard';
import { TextReveal } from '@/components/TextReveal';

const tiers = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    features: [
      'Access to all published issues',
      'Standard reading experience',
      'Email newsletter',
      'Community access',
    ],
    cta: 'Get Started',
    highlighted: false,
  },
  {
    name: 'Premium',
    price: '$9.99',
    period: '/month',
    features: [
      'Early access to new issues (48hr before public)',
      'Full interactive magazine experience',
      'Ambient audio & cinematic features',
      'Ad-free reading',
      'Exclusive behind-the-scenes content',
      'Print-on-demand discount (20% off)',
      'Premium newsletter with curator notes',
    ],
    cta: 'Go Premium',
    highlighted: true,
  },
  {
    name: 'Collector',
    price: '$24.99',
    period: '/month',
    features: [
      'Everything in Premium',
      'Physical print copy mailed monthly',
      'Collector edition packaging',
      'Signed prints from featured artists',
      'VIP event invitations',
      'Direct line to editorial team',
    ],
    cta: 'Become a Collector',
    highlighted: false,
  },
];

export function SubscribePageClient() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleFreeSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    setSubscribed(true);
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container-caviar">
        {/* Hero */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-headline font-bold text-white mb-6">
            <TextReveal as="span">Subscribe to</TextReveal>{' '}
            <span className="text-primary italic"><TextReveal as="span" delay={0.3}>SauceCaviar</TextReveal></span>
          </h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-lg text-warm-white/60 font-body max-w-2xl mx-auto"
          >
            Get premium culture delivered to your screen. Choose the experience that fits you.
          </motion.p>
        </div>

        {/* Pricing Tiers */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {tiers.map((tier, i) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.15 }}
            >
              <GlassMorphCard
                className={`p-6 h-full flex flex-col ${
                  tier.highlighted ? 'ring-2 ring-primary shadow-lg shadow-primary/20' : ''
                }`}
              >
                {tier.highlighted && (
                  <span className="text-[10px] font-body font-bold text-background bg-primary px-3 py-1 rounded-full self-start mb-4 uppercase tracking-wider">
                    Most Popular
                  </span>
                )}
                <h3 className="text-xl font-headline font-bold text-white">{tier.name}</h3>
                <div className="mt-2 mb-6">
                  <span className="text-4xl font-headline font-bold text-primary">{tier.price}</span>
                  <span className="text-sm text-warm-white/40 font-body">{tier.period}</span>
                </div>
                <ul className="space-y-3 mb-8 flex-1">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <svg className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-sm text-warm-white/60 font-body">{feature}</span>
                    </li>
                  ))}
                </ul>
                <button
                  className={`w-full py-3 rounded-xl font-body font-semibold text-sm transition-all duration-300 ${
                    tier.highlighted
                      ? 'bg-primary text-background hover:bg-primary/90 shadow-lg shadow-primary/30'
                      : 'bg-white/5 text-white hover:bg-white/10 border border-white/10'
                  }`}
                >
                  {tier.cta}
                </button>
              </GlassMorphCard>
            </motion.div>
          ))}
        </div>

        {/* Free Email Signup */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <GlassMorphCard className="p-8 md:p-12 text-center max-w-2xl mx-auto">
            <h2 className="text-2xl font-headline font-bold text-white mb-2">Stay in the Loop</h2>
            <p className="text-warm-white/50 font-body mb-6">
              Get notified when new issues drop. No spam, just sauce.
            </p>
            {subscribed ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-primary font-body font-semibold"
              >
                ✨ You&apos;re in. Welcome to SauceCaviar.
              </motion.div>
            ) : (
              <form onSubmit={handleFreeSubscribe} className="flex gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white font-body placeholder:text-white/20 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30"
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-primary text-background font-body font-semibold rounded-xl hover:bg-primary/90 transition-colors shadow-lg shadow-primary/30"
                >
                  Subscribe
                </button>
              </form>
            )}
          </GlassMorphCard>
        </motion.div>
      </div>
    </div>
  );
}
