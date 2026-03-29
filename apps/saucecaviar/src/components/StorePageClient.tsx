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
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-black via-gray-900 to-black">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(201,168,76,0.1),transparent_70%)]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
                {brandName}
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#C9A84C] to-[#F5F0E8]">
                  Store
                </span>
              </h1>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                Premium merchandise for the culture connoisseur. Each piece crafted with the same attention to detail as our editorial.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {products.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20"
            >
              <div className="w-24 h-24 mx-auto mb-8 rounded-full border-2 border-[#C9A84C]/30 flex items-center justify-center">
                <svg className="w-12 h-12 text-[#C9A84C]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Coming Soon</h3>
              <p className="text-gray-400 text-lg max-w-md mx-auto">
                Our premium merchandise collection is being curated with the same care we put into our editorial. 
                Something extraordinary is on the way.
              </p>
              <div className="mt-8">
                <button
                  style={{ 
                    background: `linear-gradient(135deg, ${brandColors.primary}, ${brandColors.accent})`,
                    border: `1px solid ${brandColors.primary}`
                  }}
                  className="px-8 py-3 text-black font-semibold rounded-lg hover:opacity-90 transition-opacity"
                >
                  Contact for Early Access
                </button>
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
                  className="group relative bg-gradient-to-br from-gray-900 to-black rounded-2xl overflow-hidden border border-white/10 hover:border-[#C9A84C]/30 transition-all duration-500"
                >
                  {/* Product Image */}
                  <div className="aspect-square bg-gradient-to-br from-gray-800 to-gray-900 relative overflow-hidden">
                    {product.images && product.images.length > 0 ? (
                      <img
                        src={product.images[0]}
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg className="w-16 h-16 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                    
                    {/* Brand Badge */}
                    <div className="absolute top-4 left-4">
                      <span 
                        className="px-3 py-1 text-xs font-medium rounded-full text-black"
                        style={{ backgroundColor: brandColors.primary }}
                      >
                        {product.brand}
                      </span>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-6 space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white group-hover:text-[#C9A84C] transition-colors">
                        {product.title}
                      </h3>
                      {product.description && (
                        <p className="text-gray-400 text-sm mt-2 line-clamp-2">
                          {product.description}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-white">
                        {formatPrice(product.price)}
                      </span>
                      <span className="text-xs text-gray-500 capitalize">
                        {product.category.replace('_', ' ')}
                      </span>
                    </div>

                    {/* Sizes */}
                    {product.sizes && product.sizes.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {product.sizes.slice(0, 4).map((size) => (
                          <span
                            key={size}
                            className="px-2 py-1 text-xs border border-gray-600 text-gray-300 rounded"
                          >
                            {size}
                          </span>
                        ))}
                        {product.sizes.length > 4 && (
                          <span className="px-2 py-1 text-xs text-gray-500">
                            +{product.sizes.length - 4}
                          </span>
                        )}
                      </div>
                    )}

                    {/* CTA */}
                    <button
                      style={{ 
                        background: `linear-gradient(135deg, ${brandColors.primary}, ${brandColors.accent})`,
                      }}
                      className="w-full py-2 text-black font-semibold rounded-lg hover:opacity-90 transition-opacity"
                    >
                      Contact for Orders
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-gradient-to-br from-gray-900 to-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-white mb-6">
              Interested in our merchandise?
            </h2>
            <p className="text-gray-400 text-lg mb-8">
              Reach out to us for orders, custom pieces, or collaboration opportunities. 
              We're crafting something special for the culture.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                style={{ 
                  background: `linear-gradient(135deg, ${brandColors.primary}, ${brandColors.accent})`,
                }}
                className="px-8 py-3 text-black font-semibold rounded-lg hover:opacity-90 transition-opacity"
              >
                Contact Us
              </button>
              <button className="px-8 py-3 border border-[#C9A84C] text-[#C9A84C] font-semibold rounded-lg hover:bg-[#C9A84C] hover:text-black transition-colors">
                Subscribe for Updates
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}