
'use client';
import { ReactNode, useEffect, useRef } from 'react';
import Lenis from '@studio-freight/lenis';

function LenisProvider({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const lenis = new Lenis({
      smoothWheel: true,
      lerp: 0.08,
    });
    lenisRef.current = lenis;

    const raf = (time: number) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };

    requestAnimationFrame(raf);

    return () => {
      if (lenisRef.current) {
        lenisRef.current.destroy();
      }
      lenisRef.current = null;
    };
  }, []);

  return <>{children}</>;
}

export { LenisProvider };
