import type { Metadata } from 'next';
import { CartPage } from '@media-network/ui';

export const metadata: Metadata = {
  title: 'Shopping Cart',
  description: 'Review your SauceCaviar merchandise selection before checkout.',
};

const brandConfig = {
  name: 'SauceCaviar',
  colors: {
    primary: '#C9A84C',   // Champagne Gold
    secondary: '#0A0A0A', // Deep Black
    accent: '#F5F0E8',    // Ivory Cream
    neutral: '#2D2D2D',   // Charcoal
  },
};

export default function CartPageSauceCaviar() {
  return <CartPage brandConfig={brandConfig} brand="SauceCaviar" />;
}