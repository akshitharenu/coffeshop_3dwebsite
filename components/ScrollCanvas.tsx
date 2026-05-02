'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { MotionValue, useTransform, motion } from 'framer-motion';

const FRAME_COUNT = 192;

interface ScrollCanvasProps {
  progress: MotionValue<number>;
}

export default function ScrollCanvas({ progress }: ScrollCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<(HTMLImageElement | null)[]>([]);
  const rafRef = useRef<number | null>(null);
  const lastIndexRef = useRef<number>(-1);
  const [loadedCount, setLoadedCount] = useState(0);
  const [allLoaded, setAllLoaded] = useState(false);

  // ── Preload all frames ────────────────────────────────────────────────
  useEffect(() => {
    let count = 0;
    imagesRef.current = new Array(FRAME_COUNT).fill(null);

    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = new Image();
      img.decoding = 'async';
      img.src = `/sequence/frame_${i}.jpg`;
      const idx = i;
      img.onload = () => {
        imagesRef.current[idx] = img;
        count++;
        setLoadedCount(count);
        if (count === FRAME_COUNT) setAllLoaded(true);
      };
      img.onerror = () => {
        count++;
        if (count === FRAME_COUNT) setAllLoaded(true);
      };
    }
    return () => {
      imagesRef.current.forEach((img) => { if (img) img.onload = null; });
    };
  }, []);

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

          // "contain" fit — preserves native sharpness, no upscale distortion
          const imgRatio    = img.naturalWidth  / img.naturalHeight;
          const canvasRatio = cW / cH;

          let drawW: number, drawH: number, offsetX: number, offsetY: number;
          if (canvasRatio > imgRatio) {
            // canvas is wider → constrain by height
            drawH   = cH;
            drawW   = cH * imgRatio;
            offsetX = (cW - drawW) / 2;
            offsetY = 0;
          } else {
            // canvas is taller → constrain by width
            drawW   = cW;
            drawH   = cW / imgRatio;
            offsetX = 0;
            offsetY = (cH - drawH) / 2;
          }

          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, offsetX, offsetY, drawW, drawH);
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
      {/* Loading overlay */}
      {!allLoaded && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black">
          <div className="h-10 w-10 rounded-full border-t-2 border-b-2 border-white/80 animate-spin" />
          <p className="mt-5 text-[11px] font-medium tracking-[0.3em] text-white/50 uppercase">
            Loading {loadPct}%
          </p>
          <div className="mt-4 h-px w-52 bg-white/10 overflow-hidden">
            <div
              className="h-full bg-white/80 transition-all duration-150"
              style={{ width: `${loadPct}%` }}
            />
          </div>
        </div>
      )}

      {/* Canvas — positioned fixed so it always fills the viewport exactly */}
      <canvas
        ref={canvasRef}
        style={{ position: 'fixed', top: 0, left: 0, zIndex: 0, display: 'block' }}
      />

      {/* Scroll cue */}
      <motion.div
        style={{ opacity: useTransform(progress, [0, 0.08], [1, 0]) }}
        className="fixed bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 text-white/50 pointer-events-none z-10"
      >
        <span className="text-[10px] tracking-[0.3em] uppercase font-medium">Scroll to Explore</span>
        <div className="h-12 w-6 rounded-full border border-white/20 flex justify-center pt-2">
          <motion.div
            animate={{ y: [0, 18, 0] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
            className="h-1.5 w-1.5 rounded-full bg-white/70"
          />
        </div>
      </motion.div>
    </>
  );
}
