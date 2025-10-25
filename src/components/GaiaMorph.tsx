'use client';
import { useEffect, useRef } from 'react';

export default function GaiaMorph({
  size = 92,       // px
  spin = true,     // slow rotate like a “thinking” indicator
  speed = 1,       // 1 = default; >1 faster morph
  src = '/brand/gaia-logo.svg', // your icon
}: {
  size?: number;
  spin?: boolean;
  speed?: number;
  src?: string;
}) {
  const turbRef = useRef<SVGFEturbulenceElement>(null);
  const dispRef = useRef<SVGFEDisplacementMapElement>(null);

  useEffect(() => {
    let raf = 0;
    const t0 = performance.now();

    const loop = (now: number) => {
      const t = ((now - t0) / 1000) * speed;
      // subtle breathing for noise + displacement
      const base = 0.012 + 0.008 * (0.5 + 0.5 * Math.sin(t * 0.7));
      const scale = 10 + 6 * Math.sin(t * 0.9);

      if (turbRef.current) turbRef.current.setAttribute('baseFrequency', base.toFixed(4));
      if (dispRef.current) dispRef.current.setAttribute('scale', scale.toFixed(1));

      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [speed]);

  // SVG viewBox is centered on the image to keep rotation around center tidy
  const s = size;
  return (
    <div
      style={{
        width: s,
        height: s,
        display: 'grid',
        placeItems: 'center',
        // slow, gentle rotate
        animation: spin ? 'gaiaSpin 10s linear infinite' : undefined,
      }}
    >
      <svg
        width={s}
        height={s}
        viewBox={`0 0 ${s} ${s}`}
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="Gaia loading"
      >
        <defs>
          {/* noise field */}
          <filter id="gaia-morph" x="-50%" y="-50%" width="200%" height="200%">
            <feTurbulence
              ref={turbRef}
              type="fractalNoise"
              baseFrequency="0.012"
              numOctaves={2}
              seed={2}
              result="noise"
            />
            <feDisplacementMap
              ref={dispRef}
              in="SourceGraphic"
              in2="noise"
              scale={10}
              xChannelSelector="R"
              yChannelSelector="G"
              result="morph"
            />
            {/* force to pure white regardless of incoming icon colors */}
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
            {/* a kiss of soft glow */}
            <feGaussianBlur in="white" stdDeviation="0.45" result="glow" />
            <feMerge>
              <feMergeNode in="glow" />
              <feMergeNode in="white" />
            </feMerge>
          </filter>
        </defs>

        {/* center the rasterized svg icon; it will be morphed & recolored */}
        <image
          href={src}
          x={0}
          y={0}
          width={s}
          height={s}
          preserveAspectRatio="xMidYMid meet"
          filter="url(#gaia-morph)"
        />
      </svg>
    </div>
  );
}
