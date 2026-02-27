import { TutorialsPageClient } from './TutorialsPageClient';
import { mockTutorials } from '@/lib/mock-data';

export const metadata = {
  title: 'Tutorials',
  description: 'Step-by-step music production tutorials for FL Studio, Ableton Live, Logic Pro, and more. From beginner to master level.',
};

export default function TutorialsPage() {
  return <TutorialsPageClient tutorials={mockTutorials} />;
}
