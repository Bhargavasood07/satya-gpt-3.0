import { useRef, useCallback, useEffect } from 'react';

/**
 * useCardTilt — High-performance 60fps/120fps mouse-tracking 3D card tilt.
 * Optimized with requestAnimationFrame throttling and cached DOM element queries
 * to prevent layout thrashing and eliminate cursor lag.
 */
export function useCardTilt({ max = 8, scale = 1.02, speed = 250 } = {}) {
  const ref = useRef(null);
  const rafRef = useRef(null);
  const shineRef = useRef(null);

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const onMouseMove = useCallback((e) => {
    if (rafRef.current) return;
    const clientX = e.clientX;
    const clientY = e.clientY;

    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const rotateX = ((y - cy) / cy) * -max;
      const rotateY = ((x - cx) / cx) * max;

      el.style.transition = 'transform 0.08s ease-out';
      el.style.transform = `perspective(800px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(${scale},${scale},${scale})`;

      if (!shineRef.current) {
        shineRef.current = el.querySelector('[data-tilt-shine]');
      }
      if (shineRef.current) {
        const deg = Math.atan2(y - cy, x - cx) * (180 / Math.PI) + 90;
        shineRef.current.style.background = `linear-gradient(${deg}deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 60%)`;
        shineRef.current.style.opacity = '1';
      }
    });
  }, [max, scale]);

  const onMouseLeave = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    const el = ref.current;
    if (!el) return;
    el.style.transition = `transform ${speed}ms cubic-bezier(.03,.98,.52,.99)`;
    el.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)';
    if (shineRef.current) {
      shineRef.current.style.opacity = '0';
    }
  }, [speed]);

  return { ref, onMouseMove, onMouseLeave };
}

export default useCardTilt;
