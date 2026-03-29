import { StoreGridClient } from '@media-network/ui';
import { fetchMerchProducts } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export default async function StorePage() {
  // Fetch Trap Frequency products
  const products = await fetchMerchProducts('Trap Frequency');

  return (
    <>
      <JsonLd
        type="article"
        name="Store - TrapFrequency"
        description="TrapFrequency merchandise for music creators and audio enthusiasts."
        url="https://trapfrequency.com/store"
      />
      <StoreGridClient 
        products={products} 
        brand="Trap Frequency"
        brandConfig={{
          name: 'TrapFrequency',
          colors: {
            primary: '#39FF14',
            secondary: '#0D0D0D',
            accent: '#FFB800',
            neutral: '#4361EE',
          }
        }}
      />
    </>
  );
}

