'use client';

export default function ProgressBar({
  progress,            // number 0..1
  width = 260,
  height = 4,
}: {
  progress: number;
  width?: number;
  height?: number;
}) {
  const clamped = Math.max(0, Math.min(1, progress));

  return (
    <div
      style={{
        width,
        height,
        borderRadius: 9999,
        background: 'rgba(255,255,255,.18)',   // track
        overflow: 'hidden',
      }}
      aria-label="Loading"
    >
      <div
        style={{
          height: '100%',
          background: '#fff',                   // white fill
          transformOrigin: 'left center',
          transform: `scaleX(${clamped})`,      // direct mapping 0..1
          transition: 'transform .18s linear',  // keeps motion continuous
          boxShadow: '0 0 10px rgba(255,255,255,.35)',
        }}
      />
    </div>
  );
}
