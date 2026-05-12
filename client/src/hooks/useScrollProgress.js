import { useEffect, useState } from 'react';

const clamp = (value) => Math.min(Math.max(value, 0), 1);

export function useScrollProgress(ref) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    let frame = null;

    const update = () => {
      const rect = element.getBoundingClientRect();
      const viewport = window.innerHeight || 1;
      const travel = rect.height + viewport;
      const next = clamp((viewport - rect.top) / travel);
      setProgress(next);
      frame = null;
    };

    const requestUpdate = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', requestUpdate);
      window.removeEventListener('resize', requestUpdate);
    };
  }, [ref]);

  return progress;
}
