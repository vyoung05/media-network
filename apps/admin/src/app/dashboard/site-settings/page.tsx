import type { Metadata } from 'next';
import { SiteSettingsPage } from './SiteSettingsPage';

export const metadata: Metadata = {
  title: 'Site Settings — Brand Customization',
};

export default function Page() {
  return <SiteSettingsPage />;
}
