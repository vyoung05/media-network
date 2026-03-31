import type { Metadata } from 'next';
import { CartPage } from '@media-network/ui';

export const metadata: Metadata = {
  title: 'Shopping Cart',
  description: 'Review your TrapFrequency merchandise selection before checkout.',
};

const brandConfig = {
  name: 'TrapFrequency',
  colors: {
    primary: '#39FF14',   // Frequency Green
    secondary: '#0D0D0D', // Studio Black
    accent: '#FFB800',    // Amber
    neutral: '#E0E0E0',   // Light Gray
  },
};

export default function CartPageTrapFrequency() {
  return <CartPage brandConfig={brandConfig} brand="TrapFrequency" />;
}