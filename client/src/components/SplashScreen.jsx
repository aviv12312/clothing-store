import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

export default function SplashScreen({ onComplete }) {
  const containerRef  = useRef(null);
  const logoRef       = useRef(null);
  const separatorRef  = useRef(null);
  const taglineRef    = useRef(null);
  const progressRef   = useRef(null);

  useGSAP(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduced) {
      // Skip straight to done
      if (onComplete) onComplete();
      return;
    }

    const tl = gsap.timeline();

    // Logo rises from below
    tl.from(logoRef.current, {
      autoAlpha: 0,
      y: 32,
      duration: 1.1,
      ease: 'power3.out',
      delay: 0.25,
    });

    // Separator expands from center
    tl.from(separatorRef.current, {
      scaleX: 0,
      duration: 0.7,
      ease: 'power3.out',
      transformOrigin: 'center',
    }, '-=0.6');

    // Tagline fades in
    tl.from(taglineRef.current, {
      autoAlpha: 0,
      y: 10,
      duration: 0.8,
      ease: 'power3.out',
    }, '-=0.4');

    // Gold progress bar fills left to right
    tl.to(progressRef.current, {
      scaleX: 1,
      duration: 1.55,
      ease: 'power1.inOut',
    }, '-=0.2');

    // Brief hold, then the whole screen fades out upward
    tl.to(containerRef.current, {
      autoAlpha: 0,
      y: -24,
      duration: 0.85,
      ease: 'power2.inOut',
      delay: 0.18,
      onComplete: () => { if (onComplete) onComplete(); },
    });
  }, { scope: containerRef });

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        backgroundColor: '#13243A',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div style={{ textAlign: 'center', userSelect: 'none' }}>

        {/* Brand logotype */}
        <div
          ref={logoRef}
          style={{
            fontFamily: "'Bodoni Moda', serif",
            fontSize: 'clamp(2.4rem, 5.5vw, 4.2rem)',
            color: '#F4EDE0',
            letterSpacing: '0.22em',
            lineHeight: 1,
          }}
        >
          DREAM &amp; WORK
        </div>

        {/* Thin terracotta separator */}
        <div
          ref={separatorRef}
          style={{
            marginTop: '1.1rem',
            height: '1px',
            background: 'linear-gradient(to right, transparent, #C47A5C 30%, #C47A5C 70%, transparent)',
          }}
        />

        {/* Tagline */}
        <p
          ref={taglineRef}
          style={{
            marginTop: '0.85rem',
            fontFamily: 'Manrope, sans-serif',
            fontSize: '0.48rem',
            letterSpacing: '0.58rem',
            textTransform: 'uppercase',
            color: 'rgba(196,122,92,0.75)',
          }}
        >
          Editorial Menswear
        </p>

        {/* Progress bar */}
        <div
          style={{
            marginTop: '2.8rem',
            width: '160px',
            height: '1px',
            background: 'rgba(255,255,255,0.07)',
            overflow: 'hidden',
            marginInline: 'auto',
          }}
        >
          <div
            ref={progressRef}
            style={{
              height: '100%',
              background: 'linear-gradient(to right, #9C5A40, #C47A5C, #E0AB94)',
              transform: 'scaleX(0)',
              transformOrigin: 'left',
            }}
          />
        </div>

      </div>
    </div>
  );
}
