
'use client';

import React, { useEffect, useRef } from 'react';

const MatrixRain: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const setup = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      const columns = Math.floor(canvas.width / 20);
      const drops: number[] = [];
      for (let i = 0; i < columns; i++) {
        drops[i] = 1;
      }
      return { drops, columns };
    };

    let { drops, columns } = setup();

    const draw = () => {
      // The semi-transparent black background creates the trailing effect
      ctx.fillStyle = 'rgba(10, 10, 10, 0.04)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // The color for the falling characters
      ctx.fillStyle = 'hsl(var(--muted-foreground))';
      ctx.font = '15pt monospace';

      for (let i = 0; i < drops.length; i++) {
        const text = Math.random() > 0.5 ? '1' : '0';
        ctx.fillText(text, i * 20, drops[i] * 20);

        if (drops[i] * 20 > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    const render = () => {
      draw();
      animationFrameId = window.requestAnimationFrame(render);
    };
    
    render();

    const handleResize = () => {
        window.cancelAnimationFrame(animationFrameId);
        ({ drops, columns } = setup());
        render();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full -z-20"
      data-lenis-parallax
      data-lenis-parallax-factor="-0.2"
    />
  );
};

export default MatrixRain;
