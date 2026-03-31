'use client';

import React, { useState, useRef } from 'react';
import type { MerchProduct } from '@media-network/shared';
import { useCart } from './CartContext';

interface BrandConfig {
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    neutral: string;
  };
}

interface ProductModalProps {
  product: MerchProduct;
  brandConfig?: BrandConfig;
  isOpen: boolean;
  onClose: () => void;
}

// 3D viewer removed from modal — was crashing due to Three.js compatibility issues
// 3D viewer still available as standalone on /store-3d test page

export function ProductModal({ product, brandConfig, isOpen, onClose }: ProductModalProps) {
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes?.[0] || '');
  const [quantity, setQuantity] = useState<number>(1);
  const [addingToCart, setAddingToCart] = useState<boolean>(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const { addItem } = useCart();

  const primaryColor = brandConfig?.colors.primary || '#3B82F6';
  const accentColor = brandConfig?.colors.accent || '#1D4ED8';

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === modalRef.current) {
      onClose();
    }
  };

  const handleAddToCart = async () => {
    if (!selectedSize && product.sizes && product.sizes.length > 0) {
      alert('Please select a size first');
      return;
    }

    setAddingToCart(true);
    
    try {
      const cartItem = {
        productId: product.id,
        title: product.title,
        image: product.images?.[0] || '',
        size: selectedSize || 'One Size',
        quantity: quantity,
        price: product.price,
        brand: product.brand,
        printfulVariantId: product.printful_variant_ids[selectedSize] || undefined,
      };

      addItem(cartItem);
      
      // Show success feedback (could be replaced with a toast notification)
      setTimeout(() => {
        onClose();
      }, 500);
      
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add item to cart. Please try again.');
    } finally {
      setAddingToCart(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      ref={modalRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div className="relative w-full h-full max-w-7xl max-h-screen mx-4 my-4 bg-gray-900 rounded-xl overflow-hidden border border-gray-700 flex">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 bg-black bg-opacity-50 hover:bg-opacity-70 rounded-full flex items-center justify-center text-white transition-colors duration-200"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Left Side - Product Image */}
        <div className="flex-1 h-full bg-gradient-to-br from-gray-800 to-gray-900 relative flex items-center justify-center p-8">
          {product.images?.[0] ? (
            <img
              src={product.images[0]}
              alt={product.title}
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
            />
          ) : (
            <div className="text-center text-gray-400">
              <div className="text-6xl mb-4">👕</div>
              <p className="text-lg">Product Preview</p>
            </div>
          )}
        </div>

        {/* Right Side - Product Details */}
        <div className="w-full max-w-md bg-gray-900 p-8 flex flex-col">
          
          {/* Brand Badge */}
          {product.brand && (
            <div className="mb-6">
              <span 
                className="inline-block px-3 py-1 text-sm font-medium rounded-full text-white"
                style={{ backgroundColor: primaryColor }}
              >
                {product.brand}
              </span>
            </div>
          )}

          {/* Product Title & Description */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-white mb-3">
              {product.title}
            </h1>
            {product.description && (
              <p className="text-gray-400 leading-relaxed">
                {product.description}
              </p>
            )}
          </div>

          {/* Price */}
          <div className="mb-6">
            <span className="text-4xl font-bold text-white">
              {formatPrice(product.price)}
            </span>
          </div>

          {/* Size Selector */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="mb-6">
              <h3 className="text-white font-semibold mb-3">Size</h3>
              <div className="grid grid-cols-4 gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`
                      py-3 px-2 text-center font-medium rounded-lg border-2 transition-all duration-200
                      ${selectedSize === size 
                        ? 'border-current text-white' 
                        : 'border-gray-600 text-gray-400 hover:border-gray-500'
                      }
                    `}
                    style={selectedSize === size ? { 
                      borderColor: primaryColor,
                      backgroundColor: `${primaryColor}20` 
                    } : {}}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity Selector */}
          <div className="mb-8">
            <h3 className="text-white font-semibold mb-3">Quantity</h3>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 bg-gray-700 text-white font-bold rounded-lg hover:bg-gray-600 transition-colors"
              >
                -
              </button>
              <span className="w-12 text-center text-white font-bold text-lg">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 bg-gray-700 text-white font-bold rounded-lg hover:bg-gray-600 transition-colors"
              >
                +
              </button>
            </div>
          </div>

          {/* Category */}
          <div className="mb-8">
            <span className="inline-block px-3 py-1 text-xs text-gray-400 border border-gray-600 rounded-full">
              {product.category.replace('_', ' ').toUpperCase()}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex-1 flex flex-col justify-end space-y-4">
            <button
              onClick={handleAddToCart}
              disabled={addingToCart || (product.sizes && product.sizes.length > 0 && !selectedSize)}
              style={{ 
                background: `linear-gradient(135deg, ${primaryColor}, ${accentColor})`,
              }}
              className="w-full py-4 text-white font-bold rounded-lg hover:opacity-90 transition-opacity text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {addingToCart ? 'Adding to Cart...' : `Add to Cart - ${formatPrice(product.price * quantity)}`}
            </button>
            
            <div className="text-center">
              <p className="text-xs text-gray-500">
                Secure checkout • Fast shipping • Premium quality
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}