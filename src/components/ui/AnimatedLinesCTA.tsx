'use client';

import { useEffect, useRef } from 'react';
import { animate } from 'animejs';

interface AnimatedLinesCTAProps {
  className?: string;
}

export function AnimatedLinesCTA({ className = '' }: AnimatedLinesCTAProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const horizontalLines = container.querySelectorAll<SVGLineElement>('[data-line="h"]');
    const verticalLines = container.querySelectorAll<SVGLineElement>('[data-line="v"]');
    const diagonalLines = container.querySelectorAll<SVGLineElement>('[data-line="d"]');
    const pulseDots = container.querySelectorAll<SVGCircleElement>('[data-pulse]');

    const cleanup: Array<() => void> = [];

    // Líneas horizontales - atraviesan de izquierda a derecha
    horizontalLines.forEach((line, i) => {
      const length = line.getTotalLength?.() || 1000;
      const anim = animate(line, {
        strokeDasharray: [length, length],
        strokeDashoffset: [length, 0],
        opacity: [0, 0.9, 0.9, 0],
        translateX: ['-30%', 'calc(100vw + 30%)'],
        duration: 2800,
        delay: i * 220,
        loop: true,
        easing: 'linear',
      });
      cleanup.push(() => anim.pause());
    });

    // Líneas verticales - atraviesan de arriba a abajo
    verticalLines.forEach((line, i) => {
      const length = line.getTotalLength?.() || 600;
      const anim = animate(line, {
        strokeDasharray: [length, length],
        strokeDashoffset: [length, 0],
        opacity: [0, 0.85, 0.85, 0],
        translateY: ['-30%', 'calc(100vh + 30%)'],
        duration: 3500,
        delay: i * 200,
        loop: true,
        easing: 'linear',
      });
      cleanup.push(() => anim.pause());
    });

    // Diagonales - barrido horizontal con leve ángulo
    diagonalLines.forEach((line, i) => {
      const anim = animate(line, {
        opacity: [0, 0.8, 0.8, 0],
        translateX: ['-25%', 'calc(100vw + 25%)'],
        duration: 4000,
        delay: i * 600,
        loop: true,
        easing: 'linear',
      });
      cleanup.push(() => anim.pause());
    });

    // Pulsos (puntos amber que aparecen y desaparecen)
    pulseDots.forEach((dot, i) => {
      const anim = animate(dot, {
        opacity: [0, 0.9, 0],
        scale: [0.5, 1.6, 0.5],
        duration: 1800,
        delay: i * 250,
        loop: true,
        easing: 'easeInOutSine',
      });
      cleanup.push(() => anim.pause());
    });

    return () => {
      cleanup.forEach((fn) => fn());
    };
  }, []);

  return (
    <div ref={containerRef} className={`absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
      <svg
        className="absolute inset-0 h-full w-full"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="aH1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#fbbf24" stopOpacity="0" />
            <stop offset="50%" stopColor="#fde047" stopOpacity="1" />
            <stop offset="100%" stopColor="#fbbf24" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="aH2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f59e0b" stopOpacity="0" />
            <stop offset="50%" stopColor="#fef08a" stopOpacity="1" />
            <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="aV1" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fbbf24" stopOpacity="0" />
            <stop offset="50%" stopColor="#fcd34d" stopOpacity="1" />
            <stop offset="100%" stopColor="#fbbf24" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="aV2" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#f59e0b" stopOpacity="0" />
            <stop offset="50%" stopColor="#fef08a" stopOpacity="1" />
            <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Líneas horizontales - atraviesan de izquierda a derecha */}
        {Array.from({ length: 10 }).map((_, i) => {
          const y = 10 + i * 9;
          const grad = i % 2 === 0 ? 'url(#aH1)' : 'url(#aH2)';
          return (
            <line
              key={`h-${i}`}
              data-line="h"
              x1="0"
              y1={`${y}%`}
              x2="800"
              y2={`${y}%`}
              stroke={grad}
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          );
        })}

        {/* Líneas verticales - atraviesan de arriba a abajo */}
        {Array.from({ length: 12 }).map((_, i) => {
          const x = 4 + i * 8;
          const grad = i % 2 === 0 ? 'url(#aV1)' : 'url(#aV2)';
          return (
            <line
              key={`v-${i}`}
              data-line="v"
              x1={`${x}%`}
              y1="0"
              x2={`${x}%`}
              y2="600"
              stroke={grad}
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          );
        })}

        {/* Diagonales - rayas inclinadas */}
        {Array.from({ length: 3 }).map((_, i) => {
          const yPos = 25 + i * 25;
          return (
            <line
              key={`d-${i}`}
              data-line="d"
              x1="0"
              y1={`${yPos}%`}
              x2="600"
              y2={`${yPos + 10}%`}
              stroke="url(#aH1)"
              strokeWidth="1"
              strokeLinecap="round"
            />
          );
        })}

        {/* Pulsos de puntos amber */}
        {Array.from({ length: 8 }).map((_, i) => {
          const cx = 10 + i * 11;
          const cy = 15 + (i % 4) * 22;
          return (
            <circle
              key={`p-${i}`}
              data-pulse
              cx={`${cx}%`}
              cy={`${cy}%`}
              r="2"
              fill="#fde047"
            />
          );
        })}
      </svg>

      {/* Glow amber central */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-amber-400/10 blur-3xl pointer-events-none" />
      {/* Vignette */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-transparent to-slate-950 pointer-events-none" />
    </div>
  );
}