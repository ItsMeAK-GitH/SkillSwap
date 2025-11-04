
'use client';

import { useState, useEffect, useRef } from 'react';
import './ConnectingLines.css';

interface Line {
  id: string;
  d: string;
  length: number;
}

interface ConnectingLinesProps {
  numElements: number;
  sourceElementId: string;
  elementClassName: string;
}

const ConnectingLines = ({ numElements, sourceElementId, elementClassName }: ConnectingLinesProps) => {
  const [lines, setLines] = useState<Line[]>([]);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const calculateLines = () => {
      const sourceEl = document.getElementById(sourceElementId);
      const targetEls = document.getElementsByClassName(elementClassName) as HTMLCollectionOf<HTMLElement>;
      
      if (!sourceEl || targetEls.length !== numElements) {
        // Retry if elements are not yet in the DOM
        requestAnimationFrame(calculateLines);
        return;
      }

      const svg = svgRef.current;
      if (!svg) return;

      const svgRect = svg.getBoundingClientRect();
      const sourceRect = sourceEl.getBoundingClientRect();
      
      const sourceX = sourceRect.left + sourceRect.width / 2 - svgRect.left;
      const sourceY = sourceRect.top + sourceRect.height / 2 - svgRect.top;

      const newLines: Line[] = [];

      for (let i = 0; i < targetEls.length; i++) {
        const targetEl = targetEls[i];
        const targetRect = targetEl.getBoundingClientRect();
        
        const targetX = targetRect.left + targetRect.width / 2 - svgRect.left;
        const targetY = targetRect.top - svgRect.top; // Connect to the top-middle of the card

        // Create a simple path with a slight curve for aesthetic
        const d = `M ${sourceX} ${sourceY} Q ${sourceX} ${sourceY - 100}, ${targetX} ${targetY}`;
        
        // Create a temporary path element to measure its length for the animation
        const tempPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        tempPath.setAttribute('d', d);
        const length = tempPath.getTotalLength();

        newLines.push({
          id: `line-${i}`,
          d,
          length,
        });
      }

      setLines(newLines);
    };

    // Initial calculation
    calculateLines();

    // Recalculate on window resize
    window.addEventListener('resize', calculateLines);
    return () => window.removeEventListener('resize', calculateLines);
  }, [numElements, sourceElementId, elementClassName]);

  return (
    <svg ref={svgRef} className="connecting-lines-svg">
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <g filter="url(#glow)">
        {lines.map((line, index) => (
          <path
            key={line.id}
            d={line.d}
            className="connecting-line"
            strokeDasharray={line.length}
            strokeDashoffset={line.length}
            style={{ animationDelay: `${index * 0.2}s` }}
          />
        ))}
      </g>
    </svg>
  );
};

export default ConnectingLines;
