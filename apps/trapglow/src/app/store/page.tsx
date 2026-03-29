import { StorePageClient } from '@/components/StorePageClient';
import { fetchMerchProducts } from '@/lib/supabase';
import { JsonLd } from '@media-network/shared';

export const dynamic = 'force-dynamic';

export default async function StorePage() {
  // Fetch Trap Glow products
  const products = await fetchMerchProducts('Trap Glow');

  return (
    <>
      <JsonLd
        type="webpage"
        name="Store - TrapGlow"
        description="Premium TrapGlow merchandise. Empower your glow-up journey with style."
        url="https://trapglow.com/store"
      />
      <StorePageClient 
        products={products} 
        brandName="Trap Glow"
        brandColors={{
          primary: '#8B5CF6',
          secondary: '#0F0B2E',
          accent: '#06F5D6',
        }}
      />
    </>
  );
}