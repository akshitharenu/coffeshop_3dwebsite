'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { MotionValue, useTransform, motion } from 'framer-motion';

const FRAME_COUNT = 192;

interface ScrollCanvasProps {
  progress: MotionValue<number>;
}

export default function ScrollCanvas({ progress, onLoaded }: ScrollCanvasProps & { onLoaded?: (pct: number) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<(HTMLImageElement | null)[]>([]);
  const rafRef = useRef<number | null>(null);
  const lastIndexRef = useRef<number>(-1);
  const [loadedCount, setLoadedCount] = useState(0);
  const [allLoaded, setAllLoaded] = useState(false);

  // ── Preload all frames ────────────────────────────────────────────────
  useEffect(() => {
    if (allLoaded) return;
    let count = 0;
    imagesRef.current = new Array(FRAME_COUNT).fill(null);

    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = new Image();
      img.decoding = 'async';
      const idx = i;
      img.onload = () => {
        imagesRef.current[idx] = img;
        count++;
        setLoadedCount(count);
        onLoaded?.(Math.round((count / FRAME_COUNT) * 100));
        if (count === FRAME_COUNT) setAllLoaded(true);
      };
      img.onerror = () => {
        count++;
        onLoaded?.(Math.round((count / FRAME_COUNT) * 100));
        if (count === FRAME_COUNT) setAllLoaded(true);
      };
      img.src = `/sequence/frame_${i}.jpg`;
    }
    return () => {
      imagesRef.current.forEach((img) => { if (img) img.onload = null; });
    };
  }, [onLoaded]);

  // ── Resize canvas to exactly fill the window ──────────────────────────
  const resize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    // Use 1:1 pixel ratio for raw performance — browser handles the rest
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const W = window.innerWidth;
    const H = window.innerHeight;
    canvas.width  = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    canvas.style.width  = `${W}px`;
    canvas.style.height = `${H}px`;
    // force redraw after resize
    lastIndexRef.current = -1;
  }, []);

  // ── Continuous RAF loop ────────────────────────────────────────────────
  useEffect(() => {
    if (!allLoaded) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    resize();

    const loop = () => {
      const raw  = progress.get();
      const idx  = Math.min(FRAME_COUNT - 1, Math.max(0, Math.round(raw * (FRAME_COUNT - 1))));

      if (idx !== lastIndexRef.current) {
        lastIndexRef.current = idx;
        const img = imagesRef.current[idx];
        if (img && img.naturalWidth > 0) {
          const cW = canvas.width;
          const cH = canvas.height;

          // fill black first
          ctx.fillStyle = '#000000';
          ctx.fillRect(0, 0, cW, cH);

          // "cover" fit with a slight zoom to crop out the Veo watermark
          const imgRatio    = img.naturalWidth  / img.naturalHeight;
          const canvasRatio = cW / cH;

          let drawW: number, drawH: number, offsetX: number, offsetY: number;
          if (canvasRatio > imgRatio) {
            // Canvas is wider than image -> cover by width
            drawW = cW;
            drawH = cW / imgRatio;
            offsetX = 0;
            offsetY = (cH - drawH) / 2;
          } else {
            // Canvas is taller than image (mobile) -> cover by height
            drawH = cH;
            drawW = cH * imgRatio;
            offsetX = (cW - drawW) / 2;
            offsetY = 0;
          }

          // Apply a 12% zoom to push the watermark off the canvas
          const zoom = 1.12;
          const zw = drawW * zoom;
          const zh = drawH * zoom;
          const zx = offsetX - (zw - drawW) / 2;
          const zy = offsetY - (zh - drawH) / 2;

          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, zx, zy, zw, zh);

          // As an extra fallback, draw a black fade over the bottom right corner
          const gradient = ctx.createRadialGradient(
            zx + zw, zy + zh, 0, 
            zx + zw, zy + zh, Math.max(zw, zh) * 0.15
          );
          gradient.addColorStop(0, 'rgba(0,0,0,1)');
          gradient.addColorStop(1, 'rgba(0,0,0,0)');
          ctx.fillStyle = gradient;
          ctx.fillRect(zx + zw - (zw * 0.2), zy + zh - (zh * 0.2), zw * 0.2, zh * 0.2);
        }
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    window.addEventListener('resize', resize, { passive: true });

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [allLoaded, progress, resize]);

  const loadPct = Math.round((loadedCount / FRAME_COUNT) * 100);

  return (
    <>
      {/* Canvas — sticky inside the hero wrapper; sections below occlude it */}
      <canvas
        ref={canvasRef}
        style={{ position: 'sticky', top: 0, left: 0, zIndex: 0, display: 'block', width: '100%', height: '100vh' }}
      />

      {/* Scroll cue */}
      <motion.div
        style={{ opacity: useTransform(progress, [0, 0.08], [1, 0]) }}
        className="fixed bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 pointer-events-none z-10"
      >
        <span className="text-[10px] tracking-[0.3em] uppercase font-medium" style={{ color: 'var(--text-muted)' }}>Scroll to Explore</span>
        <div className="h-12 w-6 rounded-full flex justify-center pt-2" style={{ border: '1px solid rgba(200,169,110,0.25)' }}>
          <motion.div
            animate={{ y: [0, 18, 0] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
            className="h-1.5 w-1.5 rounded-full"
            style={{ background: 'var(--gold)' }}
          />
        </div>
      </motion.div>
    </>
  );
}
