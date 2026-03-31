'use client';

import React, { useState } from 'react';
import type { MerchProduct } from '@media-network/shared';
import { ProductModal } from './ProductModal';

interface BrandConfig {
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    neutral: string;
  };
}

interface StoreGridProps {
  products: MerchProduct[];
  brand?: string;
  brandConfig?: BrandConfig;
  loading?: boolean;
  onProductClick?: (product: MerchProduct) => void;
}

export function StoreGrid({ 
  products, 
  brand,
  brandConfig,
  loading = false,
  onProductClick 
}: StoreGridProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const primaryColor = brandConfig?.colors.primary || '#3B82F6';
  const accentColor = brandConfig?.colors.accent || '#1D4ED8';

  const handleProductClick = (product: MerchProduct) => {
    if (onProductClick) {
      onProductClick(product);
    }
  };

  if (loading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="aspect-square bg-gray-700 rounded-lg mb-4" />
            <div className="space-y-2">
              <div className="h-4 bg-gray-700 rounded w-3/4" />
              <div className="h-4 bg-gray-700 rounded w-1/2" />
              <div className="h-6 bg-gray-700 rounded w-1/4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-20">
        <div 
          className="w-24 h-24 mx-auto mb-8 rounded-full border-2 flex items-center justify-center"
          style={{ borderColor: `${primaryColor}30` }}
        >
          <svg 
            className="w-12 h-12" 
            style={{ color: primaryColor }}
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={1.5} 
              d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" 
            />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-white mb-4">Coming Soon</h3>
        <p className="text-gray-400 text-lg max-w-md mx-auto mb-8">
          {brand ? `${brand} merchandise` : 'Our merchandise collection'} is being carefully curated. 
          Something amazing is on the way.
        </p>
        <button
          style={{ 
            background: `linear-gradient(135deg, ${primaryColor}, ${accentColor})`,
          }}
          className="px-8 py-3 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity"
        >
          Contact for Updates
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product, index) => (
        <div
          key={product.id}
          className="group relative bg-gray-900 rounded-xl overflow-hidden border border-gray-700 hover:border-gray-600 transition-all duration-300"
          style={{ 
            animationDelay: `${index * 100}ms`,
            animation: 'fadeInUp 0.6s ease-out forwards'
          }}
        >
          {/* Product Image */}
          <div 
            className="aspect-square bg-gray-800 relative overflow-hidden cursor-pointer"
            onClick={() => handleProductClick(product)}
          >
            {product.images && product.images.length > 0 ? (
              <img
                src={product.images[0]}
                alt={product.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <svg className="w-16 h-16 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}
            
            {/* 3D View Hint */}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
              <div className="text-white text-sm font-semibold bg-black bg-opacity-50 px-3 py-1 rounded-full">
                🔍 View in 3D
              </div>
            </div>
            
            {/* Brand Badge */}
            {product.brand && (
              <div className="absolute top-3 left-3">
                <span 
                  className="px-2 py-1 text-xs font-medium rounded text-white"
                  style={{ backgroundColor: primaryColor }}
                >
                  {product.brand}
                </span>
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="p-5 space-y-3">
            <div>
              <h3 className="font-semibold text-white text-lg leading-tight group-hover:opacity-80 transition-opacity">
                {product.title}
              </h3>
              {product.description && (
                <p className="text-gray-400 text-sm mt-1 line-clamp-2">
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

            {/* CTA Button */}
            <button
              style={{ 
                background: `linear-gradient(135deg, ${primaryColor}, ${accentColor})`,
              }}
              className="w-full py-2.5 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity"
            >
              Contact for Orders
            </button>
          </div>
        </div>
        ))}
      </div>
    </>
  );
}

// Client component wrapper for brand sites
export function StoreGridClient({ 
  products, 
  brand,
  brandConfig 
}: {
  products: MerchProduct[];
  brand?: string;
  brandConfig?: BrandConfig;
}) {
  const [selectedProduct, setSelectedProduct] = useState<MerchProduct | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const primaryColor = brandConfig?.colors.primary || '#3B82F6';

  const handleProductClick = (product: MerchProduct) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedProduct(null), 300);
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <section className="py-20 bg-gradient-to-br from-gray-900 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              {brandConfig?.name || brand || 'Store'}
              <span 
                className="block text-transparent bg-clip-text"
                style={{ 
                  backgroundImage: `linear-gradient(135deg, ${primaryColor}, ${brandConfig?.colors.accent || primaryColor})`
                }}
              >
                Store
              </span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Premium merchandise that represents the culture and creativity we stand for.
            </p>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <StoreGrid 
            products={products} 
            brand={brand}
            brandConfig={brandConfig}
            onProductClick={handleProductClick}
          />
        </div>
      </section>

      {/* Product Modal */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          brandConfig={brandConfig}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}

// CSS for fade in animation - add to global styles
const styles = `
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
`;