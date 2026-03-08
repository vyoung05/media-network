import type { Metadata } from 'next';
import { SettingsPage } from './SettingsPage';
import { AdminGuard } from '@/components/AdminGuard';

export const metadata: Metadata = {
  title: 'Settings',
};

export default function Page() {
  return <AdminGuard><SettingsPage /></AdminGuard>;
}
