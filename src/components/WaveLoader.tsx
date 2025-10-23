'use client';
import { useEffect, useRef } from 'react';

type Props = {
  /** 0..1 */
  progress?: number;
  /** left-to-right size of the wave area in pixels; it scales by devicePixelRatio for crisp lines */
  width?: number;
  height?: number;
  /** pick 2–4 colors; they’ll be layered for depth */
  colors?: string[];
  /** 0 = no background; set to a rgba() if you want a panel behind the wave */
  background?: string | null;
};

export default function WaveLoader({
  progress = 0,
  width = 560,
  height = 140,
  colors = ['#60a5fa', '#22d3ee', '#ffffff'], // blue → cyan → white
  background = null,
}: Props) {
  const ref = useRef<HTMLCanvasElement>(null);
  const anim = useRef(0);

  useEffect(() => {
    const canvas = ref.current!;
    const dpr = Math.max(1, window.devicePixelRatio || 1);
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    const ctx = canvas.getContext('2d')!;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    let t = 0;
    const draw = () => {
      t += 0.016; // ~60fps
      const W = canvas.width;
      const H = canvas.height;
      const mid = H * 0.5;

      // background (transparent by default)
      if (background) {
        ctx.fillStyle = background;
        ctx.fillRect(0, 0, W, H);
      } else {
        ctx.clearRect(0, 0, W, H);
      }

      // “length” of the wave grows with progress
      const waveWidth = Math.max(8, W * Math.min(1, Math.max(0, progress)));

      // soft clipping so the wave doesn’t continue past progress
      ctx.save();
      ctx.rect(0, 0, waveWidth, H);
      ctx.clip();

      // draw layered waves
      const baseAmp = H * 0.22;          // overall amplitude
      const baseFreq = (Math.PI * 2) / (W / 1.2); // base frequency

      colors.forEach((col, i) => {
        // each layer has slightly different phase/speed/amplitude
        const amp = baseAmp * (0.85 - i * 0.22);
        const speed = 0.8 + i * 0.25;
        const phase = i * 0.9;

        ctx.beginPath();
        for (let x = 0; x <= waveWidth; x += 2 * dpr) {
          const k = x * baseFreq;
          // two sines mixed for organic motion
          const y =
            mid +
            amp * Math.sin(k - t * speed - phase) * 0.7 +
            amp * 0.35 * Math.sin(k * 0.5 + t * (speed * 0.6) + phase * 0.7);

          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }

        ctx.strokeStyle = col;
        ctx.lineWidth = 3.5 * dpr;
        ctx.globalAlpha = 0.9;
        ctx.shadowBlur = 16 * dpr;
        ctx.shadowColor = col;
        ctx.stroke();

        // subtle glow trail
        ctx.lineWidth = 10 * dpr;
        ctx.globalAlpha = 0.08;
        ctx.shadowBlur = 22 * dpr;
        ctx.stroke();

        // reset per layer
        ctx.globalAlpha = 1;
        ctx.shadowBlur = 0;
      });

      ctx.restore();
      anim.current = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(anim.current);
  }, [width, height, colors, background, progress]);

  return (
    <div style={{ display: 'grid', placeItems: 'center' }}>
      <canvas ref={ref} aria-label="Loading" />
    </div>
  );
}
