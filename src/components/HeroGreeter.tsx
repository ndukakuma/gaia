'use client';

import { useEffect, useState } from 'react';
import SplatViewer from './SplatViewer';
import SiriLoader from './SiriLoader';
import styles from './HeroGreeter.module.css';

type Props = {
  src: string;
  disabled?: boolean;
};

export default function HeroGreeter({ src, disabled = false }: Props) {
  const [loading, setLoading] = useState(!disabled);

  useEffect(() => {
    if (disabled) setLoading(false);
  }, [disabled]);

  return (
    <div className={styles.heroGreeter} data-disabled={disabled}>
      <div className={styles.viewer}>
        {disabled ? (
          <div className={styles.placeholder} aria-hidden="true" />
        ) : (
          <SplatViewer
            src={src}
            bg="room"
            follow="mouse"
            roomNear="#1a1a1a"
            roomFar="#050505"
            onReady={() => setLoading(false)}
          />
        )}
      </div>
      <div className={styles.overlay} data-ready={!loading}>
        {disabled ? (
          <>
            <p className={styles.headline}>Live greeter coming soon.</p>
            <p className={styles.subtext}>
              We&apos;re tuning the Gaussian welcome avatar to stream without melting your GPU. Check back after the next drop.
            </p>
          </>
        ) : loading ? (
          <div className={styles.loader}>
            <SiriLoader />
            <span>Booting welcome avatar…</span>
          </div>
        ) : (
          <>
            <p className={styles.headline}>Meet Nova, Gaia&apos;s greeter.</p>
            <p className={styles.subtext}>
              Every visitor is welcomed by a live Gaussian splat—ready to guide creators through capture, training, and launch.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
