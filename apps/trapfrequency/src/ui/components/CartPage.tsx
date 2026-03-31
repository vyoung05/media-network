'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart, CartItem as CartItemType } from './CartContext';

interface BrandConfig {
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    neutral?: string;
  };
}

interface CartPageProps {
  brandConfig?: BrandConfig;
  brand?: string;
}

interface CartItemProps {
  item: CartItemType;
  brandConfig?: BrandConfig;
}

const CartItem: React.FC<CartItemProps> = ({ item, brandConfig }) => {
  const { updateQuantity, removeItem } = useCart();

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(item.productId, item.size);
    } else {
      updateQuantity(item.productId, item.size, newQuantity);
    }
  };

  const handleRemove = () => {
    removeItem(item.productId, item.size);
  };

  const itemTotal = item.price * item.quantity;

  const primaryColor = brandConfig?.colors.primary || '#3B82F6';
  const accentColor = brandConfig?.colors.accent || '#1D4ED8';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex items-center gap-4 p-4 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 hover:border-white/20 transition-colors duration-200"
    >
      {/* Product Image */}
      <div className="w-20 h-20 rounded overflow-hidden flex-shrink-0 bg-gray-800">
        <img 
          src={item.image}
          alt={item.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
          }}
        />
      </div>

      {/* Product Details */}
      <div className="flex-1 min-w-0">
        <h3 className="text-white font-bold text-sm mb-1 truncate">
          {item.title}
        </h3>
        <div className="text-gray-400 text-xs mb-1">
          Brand: <span className="text-white font-medium">{item.brand}</span>
        </div>
        <div className="text-gray-400 text-xs mb-2">
          Size: <span className="text-white font-bold">{item.size}</span>
        </div>
        <div className="font-bold text-sm" style={{ color: primaryColor }}>
          ${item.price.toFixed(2)} each
        </div>
      </div>

      {/* Quantity Controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => handleQuantityChange(item.quantity - 1)}
          className="w-8 h-8 bg-white/10 border border-white/20 text-white font-bold rounded transition-all duration-200"
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = primaryColor;
            e.currentTarget.style.color = brandConfig?.colors.secondary || '#000';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)';
            e.currentTarget.style.color = 'white';
          }}
        >
          -
        </button>
        
        <span className="w-12 text-center text-white font-bold">
          {item.quantity}
        </span>
        
        <button
          onClick={() => handleQuantityChange(item.quantity + 1)}
          className="w-8 h-8 bg-white/10 border border-white/20 text-white font-bold rounded transition-all duration-200"
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = primaryColor;
            e.currentTarget.style.color = brandConfig?.colors.secondary || '#000';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)';
            e.currentTarget.style.color = 'white';
          }}
        >
          +
        </button>
      </div>

      {/* Item Total */}
      <div className="text-right w-20">
        <div className="text-white font-bold text-lg">
          ${itemTotal.toFixed(2)}
        </div>
      </div>

      {/* Remove Button */}
      <button
        onClick={handleRemove}
        className="w-8 h-8 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded transition-all duration-200"
        title="Remove item"
      >
        <svg className="w-5 h-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </motion.div>
  );
};

export const CartPage: React.FC<CartPageProps> = ({ brandConfig, brand = 'Young Empire' }) => {
  const { items, total, itemCount, clearCart } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  const primaryColor = brandConfig?.colors.primary || '#3B82F6';
  const accentColor = brandConfig?.colors.accent || '#1D4ED8';

  // Estimated shipping (free over $50)
  const estimatedShipping = total > 50 ? 0 : 8.99;
  const finalTotal = total + estimatedShipping;

  const handleCheckout = async () => {
    if (items.length === 0) return;

    setIsCheckingOut(true);
    setCheckoutError(null);
    
    try {
      // Build items for checkout server
      const checkoutItems = items.map(item => ({
        printful_variant_id: item.printfulVariantId,
        quantity: item.quantity,
      }));

      // Validate all items have Printful variant IDs
      const missingVariants = items.filter(item => !item.printfulVariantId);
      if (missingVariants.length > 0) {
        throw new Error(`Some items are missing variant info. Please remove and re-add: ${missingVariants.map(i => i.title).join(', ')}`);
      }

      const response = await fetch('https://checkout-server-pi.vercel.app/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: checkoutItems }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Checkout failed. Please try again.');
      }

      if (data.checkout_url) {
        // Redirect to Stripe Checkout
        window.location.href = data.checkout_url;
      } else {
        throw new Error('No checkout URL returned. Please try again.');
      }
      
    } catch (error: any) {
      console.error('Checkout error:', error);
      setCheckoutError(error?.message || 'Checkout failed. Please try again.');
      setIsCheckingOut(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-24 pb-12 px-6" style={{ background: brandConfig?.colors.secondary || '#000' }}>
        <div className="max-w-4xl mx-auto text-center">
          {/* Empty Cart State */}
          <div className="py-16">
            <div className="text-6xl mb-6">🛒</div>
            <h1 className="text-3xl font-bold text-white mb-4">Your Cart is Empty</h1>
            <p className="text-gray-400 text-lg mb-8">
              Time to rep the {brandConfig?.name || brand}! Check out our latest merch drops.
            </p>
            <Link
              href="/store"
              className="inline-block px-8 py-3 rounded font-bold text-lg text-white hover:opacity-90 transition-all"
              style={{ backgroundColor: primaryColor }}
            >
              SHOP MERCH
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-6" style={{ background: brandConfig?.colors.secondary || '#000' }}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Your Cart
          </h1>
          <p className="text-gray-400">
            {itemCount} item{itemCount !== 1 ? 's' : ''} ready to checkout
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">Items</h2>
              <button
                onClick={clearCart}
                className="text-red-400 hover:text-red-300 text-sm transition-colors"
              >
                Clear Cart
              </button>
            </div>
            
            <motion.div className="space-y-4">
              <AnimatePresence>
                {items.map((item, index) => (
                  <CartItem 
                    key={`${item.productId}-${item.size}-${index}`} 
                    item={item}
                    brandConfig={brandConfig}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 p-6 sticky top-24">
              <h2 className="text-xl font-bold text-white mb-6">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-400">
                  <span>Subtotal</span>
                  <span className="text-white">${total.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between text-gray-400">
                  <span>Shipping</span>
                  <span className="text-white">
                    {estimatedShipping === 0 ? 'FREE' : `$${estimatedShipping.toFixed(2)}`}
                  </span>
                </div>
                
                <div className="border-t border-white/20 pt-3">
                  <div className="flex justify-between text-lg font-bold">
                    <span className="text-white">Total</span>
                    <span style={{ color: primaryColor }}>${finalTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Free Shipping Notice */}
              {estimatedShipping > 0 && (
                <div className="border rounded p-3 mb-4" style={{ 
                  backgroundColor: `${accentColor}20`, 
                  borderColor: `${accentColor}30` 
                }}>
                  <div className="text-xs font-bold" style={{ color: accentColor }}>
                    Add ${(50 - total).toFixed(2)} more for FREE shipping!
                  </div>
                </div>
              )}

              {/* Checkout Error */}
              {checkoutError && (
                <div className="bg-red-500/20 border border-red-500/40 rounded p-3 mb-4">
                  <p className="text-red-400 text-sm font-medium">{checkoutError}</p>
                  <button 
                    onClick={() => setCheckoutError(null)}
                    className="text-red-300 text-xs underline mt-1"
                  >
                    Dismiss
                  </button>
                </div>
              )}

              {/* Checkout Button */}
              <button
                onClick={handleCheckout}
                disabled={isCheckingOut || items.length === 0}
                className="w-full py-3 px-6 rounded font-bold text-lg text-white hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed mb-4"
                style={{ backgroundColor: primaryColor }}
              >
                {isCheckingOut ? 'Processing...' : `Checkout - $${finalTotal.toFixed(2)}`}
              </button>

              {/* Continue Shopping */}
              <Link
                href="/store"
                className="block w-full text-center text-sm transition-colors"
                style={{ color: primaryColor }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = primaryColor;
                }}
              >
                ← Continue Shopping
              </Link>

              {/* Security Notice */}
              <div className="mt-6 text-xs text-gray-500 text-center">
                <div className="flex items-center justify-center gap-1 mb-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  <span>Secure Ordering</span>
                </div>
                <p>Your information is protected and secure.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recommended Products */}
        <div className="mt-12 text-center rounded-lg p-8 border border-white/10" style={{
          background: `linear-gradient(135deg, ${accentColor}20, ${primaryColor}20)`
        }}>
          <h2 className="text-2xl font-bold text-white mb-4">Complete Your Look</h2>
          <p className="text-gray-400 mb-6">
            Check out our other Young Empire brands while you're here.
          </p>
          <Link
            href="/store"
            className="bg-white/10 text-white px-6 py-3 rounded font-bold hover:bg-white/20 transition-all"
          >
            SHOP MORE
          </Link>
        </div>
      </div>
    </div>
  );
};