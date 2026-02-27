import type { Metadata } from 'next';
import { SubmissionsPage } from './SubmissionsPage';

export const metadata: Metadata = {
  title: 'Submissions',
};

export default function Page() {
  return <SubmissionsPage />;
}
