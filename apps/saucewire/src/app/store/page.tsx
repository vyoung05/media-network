import { StoreGridClient } from '@media-network/ui';
import { fetchMerchProducts } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Store - SauceWire',
  description: 'SauceWire digital media merchandise. Stay connected with style.',
};

export default async function StorePage() {
  const products = await fetchMerchProducts('SauceWire');

  return (
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
  );
}
