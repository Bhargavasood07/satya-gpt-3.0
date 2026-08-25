import { useRef, useCallback } from 'react';

/**
 * useCardTilt — Mouse-tracking 3D card tilt effect.
 * Returns ref to attach to the card element + mouse handlers.
 *
 * @param {object} options
 * @param {number} options.max      - Max tilt degrees (default 15)
 * @param {number} options.scale    - Scale on hover (default 1.03)
 * @param {number} options.speed    - Transition speed ms (default 300)
 */
export function useCardTilt({ max = 15, scale = 1.03, speed = 300 } = {}) {
  const ref = useRef(null);

  const onMouseMove = useCallback((e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const rotateX = ((y - cy) / cy) * -max;
    const rotateY = ((x - cx) / cx) * max;
    el.style.transition = `transform 0.05s ease`;
    el.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(${scale},${scale},${scale})`;
    // Dynamic highlight
    const shine = el.querySelector('[data-tilt-shine]');
    if (shine) {
      const deg = Math.atan2(y - cy, x - cx) * (180 / Math.PI) + 90;
      shine.style.background = `linear-gradient(${deg}deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0) 60%)`;
      shine.style.opacity = '1';
    }
  }, [max, scale]);

  const onMouseLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.transition = `transform ${speed}ms cubic-bezier(.03,.98,.52,.99)`;
    el.style.transform = `perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)`;
    const shine = el.querySelector('[data-tilt-shine]');
    if (shine) shine.style.opacity = '0';
  }, [speed]);

  return { ref, onMouseMove, onMouseLeave };
}
