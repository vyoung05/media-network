import type { Metadata } from 'next';
import { CartPage } from '@media-network/ui';

export const metadata: Metadata = {
  title: 'Shopping Cart',
  description: 'Review your TrapGlow merchandise selection before checkout.',
};

const brandConfig = {
  name: 'TrapGlow',
  colors: {
    primary: '#8B5CF6',   // Electric Violet
    secondary: '#0F0B2E', // Deep Navy
    accent: '#06F5D6',    // Neon Cyan
    neutral: '#F8F8FF',   // Ghost White
  },
};

export default function CartPageTrapGlow() {
  return <CartPage brandConfig={brandConfig} brand="TrapGlow" />;
}