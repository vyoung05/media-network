import type { Metadata } from 'next';
import { SubmitPageClient } from './SubmitPageClient';

export const metadata: Metadata = {
  title: 'Submit',
  description: 'Submit your work to SauceCaviar Magazine. We\'re looking for writers, photographers, and artists who treat culture like art.',
};

export default function SubmitPage() {
  return <SubmitPageClient />;
}
