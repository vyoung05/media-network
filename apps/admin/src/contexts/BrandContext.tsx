'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import type { Brand } from '@media-network/shared';

type BrandFilter = Brand | 'all';

interface BrandContextType {
  activeBrand: BrandFilter;
  setActiveBrand: (brand: BrandFilter) => void;
}

const BrandContext = createContext<BrandContextType | undefined>(undefined);

export function BrandProvider({ children }: { children: React.ReactNode }) {
  const [activeBrand, setActiveBrandState] = useState<BrandFilter>('all');

  const setActiveBrand = useCallback((brand: BrandFilter) => {
    setActiveBrandState(brand);
  }, []);

  return (
    <BrandContext.Provider value={{ activeBrand, setActiveBrand }}>
      {children}
    </BrandContext.Provider>
  );
}

export function useBrand() {
  const context = useContext(BrandContext);
  if (!context) {
    throw new Error('useBrand must be used within a BrandProvider');
  }
  return context;
}
