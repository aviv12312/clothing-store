import { useEffect, useRef } from 'react';

/**
 * Adds .visible to reveal elements when they enter the viewport.
 * when they enter the viewport.
 */
export function useScrollReveal(deps = []) {
  const containerRef = useRef(null);

  useEffect(() => {
    const root = containerRef.current ?? document;
    const targets = root.querySelectorAll
      ? root.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale')
      : document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');

    if (!targets.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return containerRef;
}
