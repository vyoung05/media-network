import { StorePageClient } from '@/components/StorePageClient';
import { fetchMerchProducts } from '@/lib/supabase';
import { JsonLd } from '@media-network/shared';

export const dynamic = 'force-dynamic';

export default async function StorePage() {
  // Fetch Sauce Caviar products
  const products = await fetchMerchProducts('Sauce Caviar');

  return (
    <>
      <JsonLd
        type="webpage"
        name="Store - SauceCaviar"
        description="Premium SauceCaviar merchandise. Culture served on premium apparel and accessories."
        url="https://saucecaviar.com/store"
      />
      <StorePageClient 
        products={products} 
        brandName="Sauce Caviar"
        brandColors={{
          primary: '#C9A84C',
          secondary: '#0A0A0A',
          accent: '#F5F0E8',
        }}
      />
    </>
  );
}