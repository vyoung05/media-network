import { StorePageClient } from '@/components/StorePageClient';
import { fetchMerchProducts } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Store - SauceCaviar',
  description: 'Premium SauceCaviar merchandise. Culture served on premium apparel and accessories.',
};

export default async function StorePage() {
  const products = await fetchMerchProducts('Sauce Caviar');

  return (
    <StorePageClient 
      products={products} 
      brandName="Sauce Caviar"
      brandColors={{
        primary: '#C9A84C',
        secondary: '#0A0A0A',
        accent: '#F5F0E8',
      }}
    />
  );
}