'use client';

import React, { useEffect, useRef } from 'react';

interface TrailPoint {
  x: number;
  y: number;
  time: number;
  isDot?: boolean;
}

export function PencilTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Only run on devices with fine pointer (mouse/trackpad, not touch)
    if (!window.matchMedia('(any-pointer: fine)').matches) {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let points: TrailPoint[] = [];
    let isRunning = false;
    let animId = 0;
    const MAX_POINTS = 24;
    const FADE_DURATION = 600; // ms

    // Check prefers-reduced-motion: skips trail only (not cursor)
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    let isReducedMotion = reducedMotionQuery.matches;

    const onMotionChange = (e: MediaQueryListEvent) => {
      isReducedMotion = e.matches;
      if (isReducedMotion) {
        points = [];
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };
    reducedMotionQuery.addEventListener('change', onMotionChange);

    // Dynamic high-DPI canvas resizing
    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas, { passive: true });

    // Render loop
    const render = () => {
      if (!ctx || !canvas) return;

      const now = performance.now();
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Remove points older than FADE_DURATION
      points = points.filter((p) => now - p.time < FADE_DURATION);

      if (points.length === 0) {
        isRunning = false;
        return; // Zero idle CPU cost when not moving
      }

      // Read current course theme tint from CSS variable
      const rawTint = getComputedStyle(document.body).getPropertyValue('--cursor-tint').trim() || '#D97706';

      // Draw tapered fading graphite line segments
      for (let i = 1; i < points.length; i++) {
        const p0 = points[i - 1];
        const p1 = points[i];

        const ageRatio = (now - p1.time) / FADE_DURATION;
        const progress = Math.max(0, 1 - ageRatio);

        // Faint graphite dust transparency & taper
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(p0.x, p0.y);
        ctx.lineTo(p1.x, p1.y);

        ctx.strokeStyle = rawTint;
        ctx.globalAlpha = progress * 0.35;
        ctx.lineWidth = Math.max(0.6, progress * 2.8);
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke();
        ctx.restore();
      }

      // Draw fading ink dots from clicks/pointerdown
      for (let i = 0; i < points.length; i++) {
        const p = points[i];
        if (p.isDot) {
          const ageRatio = (now - p.time) / FADE_DURATION;
          const progress = Math.max(0, 1 - ageRatio);

          ctx.save();
          ctx.beginPath();
          ctx.arc(p.x, p.y, progress * 3.5, 0, Math.PI * 2);
          ctx.fillStyle = rawTint;
          ctx.globalAlpha = progress * 0.6;
          ctx.fill();
          ctx.restore();
        }
      }

      animId = requestAnimationFrame(render);
    };

    const startLoop = () => {
      if (!isRunning) {
        isRunning = true;
        animId = requestAnimationFrame(render);
      }
    };

    // Passive pointer listeners on window
    const onPointerMove = (e: PointerEvent) => {
      if (isReducedMotion) return;

      points.push({
        x: e.clientX,
        y: e.clientY,
        time: performance.now(),
      });

      if (points.length > MAX_POINTS) {
        points.shift();
      }

      startLoop();
    };

    const onPointerDown = (e: PointerEvent) => {
      if (isReducedMotion) return;

      points.push({
        x: e.clientX,
        y: e.clientY,
        time: performance.now(),
        isDot: true,
      });

      startLoop();
    };

    // Pause when tab is hidden
    const onVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        points = [];
        if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
        cancelAnimationFrame(animId);
        isRunning = false;
      }
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerdown', onPointerDown, { passive: true });
    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('resize', resizeCanvas);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      reducedMotionQuery.removeEventListener('change', onMotionChange);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-[9999] h-full w-full"
      aria-hidden="true"
    />
  );
}
