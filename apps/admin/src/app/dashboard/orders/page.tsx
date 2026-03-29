'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getSupabaseBrowserClient } from '@/lib/supabase';
import type { MerchOrder } from '@media-network/shared';

export default function OrdersPage() {
  const [orders, setOrders] = useState<MerchOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<'all' | 'pending' | 'paid' | 'shipped' | 'cancelled'>('all');

  useEffect(() => {
    loadOrders();
  }, [filter]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError('');
      const supabase = getSupabaseBrowserClient();
      
      let query = supabase
        .from('merch_orders')
        .select('*')
        .order('created_at', { ascending: false });
      
      // Apply filter
      if (filter !== 'all') {
        query = query.eq('status', filter);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      setOrders(data || []);
    } catch (err) {
      console.error('Error loading orders:', err);
      setError('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-400 bg-yellow-400/10';
      case 'paid': return 'text-blue-400 bg-blue-400/10';
      case 'fulfilling': return 'text-purple-400 bg-purple-400/10';
      case 'shipped': return 'text-green-400 bg-green-400/10';
      case 'delivered': return 'text-emerald-400 bg-emerald-400/10';
      case 'cancelled': return 'text-red-400 bg-red-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  const getFilterCounts = () => {
    return {
      all: orders.length,
      pending: orders.filter(o => o.status === 'pending').length,
      paid: orders.filter(o => o.status === 'paid').length,
      shipped: orders.filter(o => o.status === 'shipped').length,
      cancelled: orders.filter(o => o.status === 'cancelled').length,
    };
  };

  const filteredOrders = filter === 'all' ? orders : orders.filter(order => order.status === filter);
  const counts = getFilterCounts();

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="glass-panel p-6">
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-gray-400">Loading orders...</p>
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
              onClick={loadOrders}
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
          <h1 className="text-2xl font-bold text-white">Orders</h1>
          <p className="text-gray-400 mt-1">
            Manage store orders across all brands
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="glass-panel p-1">
        <div className="flex flex-wrap gap-1">
          {[
            { key: 'all', label: 'All Orders', count: counts.all },
            { key: 'pending', label: 'Pending', count: counts.pending },
            { key: 'paid', label: 'Paid', count: counts.paid },
            { key: 'shipped', label: 'Shipped', count: counts.shipped },
            { key: 'cancelled', label: 'Cancelled', count: counts.cancelled },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key as any)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                filter === tab.key
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {tab.label}
              {tab.count > 0 && (
                <span className={`px-1.5 py-0.5 text-xs rounded-full ${
                  filter === tab.key
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-300'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="glass-panel p-8">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-500/10 flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">No orders found</h3>
            <p className="text-gray-400">
              {filter === 'all' 
                ? "No orders have been placed yet."
                : `No ${filter} orders at the moment.`
              }
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="glass-panel p-6 hover:bg-white/[0.03] transition-all duration-300"
            >
              <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                {/* Order Info */}
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-white">
                      Order #{order.id.slice(-8).toUpperCase()}
                    </h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {order.status.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm">
                    {order.email} • {formatDate(order.created_at)}
                  </p>
                  <div className="text-sm text-gray-300">
                    {order.items.length} item{order.items.length !== 1 ? 's' : ''} • {formatPrice(order.total)}
                  </div>
                </div>

                {/* Items Preview */}
                <div className="flex-1 max-w-md">
                  <div className="text-sm text-gray-400 mb-1">Items:</div>
                  <div className="space-y-1">
                    {order.items.slice(0, 2).map((item, index) => (
                      <div key={index} className="text-sm text-gray-300">
                        {item.quantity}x {item.title} ({item.size}) - {formatPrice(item.price)}
                      </div>
                    ))}
                    {order.items.length > 2 && (
                      <div className="text-xs text-gray-500">
                        +{order.items.length - 2} more item{order.items.length - 2 !== 1 ? 's' : ''}
                      </div>
                    )}
                  </div>
                </div>

                {/* Tracking Info */}
                <div className="flex-1 max-w-sm">
                  {order.tracking_number ? (
                    <div className="space-y-1">
                      <div className="text-sm text-gray-400">Tracking:</div>
                      <div className="text-sm font-mono text-blue-400">
                        {order.tracking_number}
                      </div>
                      {order.tracking_url && (
                        <a
                          href={order.tracking_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-400 hover:text-blue-300 underline"
                        >
                          Track Package
                        </a>
                      )}
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500">
                      No tracking info yet
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                  <button className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Shipping Address (if available) */}
              {order.shipping_address && (
                <div className="mt-4 pt-4 border-t border-white/10">
                  <div className="text-sm">
                    <span className="text-gray-400">Ship to:</span>
                    <span className="text-gray-300 ml-2">
                      {order.shipping_address.name}, {order.shipping_address.line1}, {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.postal_code}
                    </span>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}