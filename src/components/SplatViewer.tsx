'use client';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import * as GaussianSplats3D from '@mkkellogg/gaussian-splats-3d';

type BG = 'white' | 'black' | 'room';
type Follow = 'none' | 'mouse';

type VectorLike = { x: number; y: number; z: number };
type BoundingSphere = { center: VectorLike; radius: number };

const isVectorLike = (value: unknown): value is VectorLike => {
  if (!value || typeof value !== 'object') return false;
  const maybe = value as Record<string, unknown>;
  return (
    typeof maybe.x === 'number' &&
    typeof maybe.y === 'number' &&
    typeof maybe.z === 'number'
  );
};

const isBoundingSphere = (value: unknown): value is BoundingSphere => {
  if (!value || typeof value !== 'object') return false;
  const maybe = value as Record<string, unknown>;
  return typeof maybe.radius === 'number' && isVectorLike(maybe.center);
};

const getBoundingSphere = (scene: unknown): BoundingSphere | null => {
  if (!scene || typeof scene !== 'object') return null;

  const withMethod = scene as { getBoundingSphere?: () => unknown };
  if (typeof withMethod.getBoundingSphere === 'function') {
    const sphere = withMethod.getBoundingSphere();
    if (isBoundingSphere(sphere)) return sphere;
  }

  const withProp = scene as { boundingSphere?: unknown };
  if (isBoundingSphere(withProp.boundingSphere)) {
    return withProp.boundingSphere;
  }

  return null;
};

export default function SplatViewer({
  src,
  bg = 'room',
  follow = 'none',
  roomNear = '#1a1a1a',
  roomFar = '#0b0b0c',
  onReady,
}: {
  src: string;
  bg?: BG;
  follow?: Follow;
  roomNear?: string;
  roomFar?: string;
  onReady?: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const readyRef = useRef(onReady);

  useEffect(() => {
    readyRef.current = onReady;
  }, [onReady]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
    el.appendChild(renderer.domElement);

    const camera = new THREE.PerspectiveCamera(65, 1, 0.02, 2000);
    camera.up.set(0, -1, -0.6).normalize();

    const viewer = new GaussianSplats3D.Viewer({
      renderer,
      camera,
      useBuiltInControls: true,
      gpuAcceleratedSort: false,
      sharedMemoryForWorkers: false,
    });

    const resize = () => {
      const w = el.clientWidth;
      const h = Math.max(1, el.clientHeight);
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };

    const ro = new ResizeObserver(resize);
    ro.observe(el);
    resize();

    // Full bleed background (no borders/rounding)
    el.style.border = 'none';
    el.style.borderRadius = '0px';
    el.style.overflow = 'hidden';
    el.style.background =
      bg === 'white'
        ? '#ffffff'
        : bg === 'black'
          ? '#000000'
          : `radial-gradient(800px 400px at 50% 35%, ${roomNear} 0%, ${roomFar} 60%)`;

    const orbitCenter = new THREE.Vector3(0, 0, 0);
    let orbitRadius = 6;
    let yaw = -0.35;
    let pitch = 0.08;
    let targetYaw = yaw;
    let targetPitch = pitch;

    const setCameraFromAngles = () => {
      const x = orbitCenter.x + orbitRadius * Math.sin(yaw) * Math.cos(pitch);
      const y = orbitCenter.y + orbitRadius * Math.sin(pitch);
      const z = orbitCenter.z + orbitRadius * Math.cos(yaw) * Math.cos(pitch);
      camera.position.set(x, y, z);
      camera.lookAt(orbitCenter);
    };

    const onPointer = (e: PointerEvent) => {
      if (follow !== 'mouse') return;
      const r = el.getBoundingClientRect();
      const nx = ((e.clientX - r.left) / r.width) * 2 - 1;
      const ny = ((e.clientY - r.top) / r.height) * 2 - 1;
      targetYaw = nx * 0.35;
      targetPitch = -ny * 0.2;
    };
    el.addEventListener('pointermove', onPointer);

    const fit = (scene: unknown) => {
      const sphere = getBoundingSphere(scene);
      if (sphere) {
        orbitCenter.set(sphere.center.x, sphere.center.y, sphere.center.z);
        orbitRadius = Math.max(2, sphere.radius * 2.6);
      }
      setCameraFromAngles();
    };

    let alive = true;
    viewer
      .addSplatScene(src, { splatAlphaRemovalThreshold: 5 })
      .then((scene: unknown) => {
        if (!alive) return;
        fit(scene);
        readyRef.current?.();
        loop();
      })
      .catch(() => {
        // swallow errors for now; upstream can surface via onReady if needed
      });

    function loop() {
      if (!alive) return;
      if (follow === 'mouse') {
        yaw += (targetYaw - yaw) * 0.1;
        pitch += (targetPitch - pitch) * 0.1;
        pitch = Math.max(-0.9, Math.min(0.9, pitch));
        setCameraFromAngles();
      }
      viewer.update();
      viewer.render();
      requestAnimationFrame(loop);
    }

    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'f') {
        targetYaw = yaw = -0.35;
        targetPitch = pitch = 0.08;
        setCameraFromAngles();
      }
    };
    window.addEventListener('keydown', onKey);

    return () => {
      alive = false;
      ro.disconnect();
      el.removeEventListener('pointermove', onPointer);
      window.removeEventListener('keydown', onKey);
      renderer.dispose();
      el.innerHTML = '';
    };
  }, [src, bg, follow, roomNear, roomFar]);

  /* Fills its parent (parent must be fixed + inset:0) */
  return <div ref={ref} style={{ position: 'absolute', inset: 0 }} />;
}
