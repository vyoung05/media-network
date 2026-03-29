import { StorePageClient } from '@/components/StorePageClient';
import { fetchMerchProducts } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Store - TrapGlow',
  description: 'Premium TrapGlow merchandise. Empower your glow-up journey with style.',
};

export default async function StorePage() {
  const products = await fetchMerchProducts('Trap Glow');

  return (
    <StorePageClient 
      products={products} 
      brandName="Trap Glow"
      brandColors={{
        primary: '#8B5CF6',
        secondary: '#0F0B2E',
        accent: '#06F5D6',
      }}
    />
  );
}
