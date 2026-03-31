import { StoreGridClient } from '@/ui';
import type { MerchProduct } from '@media-network/shared';

export const metadata = {
  title: '3D Store - SauceCaviar',
  description: 'Premium SauceCaviar merchandise with 3D interactive viewer.',
};

// Mock products for testing
const mockProducts: MerchProduct[] = [
  {
    id: '1',
    title: 'Sauce Caviar Essential Tee',
    description: 'Premium black t-shirt with signature Sauce Caviar branding. Made from 100% organic cotton.',
    brand: 'Sauce Caviar',
    price: 45,
    images: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
      'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=400'
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    printful_product_id: null,
    printful_variant_ids: {},
    status: 'active',
    category: 'tee',
    created_at: '2026-03-31T00:00:00.000Z',
    updated_at: '2026-03-31T00:00:00.000Z'
  },
  {
    id: '2',
    title: 'Culture Caviar Hoodie',
    description: 'Luxury hoodie featuring embossed logo and premium fleece lining.',
    brand: 'Sauce Caviar',
    price: 85,
    images: [
      'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    printful_product_id: null,
    printful_variant_ids: {},
    status: 'active',
    category: 'hoodie',
    created_at: '2026-03-31T00:00:00.000Z',
    updated_at: '2026-03-31T00:00:00.000Z'
  },
  {
    id: '3',
    title: 'Golden Standard Tank',
    description: 'Sleeveless tank with metallic gold accents. Perfect for summer vibes.',
    brand: 'Sauce Caviar',
    price: 35,
    images: [
      'https://images.unsplash.com/photo-1622445275576-721325763afe?w=400'
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    printful_product_id: null,
    printful_variant_ids: {},
    status: 'active',
    category: 'tank',
    created_at: '2026-03-31T00:00:00.000Z',
    updated_at: '2026-03-31T00:00:00.000Z'
  }
];

export default function Store3DPage() {
  return (
    <StoreGridClient 
      products={mockProducts}
      brand="Sauce Caviar"
      brandConfig={{
        name: 'SauceCaviar',
        colors: {
          primary: '#C9A84C',
          secondary: '#0A0A0A',
          accent: '#F5F0E8',
          neutral: '#722F37'
        }
      }}
    />
  );
}