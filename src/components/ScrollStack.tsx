
'use client';

import { useLayoutEffect, useRef, useCallback } from 'react';
import './ScrollStack.css';

export const ScrollStackItem = ({ children, itemClassName = '' }: { children: React.ReactNode, itemClassName?: string }) => (
  <div className={`scroll-stack-card ${itemClassName}`.trim()}>{children}</div>
);

const ScrollStack = ({
  children,
  className = '',
  itemDistance = 100,
  itemScale = 0.03,
  itemStackDistance = 30,
  stackPosition = '20%',
  rotationAmount = 0,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);
  const animationFrameRef = useRef<number | null>(null);

  const updateCardTransforms = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const scrollY = window.scrollY;
    const containerRect = container.getBoundingClientRect();
    const containerTop = containerRect.top + scrollY;
    const viewportHeight = window.innerHeight;
    const stackPositionPx = (parseFloat(stackPosition) / 100) * viewportHeight;

    cardsRef.current.forEach((card, i) => {
      if (!card) return;
      const cardRect = card.getBoundingClientRect();
      const cardTop = cardRect.top + scrollY;

      // When the card should start and end its animation
      const start = cardTop - viewportHeight;
      const end = containerTop + containerRect.height - viewportHeight;

      const progress = Math.max(0, Math.min(1, (scrollY - start) / (end - start)));
      
      const scale = 1 - (cardsRef.current.length - 1 - i) * itemScale * progress;
      const rotation = -rotationAmount * (1 - scale);
      
      card.style.transform = `scale(${scale}) rotate(${rotation}deg)`;
    });

    animationFrameRef.current = requestAnimationFrame(updateCardTransforms);
  }, [itemScale, rotationAmount, stackPosition]);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    cardsRef.current = Array.from(container.querySelectorAll('.scroll-stack-card'));

    cardsRef.current.forEach((card, i) => {
        card.style.zIndex = `${i + 1}`;
        card.style.top = `calc(${stackPosition} + ${i * itemStackDistance}px)`;
    });

    animationFrameRef.current = requestAnimationFrame(updateCardTransforms);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [stackPosition, itemStackDistance, updateCardTransforms]);

  return (
    <div className={`scroll-stack-container ${className}`.trim()} ref={containerRef}>
      <div className="scroll-stack-inner">
        {children}
      </div>
      <div className="scroll-stack-end-spacer" />
    </div>
  );
};

export default ScrollStack;
