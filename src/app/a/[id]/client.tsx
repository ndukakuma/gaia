'use client';
import { useEffect, useState } from 'react';
import SplatViewer from '@/components/SplatViewer';
import { AVATARS } from '@/lib/avatars';
import ProgressBar from '@/components/ProgressBar';
import DotNav from '@/components/DotNav';

export default function ClientPage({ id }: { id: string }) {
  const a = AVATARS?.[id] ?? { name: id, file: '/splats/bonsai_30000.ply', preview: '' };

  // immersive body class
  useEffect(() => {
    document.body.classList.add('immersive');
    return () => document.body.classList.remove('immersive');
  }, []);

  // viewer state
  const [bg, setBg] = useState<'white'|'black'|'room'>('room');
  const [roomNear, setRoomNear] = useState('#1a1a1a');
  const [roomFar,  setRoomFar]  = useState('#0b0b0c');
  const [follow, setFollow]     = useState<'none'|'mouse'>('none');

  // loader state
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    if (!loading) return;
    const t = setInterval(() => setProgress(p => (p < 0.9 ? p + (1 - p) * 0.08 : p)), 120);
    return () => clearInterval(t);
  }, [loading]);

  // keyboard: Esc → home
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'escape') window.location.href = '/';
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // quick helpers for DotNav actions
  const resetView = () =>
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'f' }));

  const cycleBg = () => {
    setBg(b => (b === 'white' ? 'black' : b === 'black' ? 'room' : 'white'));
  };

  const toggleFollow = () =>
    setFollow(f => (f === 'mouse' ? 'none' : 'mouse'));

  return (
    <div className="gaia-immersive">
      

{/* Tiny white dot in the top-right that opens a small nav on hover/click */}
  <DotNav
  top={12}
  left={12}   // ← move to top-left
  items={[
    { label: 'Home', href: '/' },
    { label: 'Reset View', onClick: resetView },
    { label: follow === 'mouse' ? 'Drive: Off' : 'Drive: Follow', onClick: toggleFollow },
    { label: `Background: ${bg[0].toUpperCase()}${bg.slice(1)}`, onClick: cycleBg },
  ]}
/>



      <SplatViewer
        src={a.file}
        bg={bg}
        follow={follow}
        roomNear={roomNear}
        roomFar={roomFar}
        onReady={() => { setProgress(1); setTimeout(() => setLoading(false), 220); }}
      />

      {loading && (
        <div className="gaia-loading">
          {/* Minimal, continuous white progress bar */}
          <ProgressBar progress={progress} width={65} height={2} />
        </div>
      )}
    </div>
  );
}
