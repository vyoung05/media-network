import type { Metadata } from 'next';
import { SiteSettingsPage } from './SiteSettingsPage';
import { AdminGuard } from '@/components/AdminGuard';

export const metadata: Metadata = {
  title: 'Site Settings — Brand Customization',
};

export default function Page() {
  return <AdminGuard><SiteSettingsPage /></AdminGuard>;
}
