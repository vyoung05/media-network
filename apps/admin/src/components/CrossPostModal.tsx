'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Brand } from '@media-network/shared';

const BRAND_CONFIGS: Record<Brand, { name: string; color: string }> = {
  saucewire: { name: 'SauceWire', color: '#E63946' },
  saucecaviar: { name: 'SauceCaviar', color: '#C9A84C' },
  trapglow: { name: 'TrapGlow', color: '#8B5CF6' },
  trapfrequency: { name: 'TrapFrequency', color: '#39FF14' },
};

interface CrossPostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (selectedBrands: Brand[]) => void;
  currentBrand: Brand;
  articleTitle: string;
  loading?: boolean;
}

export function CrossPostModal({
  isOpen,
  onClose,
  onConfirm,
  currentBrand,
  articleTitle,
  loading = false,
}: CrossPostModalProps) {
  const [selectedBrands, setSelectedBrands] = useState<Brand[]>([]);

  const otherBrands = (Object.keys(BRAND_CONFIGS) as Brand[]).filter(
    (b) => b !== currentBrand
  );

  const toggleBrand = (brand: Brand) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const handleConfirm = () => {
    onConfirm(selectedBrands);
    setSelectedBrands([]);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="glass-panel w-full max-w-md mx-4 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-white/[0.06]">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                🔗 Cross-Post Article
              </h3>
              <p className="text-xs text-gray-500 mt-1 line-clamp-1">{articleTitle}</p>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4">
              <p className="text-sm text-gray-400">
                Publishing to{' '}
                <span style={{ color: BRAND_CONFIGS[currentBrand].color }} className="font-semibold">
                  {BRAND_CONFIGS[currentBrand].name}
                </span>
                . Also cross-post to:
              </p>

              <div className="space-y-2">
                {otherBrands.map((brand) => {
                  const config = BRAND_CONFIGS[brand];
                  const isSelected = selectedBrands.includes(brand);
                  return (
                    <motion.button
                      key={brand}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => toggleBrand(brand)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${
                        isSelected
                          ? 'bg-white/[0.08] border border-white/[0.12]'
                          : 'bg-white/[0.03] border border-white/[0.04] hover:bg-white/[0.06]'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                          isSelected ? 'border-transparent' : 'border-gray-600'
                        }`}
                        style={isSelected ? { backgroundColor: config.color } : undefined}
                      >
                        {isSelected && (
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: config.color }}
                      />
                      <span className="text-sm font-medium text-white">{config.name}</span>
                    </motion.button>
                  );
                })}
              </div>

              {selectedBrands.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="text-xs text-gray-500 bg-blue-500/5 border border-blue-500/10 rounded-lg px-3 py-2"
                >
                  ℹ️ Cross-posted copies will be created in {selectedBrands.length} brand
                  {selectedBrands.length > 1 ? 's' : ''} with a link back to the original.
                </motion.div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-white/[0.06] flex items-center justify-end gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
                disabled={loading}
              >
                Cancel
              </button>
              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={handleConfirm}
                disabled={loading}
                className="admin-btn-primary flex items-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Publishing...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {selectedBrands.length > 0
                      ? `Publish & Cross-Post (${selectedBrands.length + 1})`
                      : 'Publish Only'}
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
