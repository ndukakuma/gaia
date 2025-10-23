'use client';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import * as GaussianSplats3D from '@mkkellogg/gaussian-splats-3d';

type BG = 'white' | 'black' | 'room';
type Follow = 'none' | 'mouse';

export default function SplatViewer({
  src,
  bg = 'room',
  follow = 'none',
  roomNear = '#1a1a1a',
  roomFar  = '#0b0b0c',
  onReady,
}: {
  src: string; bg?: BG; follow?: Follow; roomNear?: string; roomFar?: string; onReady?: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current!;
    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
    el.appendChild(renderer.domElement);

    const camera = new THREE.PerspectiveCamera(65, 1, 0.02, 2000);
    camera.up.set(0, -1, -0.6).normalize();

    const viewer = new GaussianSplats3D.Viewer({
      renderer, camera, useBuiltInControls: true, gpuAcceleratedSort: false, sharedMemoryForWorkers: false,
    });

    const resize = () => {
      const w = el.clientWidth, h = Math.max(1, el.clientHeight);
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(w, h); camera.aspect = w / h; camera.updateProjectionMatrix();
    };
    const ro = new ResizeObserver(resize); ro.observe(el); resize();

    // Full bleed background (no borders/rounding)
    el.style.border = 'none';
    el.style.borderRadius = '0px';
    el.style.overflow = 'hidden';
    el.style.background =
      bg === 'white' ? '#ffffff' :
      bg === 'black' ? '#000000' :
      `radial-gradient(800px 400px at 50% 35%, ${roomNear} 0%, ${roomFar} 60%)`;

    const orbitCenter = new THREE.Vector3(0, 0, 0);
    let orbitRadius = 6;
    let yaw = -0.35, pitch = 0.08;
    let targetYaw = yaw, targetPitch = pitch;

    const setCameraFromAngles = () => {
      const x = orbitCenter.x + orbitRadius * Math.sin(yaw) * Math.cos(pitch);
      const y = orbitCenter.y + orbitRadius * Math.sin(pitch);
      const z = orbitCenter.z + orbitRadius * Math.cos(yaw) * Math.cos(pitch);
      camera.position.set(x, y, z); camera.lookAt(orbitCenter);
    };

    const onPointer = (e: PointerEvent) => {
      if (follow !== 'mouse') return;
      const r = el.getBoundingClientRect();
      const nx = ((e.clientX - r.left) / r.width) * 2 - 1;
      const ny = ((e.clientY - r.top) / r.height) * 2 - 1;
      targetYaw = nx * 0.35; targetPitch = -ny * 0.20;
    };
    el.addEventListener('pointermove', onPointer);

    function fit(scene: any) {
      try {
        if (scene?.getBoundingSphere) {
          const s = scene.getBoundingSphere();
          orbitCenter.copy(s.center); orbitRadius = Math.max(2, s.radius * 2.6);
        } else if (scene?.boundingSphere) {
          const s = scene.boundingSphere;
          orbitCenter.set(s.center.x, s.center.y, s.center.z); orbitRadius = Math.max(2, s.radius * 2.6);
        }
      } catch {}
      setCameraFromAngles();
    }

    let alive = true;
    viewer.addSplatScene(src, { splatAlphaRemovalThreshold: 5 }).then((scene: any) => {
      fit(scene); onReady?.(); loop();
    });

    function loop() {
      if (!alive) return;
      if (follow === 'mouse') {
        yaw += (targetYaw - yaw) * 0.10;
        pitch += (targetPitch - pitch) * 0.10;
        pitch = Math.max(-0.9, Math.min(0.9, pitch));
        setCameraFromAngles();
      }
      viewer.update(); viewer.render(); requestAnimationFrame(loop);
    }

    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'f') { targetYaw = yaw = -0.35; targetPitch = pitch = 0.08; setCameraFromAngles(); }
    };
    window.addEventListener('keydown', onKey);

    return () => {
      alive = false; ro.disconnect(); el.removeEventListener('pointermove', onPointer);
      window.removeEventListener('keydown', onKey); renderer.dispose(); el.innerHTML = '';
    };
  }, [src, bg, follow, roomNear, roomFar]);

  /* Fills its parent (parent must be fixed + inset:0) */
  return <div ref={ref} style={{ position: 'absolute', inset: 0 }} />;
}
