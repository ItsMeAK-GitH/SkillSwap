
'use client';
import { useEffect, useRef, useCallback, useMemo } from 'react';
import { gsap } from 'gsap';
import './TargetCursor.css';

const TargetCursor = ({ targetSelector = '.cursor-target', spinDuration = 4, hideDefaultCursor = true }) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const cornersWrapperRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const textBarRef = useRef<HTMLDivElement>(null);

  const spinTl = useRef<gsap.core.Timeline | null>(null);
  const activeState = useRef<'idle' | 'text' | 'target'>('idle');
  const activeTargetRef = useRef<HTMLElement | null>(null);

  const constants = useMemo(
    () => ({
      borderWidth: 3,
      cornerSize: 12,
      parallaxStrength: 0.05
    }),
    []
  );
  
  const moveCursor = useCallback((x: number, y: number) => {
    if (!wrapperRef.current) return;
    gsap.to(wrapperRef.current, {
      x,
      y,
      duration: 0.2,
      ease: 'power3.out'
    });
  }, []);

  // Function to create and start the idle spinning animation
  const startIdleAnimation = useCallback(() => {
    if (!cornersWrapperRef.current) return;
    if (spinTl.current) spinTl.current.kill();
    
    gsap.set(cornersWrapperRef.current, { rotation: -45 });
    spinTl.current = gsap.timeline({ repeat: -1, paused: false })
      .to(cornersWrapperRef.current, {
        rotation: '-=360',
        duration: spinDuration,
        ease: 'none'
      });
  }, [spinDuration]);
  
  // Function to stop the idle spinning animation
  const stopIdleAnimation = useCallback(() => {
    spinTl.current?.pause();
    if(cornersWrapperRef.current) {
        gsap.to(cornersWrapperRef.current, { rotation: 0, duration: 0.2 });
    }
  }, []);


  useEffect(() => {
    if (!wrapperRef.current) return;

    const originalCursor = document.body.style.cursor;
    if (hideDefaultCursor) {
      document.body.style.cursor = 'none';
    }

    const wrapper = wrapperRef.current;
    const corners = cornersWrapperRef.current ? (Array.from(cornersWrapperRef.current.querySelectorAll('.target-cursor-corner')) as HTMLDivElement[]) : [];
    
    gsap.set(wrapper, { xPercent: -50, yPercent: -50, x: window.innerWidth / 2, y: window.innerHeight / 2 });
    
    startIdleAnimation();

    const targetMoveHandler = (ev: MouseEvent) => {
      const target = ev.currentTarget as HTMLElement;
      if (!target || !wrapper) return;
      
      const rect = target.getBoundingClientRect();
      const wrapperRect = wrapper.getBoundingClientRect();

      const wrapperCenterX = wrapperRect.left;
      const wrapperCenterY = wrapperRect.top;

      const targetCenterX = rect.left + rect.width / 2;
      const targetCenterY = rect.top + rect.height / 2;

      const mouseOffsetX = (ev.clientX - targetCenterX) * constants.parallaxStrength;
      const mouseOffsetY = (ev.clientY - targetCenterY) * constants.parallaxStrength;

      const offsets = [
        { x: rect.left - wrapperCenterX - constants.borderWidth + mouseOffsetX, y: rect.top - wrapperCenterY - constants.borderWidth + mouseOffsetY },
        { x: rect.right - wrapperCenterX + constants.borderWidth - constants.cornerSize + mouseOffsetX, y: rect.top - wrapperCenterY - constants.borderWidth + mouseOffsetY },
        { x: rect.right - wrapperCenterX + constants.borderWidth - constants.cornerSize + mouseOffsetX, y: rect.bottom - wrapperCenterY + constants.borderWidth - constants.cornerSize + mouseOffsetY },
        { x: rect.left - wrapperCenterX - constants.borderWidth + mouseOffsetX, y: rect.bottom - wrapperCenterY + constants.borderWidth - constants.cornerSize + mouseOffsetY },
      ];
      
      gsap.to(corners, {
        x: (i) => offsets[i].x,
        y: (i) => offsets[i].y,
        duration: 0.3,
        ease: 'power2.out',
      });
    };

    const enterTargetHandler = (target: HTMLElement) => {
        if(activeState.current === 'target') return;
        activeState.current = 'target';
        activeTargetRef.current = target;
        wrapper.classList.add('target-hover');
        wrapper.classList.remove('text-hover');

        stopIdleAnimation();
        
        const rect = target.getBoundingClientRect();
        const wrapperRect = wrapper.getBoundingClientRect();
        const wrapperCenterX = wrapperRect.left;
        const wrapperCenterY = wrapperRect.top;

        const offsets = [
            { x: rect.left - wrapperCenterX - constants.borderWidth, y: rect.top - wrapperCenterY - constants.borderWidth },
            { x: rect.right - wrapperCenterX + constants.borderWidth - constants.cornerSize, y: rect.top - wrapperCenterY - constants.borderWidth },
            { x: rect.right - wrapperCenterX + constants.borderWidth - constants.cornerSize, y: rect.bottom - wrapperCenterY + constants.borderWidth - constants.cornerSize },
            { x: rect.left - wrapperCenterX - constants.borderWidth, y: rect.bottom - wrapperCenterY + constants.borderWidth - constants.cornerSize },
        ];
        
        gsap.to(corners, {
          x: (i) => offsets[i].x,
          y: (i) => offsets[i].y,
          duration: 0.3,
          ease: 'power3.out',
        });

        target.addEventListener('mousemove', targetMoveHandler);
    };
    
    const leaveTargetHandler = () => {
      const target = activeTargetRef.current;
      if (!target || activeState.current !== 'target') return;

      activeState.current = 'idle';
      activeTargetRef.current = null;
      wrapper.classList.remove('target-hover');
      
      target.removeEventListener('mousemove', targetMoveHandler);

      const { cornerSize } = constants;
      const positions = [
        { x: -cornerSize * 1.5, y: -cornerSize * 1.5 },
        { x: cornerSize * 0.5, y: -cornerSize * 1.5 },
        { x: cornerSize * 0.5, y: cornerSize * 0.5 },
        { x: -cornerSize * 1.5, y: cornerSize * 0.5 }
      ];

      gsap.to(corners, {
        x: (i) => positions[i].x,
        y: (i) => positions[i].y,
        duration: 0.3,
        ease: 'power3.out',
        onComplete: () => {
          if (activeState.current === 'idle') {
            startIdleAnimation();
          }
        }
      });
    };
    
    const moveHandler = (e: MouseEvent) => {
      moveCursor(e.clientX, e.clientY);
      
      const targetEl = e.target as HTMLElement;
      const closestTarget = targetEl.closest(targetSelector) as HTMLElement | null;

      if (closestTarget) {
          enterTargetHandler(closestTarget);
      } else if (activeState.current === 'target') {
          leaveTargetHandler();
      }
      
      const isOverText = !closestTarget && (window.getComputedStyle(targetEl).cursor === 'text' || ['P', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'SPAN', 'A', 'LI', 'BLOCKQUOTE', 'LABEL', 'INPUT', 'TEXTAREA'].includes(targetEl.tagName));

      if (isOverText) {
        if(activeState.current !== 'text') {
            activeState.current = 'text';
            wrapper.classList.add('text-hover');
            wrapper.classList.remove('target-hover');
            spinTl.current?.pause();
        }
        if (textBarRef.current) {
            const computedStyle = window.getComputedStyle(targetEl);
            const fontSize = parseFloat(computedStyle.fontSize);
            gsap.to(textBarRef.current, { height: fontSize * 1.2, duration: 0.2, ease: 'power2.out' });
        }
      } else if (activeState.current === 'text') {
        activeState.current = 'idle';
        wrapper.classList.remove('text-hover');
        if (!closestTarget) {
            startIdleAnimation();
        }
      }
    };
    
    const mouseDownHandler = () => {
      gsap.to([dotRef.current, textBarRef.current], { scale: 0.7, duration: 0.3 });
      if(activeState.current === 'target') gsap.to(cornersWrapperRef.current, { scale: 0.9, duration: 0.2 });
    };

    const mouseUpHandler = () => {
      gsap.to([dotRef.current, textBarRef.current], { scale: 1, duration: 0.3 });
      if(activeState.current === 'target') gsap.to(cornersWrapperRef.current, { scale: 1, duration: 0.2 });
    };
    
    window.addEventListener('mousemove', moveHandler);
    window.addEventListener('mousedown', mouseDownHandler);
    window.addEventListener('mouseup', mouseUpHandler);

    return () => {
      window.removeEventListener('mousemove', moveHandler);
      window.removeEventListener('mousedown', mouseDownHandler);
      window.removeEventListener('mouseup', mouseUpHandler);
      if (activeTargetRef.current) {
        activeTargetRef.current.removeEventListener('mousemove', targetMoveHandler);
      }
      spinTl.current?.kill();
      document.body.style.cursor = originalCursor;
    };
  }, [targetSelector, spinDuration, moveCursor, constants, hideDefaultCursor, startIdleAnimation, stopIdleAnimation]);


  return (
    <div ref={wrapperRef} className="target-cursor-wrapper">
      <div ref={dotRef} className="target-cursor-dot" />
      <div ref={textBarRef} className="text-cursor-bar" />
      <div ref={cornersWrapperRef} className="target-cursor-corners-wrapper">
        <div className="target-cursor-corner corner-tl" />
        <div className="target-cursor-corner corner-tr" />
        <div className="target-cursor-corner corner-br" />
        <div className="target-cursor-corner corner-bl" />
      </div>
    </div>
  );
};

export default TargetCursor;
