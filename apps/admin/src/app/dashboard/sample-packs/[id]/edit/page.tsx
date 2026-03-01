'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { SamplePackForm } from '@/components/forms/SamplePackForm';

export default function EditSamplePackPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [initialData, setInitialData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`/api/sample-packs/${id}`).then((r) => r.json()).then(setInitialData).catch((e) => setError(e.message)).finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (data: any) => {
    setSaving(true); setError('');
    try {
      const res = await fetch(`/api/sample-packs/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
      if (!res.ok) { const err = await res.json().catch(() => ({})); throw new Error(err.error || 'Failed to update'); }
      router.push('/dashboard/sample-packs');
    } catch (err: any) { setError(err.message); }
    finally { setSaving(false); }
  };

  if (loading) return <div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Edit Sample Pack</h1>
          <p className="text-sm text-gray-500 mt-0.5">{initialData?.title || 'Loading...'}</p>
        </div>
        <button onClick={() => router.back()} className="admin-btn-ghost text-xs">← Back</button>
      </motion.div>
      {error && <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg"><p className="text-sm text-red-400">{error}</p></div>}
      {initialData && <SamplePackForm initialData={initialData} onSubmit={handleSubmit} saving={saving} />}
    </div>
  );
}
