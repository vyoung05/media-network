import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <div className="flex items-end gap-[2px] h-12 mb-8 opacity-40">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="w-[3px] bg-primary rounded-full"
            style={{ height: `${Math.sin(i * 0.4) * 50 + 50}%` }}
          />
        ))}
      </div>
      <h1 className="text-6xl font-headline font-black text-primary glow-text mb-4">404</h1>
      <p className="text-xl text-neutral/60 font-body mb-2">Signal Lost</p>
      <p className="text-sm text-neutral/40 font-mono mb-8">
        The frequency you&apos;re looking for doesn&apos;t exist.
      </p>
      <Link href="/" className="btn-primary">
        Back to Home
      </Link>
    </div>
  );
}
