'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { TutorialForm } from '@/components/forms/TutorialForm';

export default function NewTutorialPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (data: any) => {
    setSaving(true);
    setError('');
    try {
      const res = await fetch('/api/tutorials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Failed to create tutorial');
      }
      router.push('/dashboard/tutorials');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">New Tutorial</h1>
          <p className="text-sm text-gray-500 mt-0.5">Create a new production tutorial</p>
        </div>
        <button onClick={() => router.back()} className="admin-btn-ghost text-xs">← Back</button>
      </motion.div>
      {error && <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg"><p className="text-sm text-red-400">{error}</p></div>}
      <TutorialForm onSubmit={handleSubmit} saving={saving} />
    </div>
  );
}
