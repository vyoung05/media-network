'use client';

import React from 'react';
import { motion } from 'framer-motion';
import type { MerchProduct } from '@media-network/shared';

interface StorePageClientProps {
  products: MerchProduct[];
  brandName: string;
  brandColors: {
    primary: string;
    secondary: string;
    accent: string;
  };
}

export function StorePageClient({ products, brandName, brandColors }: StorePageClientProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F0B2E] via-[#1A1035] to-[#0F0B2E]">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(139,92,246,0.2),transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(6,245,214,0.1),transparent_70%)]" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8B5CF6] to-[#06F5D6]">
                  Glow Up
                </span>
                <span className="block text-white">Collection</span>
              </h1>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Empower your journey. Express your glow. Merchandise that shines as bright as your ambitions.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {products.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20"
            >
              <div className="w-32 h-32 mx-auto mb-8 rounded-full bg-gradient-to-br from-[#8B5CF6] to-[#06F5D6] p-8 flex items-center justify-center">
                <svg className="w-16 h-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-3xl font-bold text-white mb-4">Your Glow-Up Starts Soon</h3>
              <p className="text-gray-300 text-lg max-w-lg mx-auto mb-8">
                We're curating the perfect pieces to elevate your style and empower your journey. 
                Something amazing is coming to light up your wardrobe.
              </p>
              <div className="space-y-4">
                <button className="px-8 py-4 bg-gradient-to-r from-[#8B5CF6] to-[#06F5D6] text-white font-bold rounded-xl hover:opacity-90 transition-all duration-300 transform hover:scale-105">
                  Get Early Access ✨
                </button>
                <p className="text-sm text-gray-400">
                  Be the first to shop when we launch
                </p>
              </div>
            </motion.div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="group relative bg-gradient-to-br from-[#1A1035] to-[#0F0B2E] rounded-3xl overflow-hidden border border-white/10 hover:border-[#8B5CF6]/50 transition-all duration-500 hover:shadow-2xl hover:shadow-[#8B5CF6]/20"
                >
                  {/* Product Image */}
                  <div className="aspect-square bg-gradient-to-br from-[#8B5CF6]/10 to-[#06F5D6]/10 relative overflow-hidden">
                    {product.images && product.images.length > 0 ? (
                      <img
                        src={product.images[0]}
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg className="w-16 h-16 text-[#8B5CF6]/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                    
                    {/* Glow Effect Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#8B5CF6]/20 via-transparent to-[#06F5D6]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    {/* Brand Badge */}
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 text-xs font-bold rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#06F5D6] text-white">
                        {product.brand}
                      </span>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-6 space-y-4">
                    <div>
                      <h3 className="text-lg font-bold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-[#8B5CF6] group-hover:to-[#06F5D6] transition-all duration-300">
                        {product.title}
                      </h3>
                      {product.description && (
                        <p className="text-gray-300 text-sm mt-2 line-clamp-2">
                          {product.description}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-white">
                        {formatPrice(product.price)}
                      </span>
                      <span className="text-xs text-[#06F5D6] font-medium capitalize tracking-wide">
                        {product.category.replace('_', ' ')}
                      </span>
                    </div>

                    {/* Sizes */}
                    {product.sizes && product.sizes.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {product.sizes.slice(0, 4).map((size) => (
                          <span
                            key={size}
                            className="px-3 py-1 text-xs border border-[#8B5CF6]/30 text-[#8B5CF6] rounded-lg font-medium"
                          >
                            {size}
                          </span>
                        ))}
                        {product.sizes.length > 4 && (
                          <span className="px-3 py-1 text-xs text-gray-400">
                            +{product.sizes.length - 4}
                          </span>
                        )}
                      </div>
                    )}

                    {/* CTA */}
                    <button className="w-full py-3 bg-gradient-to-r from-[#8B5CF6] to-[#06F5D6] text-white font-bold rounded-xl hover:opacity-90 transition-all duration-300 transform hover:scale-105">
                      Shop Now ✨
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-[#8B5CF6]/10 to-[#06F5D6]/10" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8B5CF6] to-[#06F5D6]">Glow Up</span>?
            </h2>
            <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
              Join our community of trailblazers. Get exclusive access to new drops, style tips, 
              and everything you need to shine brighter.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] focus:border-transparent"
              />
              <button className="px-6 py-3 bg-gradient-to-r from-[#8B5CF6] to-[#06F5D6] text-white font-bold rounded-xl hover:opacity-90 transition-all duration-300 transform hover:scale-105">
                Subscribe ✨
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}