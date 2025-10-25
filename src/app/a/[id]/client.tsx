'use client';
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import DotNav from '@/components/DotNav';
import SplatViewer from '@/components/SplatViewer';
import DeformOrb from '@/components/DeformOrb';
import { AVATARS, DEFAULT_SPLAT_SRC } from '@/lib/avatars';
import SiriLoader from '@/components/SiriLoader';

export default function ClientPage({ id }: { id: string }) {
  const avatar = AVATARS[id];
  const displayName = avatar?.name ?? id;
  const viewerSrc = useMemo(() => avatar?.file ?? DEFAULT_SPLAT_SRC, [avatar?.file]);
  const hasSplat = Boolean(avatar?.file || avatar?.hasSplat);

  // immersive body class only when we render the 3D viewer
  useEffect(() => {
    if (!hasSplat) return;
    document.body.classList.add('immersive');
    return () => document.body.classList.remove('immersive');
  }, [hasSplat]);

  // viewer state
  const [bg, setBg] = useState<'white' | 'black' | 'room'>('room');
  const [follow, setFollow] = useState<'none' | 'mouse'>('none');

  // loader state
  const [loading, setLoading] = useState(true);
  // keyboard: Esc -> home (only relevant when in immersive viewer)
  useEffect(() => {
    if (!hasSplat) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'escape') window.location.href = '/';
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [hasSplat]);

  if (!hasSplat) {
    return (
      <main className="container" style={{ padding: '56px 0 96px' }}>
        <div style={{ maxWidth: 760, margin: '0 auto', display: 'grid', gap: 24 }}>
          <Link href="/" className="nav-link" style={{ width: 'fit-content' }}>
            Back to gallery
          </Link>

          <section
            style={{
              display: 'grid',
              gap: 24,
              padding: 32,
              borderRadius: 24,
              background: '#f9fafb',
              border: '1px solid var(--border)',
              boxShadow: '0 12px 40px rgba(17, 17, 17, 0.08)',
            }}
          >
            <div style={{ display: 'flex', gap: 24, alignItems: 'center', flexWrap: 'wrap' }}>
              {avatar?.preview ? (
                <div
                  style={{
                    width: 160,
                    height: 160,
                    borderRadius: 24,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundImage: `url(${avatar.preview})`,
                    flex: '0 0 auto',
                    boxShadow: '0 10px 32px rgba(17,17,17,0.12)',
                  }}
                />
              ) : (
                <div style={{ flex: '0 0 auto' }}>
                  <DeformOrb size={140} spin mode="gradient" />
                </div>
              )}
              <div style={{ minWidth: 240, flex: '1 1 220px' }}>
                <h1 style={{ fontSize: 28, fontWeight: 700, margin: '0 0 12px' }}>{displayName}</h1>
                <p style={{ margin: 0, color: '#4b5563', lineHeight: 1.6 }}>
                  We haven&apos;t captured a 3D splat for this avatar yet. Browse the community avatars for live views, or add your own capture to the gallery.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Link href="/#community" className="btn">
                View Community Avatars
              </Link>
              <Link href="/create" className="btn btn-primary">
                Create Your Own
              </Link>
            </div>
          </section>
        </div>
      </main>
    );
  }

  // quick helpers for DotNav actions
  const resetView = () => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'f' }));
  const cycleBg = () => setBg((b) => (b === 'white' ? 'black' : b === 'black' ? 'room' : 'white'));
  const toggleFollow = () => setFollow((f) => (f === 'mouse' ? 'none' : 'mouse'));

  return (
    <div className="gaia-immersive" aria-label={`Viewing ${displayName}`}>
      {!loading && (
        <DotNav
          top={20}
          left={20}
          header={
            <>
              <Link href="/" className="dotnav-brand">
                <Image src="/brand/gaia-logo.svg" alt="Gaia logo" width={28} height={28} priority />
                <span>Gaia Studio</span>
              </Link>
              <p>Quick controls for navigation and viewer settings.</p>
            </>
          }
          items={[
            {
              label: 'Home',
              href: '/',
              icon: (
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3.5 9.5L10 3l6.5 6.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M5 8.5V16h4v-4h2v4h4V8.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ),
            },
            {
              label: 'Reset View',
              onClick: resetView,
              icon: (
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5.5 6.5l-2 2 2 2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M14.5 13.5l2-2-2-2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M6 13c1.2 1.2 3 2 4 2s2.8-.8 4-2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                  <path d="M14 7c-1.2-1.2-3-2-4-2s-2.8.8-4 2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                </svg>
              ),
            },
            {
              label: follow === 'mouse' ? 'Drive: Follow (on)' : 'Drive: Follow (off)',
              onClick: toggleFollow,
              icon: (
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="10" cy="10" r="5.2" stroke="currentColor" strokeWidth="1.4" />
                  <circle cx="10" cy="10" r="1.2" fill="currentColor" />
                </svg>
              ),
            },
            {
              label: `Background: ${bg[0].toUpperCase()}${bg.slice(1)}`,
              onClick: cycleBg,
              icon: (
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 4v12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                  <path d="M4 10h12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                </svg>
              ),
            },
          ]}
          footer="Press Esc to return home"
        />
      )}

      <div className="gaia-viewer-shell" data-loading={loading}>
        <SplatViewer
          src={viewerSrc}
          bg={bg}
          follow={follow}
          roomNear="#1a1a1a"
          roomFar="#0b0b0c"
          onReady={() => {
            setProgress(1);
            setTimeout(() => setLoading(false), 220);
          }}
        />
      </div>

      {loading && (
        <div className="gaia-loading">
          <SiriLoader />
        </div>
      )}
    </div>
  );
}

