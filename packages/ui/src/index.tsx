// @media-network/ui — barrel exports
export { ArticleCard } from './components/ArticleCard';
export { SubmissionForm, type SubmissionFormData } from './components/SubmissionForm';
export { BreakingBanner } from './components/BreakingBanner';
export { CategoryFilter } from './components/CategoryFilter';
export { NewsFeed } from './components/NewsFeed';
export { Loading, ArticleCardSkeleton, WireSkeleton, FeedSkeleton } from './components/Loading';
export { ShareCard } from './components/ShareCard';
export { StoreGrid, StoreGridClient } from './components/StoreGrid';
export { ProductModal } from './components/ProductModal';
// TShirtViewer3D intentionally NOT exported here — Three.js bundle crashes on load
// Import directly from './components/TShirtViewer3D' only where needed (e.g. /store-3d page)

// Cart system components
export { CartProvider, useCart, type CartItem } from './components/CartContext';
export { CartIcon } from './components/CartIcon';
export { CartPage } from './components/CartPage';
