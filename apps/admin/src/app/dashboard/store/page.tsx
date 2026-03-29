'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useBrand } from '@/contexts/BrandContext';
import { getSupabaseBrowserClient } from '@/lib/supabase';
import type { MerchProduct } from '@media-network/shared';

export default function StorePage() {
  const { selectedBrand } = useBrand();
  const [products, setProducts] = useState<MerchProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadProducts();
  }, [selectedBrand]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError('');
      const supabase = getSupabaseBrowserClient();
      
      let query = supabase
        .from('merch_products')
        .select('*')
        .order('created_at', { ascending: false });
      
      // Filter by brand if not 'all'
      if (selectedBrand && selectedBrand !== 'all') {
        const brandName = getBrandDisplayName(selectedBrand);
        query = query.eq('brand', brandName);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      setProducts(data || []);
    } catch (err) {
      console.error('Error loading products:', err);
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const getBrandDisplayName = (brand: string) => {
    const brandMap: Record<string, string> = {
      'saucecaviar': 'Sauce Caviar',
      'trapglow': 'Trap Glow', 
      'trapfrequency': 'Trap Frequency',
      'saucewire': 'SauceWire',
    };
    return brandMap[brand] || brand;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400 bg-green-400/10';
      case 'inactive': return 'text-gray-400 bg-gray-400/10';
      case 'sold_out': return 'text-red-400 bg-red-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="glass-panel p-6">
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-gray-400">Loading store products...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="glass-panel p-6">
          <div className="text-center py-12">
            <p className="text-red-400 mb-4">{error}</p>
            <button
              onClick={loadProducts}
              className="btn-primary"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Store Products</h1>
          <p className="text-gray-400 mt-1">
            Manage products for {selectedBrand === 'all' ? 'all brands' : getBrandDisplayName(selectedBrand)}
          </p>
        </div>
        <Link
          href="/dashboard/store/new"
          className="btn-primary inline-flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Product
        </Link>
      </div>

      {/* Products Grid */}
      {products.length === 0 ? (
        <div className="glass-panel p-8">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-500/10 flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">No products yet</h3>
            <p className="text-gray-400 mb-4">
              Get started by adding your first product to the store.
            </p>
            <Link
              href="/dashboard/store/new"
              className="btn-primary inline-flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add First Product
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="glass-panel p-6 hover:bg-white/[0.03] transition-all duration-300"
            >
              {/* Product Image */}
              <div className="aspect-square mb-4 rounded-lg overflow-hidden bg-gray-800">
                {product.images && product.images.length > 0 ? (
                  <img
                    src={product.images[0]}
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <svg className="w-12 h-12 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold text-white text-lg leading-tight">
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
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(product.status)}`}>
                    {product.status.replace('_', ' ')}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{product.brand}</span>
                  <span>{product.category}</span>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Link
                    href={`/dashboard/store/${product.id}/edit`}
                    className="flex-1 btn-secondary text-center"
                  >
                    Edit
                  </Link>
                  <button className="px-3 py-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                    </svg>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}