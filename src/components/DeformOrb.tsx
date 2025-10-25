'use client';
import { useEffect, useRef } from 'react';

type Props = {
  size?: number;               // diameter in px
  speed?: number;              // morph speed multiplier (1 = default)
  spin?: boolean;              // slow rotation to keep it alive
  // color mode:
  mode?: 'white' | 'gradient'; // white => pure white orb; gradient => soft rgb/cyan blend
};

export default function DeformOrb({
  size = 120,
  speed = 1,
  spin = false,
  mode = 'white',
}: Props) {
  const turbRef = useRef<SVGFEturbulenceElement>(null);
  const dispRef = useRef<SVGFEDisplacementMapElement>(null);

  useEffect(() => {
    let raf = 0;
    const t0 = performance.now();

    const tick = (now: number) => {
      const t = ((now - t0) / 1000) * speed;

      // gentle “breathing” of the noise
      const base = 0.011 + 0.007 * (0.5 + 0.5 * Math.sin(t * 0.8));
      const scale = 18 + 10 * Math.sin(t * 0.9);

      if (turbRef.current) turbRef.current.setAttribute('baseFrequency', base.toFixed(4));
      if (dispRef.current) dispRef.current.setAttribute('scale', scale.toFixed(1));

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [speed]);

  const s = size;
  const r = s / 2;

  return (
    <div
      style={{
        width: s,
        height: s,
        display: 'grid',
        placeItems: 'center',
        animation: spin ? 'gaiaSpin 14s linear infinite' : undefined,
      }}
    >
      <svg
        width={s}
        height={s}
        viewBox={`0 0 ${s} ${s}`}
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="Loading"
      >
        <defs>
          {/* soft radial gradient for gradient mode */}
          <radialGradient id="orb-grad" cx="50%" cy="45%" r="60%">
            {/* tweak these stops for your palette */}
            <stop offset="0%"  stopColor="#ffffff" stopOpacity="0.95" />
            <stop offset="55%" stopColor="#9ecbff" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#5db7ff" stopOpacity="0.75" />
          </radialGradient>

          <filter id="orb-deform" x="-60%" y="-60%" width="220%" height="220%">
            <feTurbulence
              ref={turbRef}
              type="fractalNoise"
              baseFrequency="0.012"
              numOctaves={2}
              seed="7"
              result="noise"
            />
            <feDisplacementMap
              ref={dispRef}
              in="SourceGraphic"
              in2="noise"
              scale="18"
              xChannelSelector="R"
              yChannelSelector="G"
              result="morph"
            />
            {/* bloom */}
            <feGaussianBlur in="morph" stdDeviation="1.2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="morph" />
            </feMerge>
          </filter>

          {/* force to pure white when mode = white */}
          <filter id="orb-white" x="-60%" y="-60%" width="220%" height="220%">
            <feTurbulence
              ref={turbRef}
              type="fractalNoise"
              baseFrequency="0.012"
              numOctaves="2"
              seed="7"
              result="noise"
            />
            <feDisplacementMap
              ref={dispRef}
              in="SourceGraphic"
              in2="noise"
              scale="18"
              xChannelSelector="R"
              yChannelSelector="G"
              result="morph"
            />
            <feColorMatrix
              in="morph"
              type="matrix"
              values="
                0 0 0 0 1
                0 0 0 0 1
                0 0 0 0 1
                0 0 0 1 0"
              result="white"
            />
            <feGaussianBlur in="white" stdDeviation="1.0" result="glow" />
            <feMerge>
              <feMergeNode in="glow" />
              <feMergeNode in="white" />
            </feMerge>
          </filter>
        </defs>

        {/* draw the orb as a circle, then deform via filter */}
        <circle
          cx={r}
          cy={r}
          r={r * 0.9}
          fill={mode === 'white' ? '#fff' : 'url(#orb-grad)'}
          filter={`url(#${mode === 'white' ? 'orb-white' : 'orb-deform'})`}
        />
      </svg>
    </div>
  );
}
