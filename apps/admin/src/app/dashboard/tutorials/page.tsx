import type { Metadata } from 'next';
import { TutorialsPage } from './TutorialsPage';

export const metadata: Metadata = { title: 'Tutorials' };

export default function Page() {
  return <TutorialsPage />;
}
