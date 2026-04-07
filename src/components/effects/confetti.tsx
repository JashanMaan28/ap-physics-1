"use client";

import { useEffect, useReducer, useRef, useMemo } from "react";

interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
  rotation: number;
  scale: number;
  velocityX: number;
  velocityY: number;
  delay: number;
  isCircle: boolean;
}

function generateParticles(color?: string): Particle[] {
  const colors = color
    ? [color, `color-mix(in oklch, ${color} 60%, white)`, `color-mix(in oklch, ${color} 80%, gold)`]
    : ["#6366f1", "#ec4899", "#f59e0b", "#10b981", "#3b82f6", "#ef4444"];

  return Array.from({ length: 60 }, (_, i) => ({
    id: i,
    x: 50 + (Math.random() - 0.5) * 20,
    y: 40,
    color: colors[Math.floor(Math.random() * colors.length)],
    rotation: Math.random() * 360,
    scale: 0.5 + Math.random() * 0.8,
    velocityX: (Math.random() - 0.5) * 80,
    velocityY: -(30 + Math.random() * 50),
    delay: Math.random() * 300,
    isCircle: Math.random() > 0.5,
  }));
}

type State = { particles: Particle[]; gen: number };
type Action = { type: "fire"; color?: string } | { type: "clear" };

function reducer(state: State, action: Action): State {
  if (action.type === "fire") return { particles: generateParticles(action.color), gen: state.gen + 1 };
  if (action.type === "clear") return { particles: [], gen: state.gen };
  return state;
}

export function Confetti({
  active,
  color,
  onComplete,
}: {
  active: boolean;
  color?: string;
  onComplete?: () => void;
}) {
  const [state, dispatch] = useReducer(reducer, { particles: [], gen: 0 });
  const prevActive = useRef(false);

  // Fire on rising edge of active
  useMemo(() => {
    if (active && !prevActive.current) {
      dispatch({ type: "fire", color });
    }
    prevActive.current = active;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  // Auto-clear after animation
  useEffect(() => {
    if (state.particles.length === 0) return;
    const timer = setTimeout(() => {
      dispatch({ type: "clear" });
      onComplete?.();
    }, 2500);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.gen, onComplete]);

  if (state.particles.length === 0) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden" aria-hidden>
      {state.particles.map((p) => (
        <div
          key={p.id}
          className="absolute"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: 8 * p.scale,
            height: 8 * p.scale,
            backgroundColor: p.color,
            borderRadius: p.isCircle ? "50%" : "2px",
            transform: `rotate(${p.rotation}deg)`,
            animation: `confetti-fall 2s ease-out ${p.delay}ms forwards`,
            ["--vx" as string]: `${p.velocityX}px`,
            ["--vy" as string]: `${p.velocityY}px`,
          }}
        />
      ))}
      <style>{`
        @keyframes confetti-fall {
          0% {
            transform: translate(0, 0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translate(var(--vx), calc(var(--vy) + 400px)) rotate(720deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
