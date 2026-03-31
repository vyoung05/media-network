# 3D T-Shirt Product Viewer

Interactive 3D t-shirt viewer for Young Empire merch stores.

## Components

### ProductModal
Full-screen modal with 3D viewer and product details.

```tsx
import { ProductModal } from '@media-network/ui';

<ProductModal
  product={product}
  brandConfig={brandConfig}
  isOpen={isModalOpen}
  onClose={handleCloseModal}
/>
```

### TShirtViewer3D
3D t-shirt component with design texture mapping.

```tsx
import { TShirtViewer3D } from '@media-network/ui';

<TShirtViewer3D 
  designImageUrl={product.images[0]}
  brandColor={brandConfig.colors.primary}
/>
```

### Updated StoreGrid
Now supports clicking product images to open 3D modal.

```tsx
import { StoreGrid } from '@media-network/ui';

<StoreGrid 
  products={products}
  brandConfig={brandConfig}
  onProductClick={handleProductClick}
/>
```

## Features

- **Interactive 3D Model**: Click and drag to rotate, scroll to zoom
- **Design Texture Mapping**: Product images mapped onto t-shirt geometry
- **Auto-rotate**: Gentle rotation when not interacting
- **Size Selection**: Interactive size selector with brand styling
- **Responsive Design**: Works on desktop and mobile
- **Contact Integration**: Direct email integration for orders
- **Brand Theming**: Supports all Young Empire brand configurations

## Technical Details

- **Three.js**: 3D rendering engine
- **@react-three/fiber**: React Three.js renderer
- **@react-three/drei**: Three.js helpers (OrbitControls, Environment, ContactShadows)
- **Dynamic Import**: SSR-safe loading with Next.js dynamic imports
- **Performance**: Lazy loading, efficient geometry, optimized textures

## Dependencies

```json
{
  "three": "^0.183.2",
  "@react-three/fiber": "^9.5.0", 
  "@react-three/drei": "^10.7.7",
  "@types/three": "^0.183.1"
}
```

## Usage Notes

- All components are 'use client' for Three.js compatibility
- Modal uses backdrop blur and full-screen overlay
- T-shirt body is always black (brand requirement)
- Design texture is mapped to front panel of t-shirt
- Brand color is used for accent elements (collar tag, buttons)
- Size selector highlights selected option with brand colors
- Contact button opens email client with pre-filled product details

## Future Enhancements

- Multiple t-shirt angles/views
- Real 3D t-shirt model import
- Animation sequences
- Color variation preview
- Size fit visualization
- VR/AR support