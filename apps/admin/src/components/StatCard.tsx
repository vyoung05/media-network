'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface StatCardProps {
  label: string;
  value: string | number;
  change: string;
  changeType: 'up' | 'down' | 'neutral';
  icon: React.ReactNode;
  color: string;
  index?: number;
}

export function StatCard({ label, value, change, changeType, icon, color, index = 0 }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
      className="stat-card group cursor-default"
    >
      <div className="flex items-start justify-between mb-4">
        <motion.div
          whileHover={{ scale: 1.1, rotate: 3 }}
          transition={{ type: 'spring', stiffness: 400, damping: 15 }}
          className="w-10 h-10 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: `${color}15` }}
        >
          <div style={{ color }}>{icon}</div>
        </motion.div>
        <span
          className={`text-xs font-mono px-2 py-0.5 rounded-full ${
            changeType === 'up'
              ? 'bg-emerald-500/10 text-emerald-400'
              : changeType === 'down'
              ? 'bg-red-500/10 text-red-400'
              : 'bg-gray-500/10 text-gray-400'
          }`}
        >
          {changeType === 'up' ? '↑' : changeType === 'down' ? '↓' : '–'} {change}
        </span>
      </div>
      <motion.p
        className="text-2xl font-bold text-white mb-1"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: index * 0.06 + 0.2, type: 'spring', stiffness: 200 }}
      >
        {value}
      </motion.p>
      <p className="text-sm text-gray-500">{label}</p>
    </motion.div>
  );
}
