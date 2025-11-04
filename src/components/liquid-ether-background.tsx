
'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import the heavy component with SSR turned off
const LiquidEther = dynamic(() => import('@/components/liquid-ether'), {
  ssr: false,
});

export default function LiquidEtherBackground() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // This code runs only on the client, after the component has mounted.
    setIsMounted(true);
  }, []);

  return (
    <div style={{ position: 'fixed', width: '100vw', height: '100vh', zIndex: -1 }}>
      {isMounted && (
        <LiquidEther
          colors={['#5227FF', '#FF9FFC', '#B19EEF']}
          mouseForce={20}
          cursorSize={100}
          isViscous={false}
          viscous={30}
          iterationsViscous={32}
          iterationsPoisson={32}
          resolution={0.5}
          isBounce={false}
          autoDemo={true}
          autoSpeed={0.5}
          autoIntensity={2.2}
          takeoverDuration={0.25}
          autoResumeDelay={3000}
          autoRampDuration={0.6}
        />
      )}
    </div>
  );
}
