import type { Metadata } from 'next';
import { CartPage } from '@media-network/ui';

export const metadata: Metadata = {
  title: 'Shopping Cart',
  description: 'Review your SauceWire merchandise selection before checkout.',
};

const brandConfig = {
  name: 'SauceWire',
  colors: {
    primary: '#E63946',   // Signal Red
    secondary: '#111111', // Ink Black
    accent: '#1DA1F2',    // Electric Blue
    neutral: '#8D99AE',   // Steel Gray
  },
};

export default function CartPageSauceWire() {
  return <CartPage brandConfig={brandConfig} brand="SauceWire" />;
}