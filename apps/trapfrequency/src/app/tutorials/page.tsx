import { TutorialsPageClient } from './TutorialsPageClient';
import { getTutorials } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Tutorials',
  description: 'Step-by-step music production tutorials for FL Studio, Ableton Live, Logic Pro, and more. From beginner to master level.',
};

export default async function TutorialsPage() {
  const tutorials = await getTutorials();
  return <TutorialsPageClient tutorials={tutorials} />;
}
