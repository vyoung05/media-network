import { SubmitPageClient } from './SubmitPageClient';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Submit',
  description: 'Submit your beats, tutorials, or gear reviews. Apply to write for TrapFrequency.',
};

export default function SubmitPage() {
  return <SubmitPageClient />;
}
