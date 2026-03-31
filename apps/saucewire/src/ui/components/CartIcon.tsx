'use client';

import React from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from './CartContext';

interface CartIconProps {
  className?: string;
  primaryColor?: string;
}

export const CartIcon: React.FC<CartIconProps> = ({ 
  className = '', 
  primaryColor = '#3B82F6' 
}) => {
  const { itemCount } = useCart();

  return (
    <Link
      href="/cart"
      className={`relative group transition-all duration-300 ${className}`}
    >
      {/* Cart Icon */}
      <div className="relative p-2 rounded-lg hover:bg-white/5 transition-colors duration-200">
        <svg 
          className="w-6 h-6 text-white/70 group-hover:text-white transition-colors duration-200" 
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

        {/* Item Count Badge */}
        <AnimatePresence>
          {itemCount > 0 && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ 
                type: 'spring',
                stiffness: 500,
                damping: 30,
                duration: 0.2 
              }}
              className="absolute -top-1 -right-1 min-w-[20px] h-5 flex items-center justify-center rounded-full text-xs font-bold text-white shadow-lg"
              style={{ backgroundColor: primaryColor }}
            >
              <motion.span
                key={itemCount}
                initial={{ scale: 1.5 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.1 }}
              >
                {itemCount > 99 ? '99+' : itemCount}
              </motion.span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Link>
  );
};