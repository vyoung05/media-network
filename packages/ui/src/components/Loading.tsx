'use client';

import React from 'react';

interface LoadingProps {
  text?: string;
  fullPage?: boolean;
}

export function Loading({ text = 'Loading...', fullPage = false }: LoadingProps) {
  const content = (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="relative w-10 h-10">
        <div className="absolute inset-0 border-2 border-neutral/20 rounded-full" />
        <div className="absolute inset-0 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
      <p className="text-sm font-mono text-neutral">{text}</p>
    </div>
  );

  if (fullPage) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-secondary/80 backdrop-blur-sm z-50">
        {content}
      </div>
    );
  }

  return <div className="py-16 flex items-center justify-center">{content}</div>;
}

export function ArticleCardSkeleton() {
  return (
    <div className="bg-surface rounded-lg overflow-hidden">
      <div className="aspect-video bg-gray-800 relative overflow-hidden">
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-gray-700/30 to-transparent" />
      </div>
      <div className="p-4 space-y-3">
        <div className="flex gap-2">
          <div className="h-4 w-16 bg-gray-700 rounded relative overflow-hidden">
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite_0.1s] bg-gradient-to-r from-transparent via-gray-600/30 to-transparent" />
          </div>
          <div className="h-4 w-12 bg-gray-700 rounded relative overflow-hidden">
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite_0.2s] bg-gradient-to-r from-transparent via-gray-600/30 to-transparent" />
          </div>
        </div>
        <div className="h-6 w-3/4 bg-gray-700 rounded relative overflow-hidden">
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite_0.3s] bg-gradient-to-r from-transparent via-gray-600/30 to-transparent" />
        </div>
        <div className="h-4 w-full bg-gray-700 rounded relative overflow-hidden">
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite_0.4s] bg-gradient-to-r from-transparent via-gray-600/30 to-transparent" />
        </div>
        <div className="h-4 w-2/3 bg-gray-700 rounded relative overflow-hidden">
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite_0.5s] bg-gradient-to-r from-transparent via-gray-600/30 to-transparent" />
        </div>
      </div>
    </div>
  );
}

export function WireSkeleton() {
  return (
    <div className="border-b border-gray-800 py-4 px-4">
      <div className="flex items-start gap-3">
        <div className="flex-1 space-y-2">
          <div className="flex gap-2">
            <div className="h-3 w-14 bg-gray-700 rounded relative overflow-hidden">
              <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-gray-600/30 to-transparent" />
            </div>
            <div className="h-3 w-10 bg-gray-700 rounded relative overflow-hidden">
              <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite_0.1s] bg-gradient-to-r from-transparent via-gray-600/30 to-transparent" />
            </div>
          </div>
          <div className="h-5 w-4/5 bg-gray-700 rounded relative overflow-hidden">
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite_0.2s] bg-gradient-to-r from-transparent via-gray-600/30 to-transparent" />
          </div>
          <div className="h-4 w-full bg-gray-700 rounded relative overflow-hidden">
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite_0.3s] bg-gradient-to-r from-transparent via-gray-600/30 to-transparent" />
          </div>
        </div>
        <div className="flex-shrink-0 w-20 h-20 bg-gray-700 rounded relative overflow-hidden">
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite_0.1s] bg-gradient-to-r from-transparent via-gray-600/30 to-transparent" />
        </div>
      </div>
    </div>
  );
}

export function FeedSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-0">
      {Array.from({ length: count }).map((_, i) => (
        <WireSkeleton key={i} />
      ))}
    </div>
  );
}
