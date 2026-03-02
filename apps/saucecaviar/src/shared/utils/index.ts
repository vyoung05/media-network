import { Brand, BRAND_CONFIGS } from '../types';

// ======================== FORMATTING ========================

export function formatNumber(num: number): string {
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
  return num.toString();
}

export function formatCurrency(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
}

// ======================== CLASSNAMES ========================

export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

// ======================== BRAND HELPERS ========================

export function getBrandDisplayName(brand: Brand): string {
  return BRAND_CONFIGS[brand].name;
}

export function getBrandCategories(brand: Brand): string[] {
  return BRAND_CONFIGS[brand].categories;
}

export function getBrandColor(brand: Brand, colorKey: keyof typeof BRAND_CONFIGS.saucewire.colors): string {
  return BRAND_CONFIGS[brand].colors[colorKey];
}

// ======================== VALIDATION ========================

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

// ======================== DEBOUNCE / THROTTLE ========================

export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

// ======================== STORAGE ========================

export function getLocalStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

export function setLocalStorage<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage full or unavailable
  }
}

// ======================== CATEGORY COLORS ========================

export const CATEGORY_COLORS: Record<string, string> = {
  Music: '#E63946',
  Fashion: '#8B5CF6',
  Entertainment: '#1DA1F2',
  Sports: '#39FF14',
  Tech: '#FFB800',
  'Hip-Hop': '#E63946',
  'R&B': '#8B5CF6',
  Pop: '#FF6B35',
  Electronic: '#06F5D6',
  Alternative: '#4361EE',
  Latin: '#FF6B35',
  Art: '#C9A84C',
  Culture: '#722F37',
  Lifestyle: '#F5F0E8',
  Tutorials: '#39FF14',
  Beats: '#FFB800',
  Gear: '#4361EE',
  'DAW Tips': '#39FF14',
  Samples: '#FFB800',
  Interviews: '#E0E0E0',
};

export function getCategoryColor(category: string): string {
  return CATEGORY_COLORS[category] || '#8D99AE';
}
