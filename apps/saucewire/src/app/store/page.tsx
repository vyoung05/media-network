import { StoreGridClient } from '@media-network/ui';
import { fetchMerchProducts } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export default async function StorePage() {
  // Fetch SauceWire products
  const products = await fetchMerchProducts('SauceWire');

  return (
    <>
      <JsonLd
        type="article"
        name="Store - SauceWire"
        description="SauceWire digital media merchandise. Stay connected with style."
        url="https://saucewire.com/store"
      />
      <StoreGridClient 
        products={products} 
        brand="SauceWire"
        brandConfig={{
          name: 'SauceWire',
          colors: {
            primary: '#E63946',
            secondary: '#111111',
            accent: '#1DA1F2',
            neutral: '#8D99AE',
          }
        }}
      />
    </>
  );
}

