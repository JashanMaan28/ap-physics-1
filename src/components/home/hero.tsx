"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { units } from "@/units/meta";

const EQUATIONS = [
  "F = ma", "p = mv", "KE = ½mv²", "τ = rF sinθ",
  "W = Fd cosθ", "T = 2π√(L/g)", "P = ΔE/Δt", "v = v₀ + at",
  "ΣF = 0", "L = Iω", "ρgh", "A₁v₁ = A₂v₂",
];

function FloatingEquations() {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handler = (e: DeviceOrientationEvent) => {
      const x = Math.max(-20, Math.min(20, (e.gamma ?? 0) * 0.5));
      const y = Math.max(-20, Math.min(20, (e.beta ?? 0) * 0.3));
      setTilt({ x, y });
    };
    window.addEventListener("deviceorientation", handler);
    return () => window.removeEventListener("deviceorientation", handler);
  }, []);

  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none select-none"
      aria-hidden
      style={{ transform: `translate(${tilt.x}px, ${tilt.y}px)` }}
    >
      {EQUATIONS.map((eq, i) => (
        <span
          key={i}
          className="absolute font-mono text-muted-foreground/20 text-sm whitespace-nowrap"
          style={{
            left: `${(i * 17 + 5) % 90}%`,
            top: `${(i * 23 + 10) % 85}%`,
            fontSize: `${12 + (i % 4) * 4}px`,
            animationName: "float-drift",
            animationDuration: `${18 + i * 3}s`,
            animationTimingFunction: "linear",
            animationIterationCount: "infinite",
            animationDelay: `${i * -2}s`,
          }}
        >
          {eq}
        </span>
      ))}
    </div>
  );
}

function OrbitalRings() {
  const [flung, setFlung] = useState<{ idx: number; dx: number; dy: number } | null>(null);
  const dragRef = useRef<{ startX: number; startY: number; idx: number } | null>(null);

  const handlePointerDown = (e: React.PointerEvent, idx: number) => {
    dragRef.current = { startX: e.clientX, startY: e.clientY, idx };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!dragRef.current) return;
    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;
    if (Math.abs(dx) + Math.abs(dy) > 30) {
      setFlung({ idx: dragRef.current.idx, dx: dx * 3, dy: dy * 3 });
      setTimeout(() => setFlung(null), 1000);
    }
    dragRef.current = null;
  };

  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center" aria-hidden>
      {[180, 260, 350].map((size, i) => (
        <div
          key={i}
          className="absolute rounded-full border"
          onPointerDown={(e) => handlePointerDown(e, i)}
          onPointerUp={handlePointerUp}
          style={{
            width: size,
            height: size,
            borderColor: `oklch(0.7 0.15 ${220 + i * 40} / ${0.15 + i * 0.05})`,
            animationName: flung?.idx === i ? undefined : "spin",
            animationDuration: `${25 + i * 12}s`,
            animationTimingFunction: "linear",
            animationIterationCount: "infinite",
            animationDirection: i % 2 === 0 ? "normal" : "reverse",
            transform: flung?.idx === i ? `translate(${flung.dx}px, ${flung.dy}px)` : `rotate(${i * 30}deg)`,
            transition: flung?.idx === i ? "transform 1s ease-out" : undefined,
          }}
        >
          <div
            className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full"
            style={{
              backgroundColor: `oklch(0.75 0.2 ${220 + i * 40})`,
              boxShadow: `0 0 12px oklch(0.75 0.2 ${220 + i * 40} / 0.8)`,
            }}
          />
        </div>
      ))}
    </div>
  );
}

function ProgressRing({ progress, size = 120 }: { progress: number; size?: number }) {
  const strokeWidth = 6;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke="oklch(1 0 0 / 0.06)" strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke="url(#progress-gradient)" strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference} strokeDashoffset={offset}
          className="transition-all duration-1000 ease-out"
        />
        <defs>
          <linearGradient id="progress-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="oklch(0.7 0.2 260)" />
            <stop offset="50%" stopColor="oklch(0.7 0.18 200)" />
            <stop offset="100%" stopColor="oklch(0.7 0.2 170)" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold font-mono text-foreground tracking-tight">
          {Math.round(progress)}%
        </span>
        <span className="text-[10px] text-foreground/40 uppercase tracking-widest">complete</span>
      </div>
    </div>
  );
}

export function Hero({ mounted, overall, totalTopics }: { mounted: boolean; overall: number; totalTopics: number }) {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,oklch(0.25_0.12_270_/_0.15),transparent)]" />

      <FloatingEquations />
      <OrbitalRings />

      <div className="relative z-10 mx-auto max-w-6xl px-4 pb-16 pt-20 sm:px-6 sm:pt-28 lg:px-8 lg:pt-36">
        <div className="flex flex-col items-center text-center">
          <div
            className={`mb-6 inline-flex items-center gap-2 rounded-full border border-foreground/10 bg-foreground/[0.04] px-4 py-1.5 text-xs font-medium text-foreground/60 backdrop-blur-md transition-all duration-700 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            College Board 2025–26 CED
          </div>

          <h1
            className={`text-5xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl transition-all duration-700 delay-100 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
          >
            <span className="bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent" data-title-egg>
              AP Physics 1
            </span>
          </h1>

          <p
            className={`mt-4 max-w-lg text-base text-foreground/40 leading-relaxed sm:text-lg transition-all duration-700 delay-200 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
          >
            Interactive simulations, practice quizzes, flashcards, and FRQ prep across all 8 units.
          </p>

          <div className={`mt-10 transition-all duration-1000 delay-500 ${mounted ? "opacity-100 scale-100" : "opacity-0 scale-75"}`}>
            <ProgressRing progress={overall} size={130} />
          </div>

          <div className={`mt-8 flex items-center gap-6 text-xs text-foreground/30 transition-all duration-700 delay-700 ${mounted ? "opacity-100" : "opacity-0"}`}>
            <span><strong className="text-foreground/60 font-mono">{units.length}</strong> units</span>
            <span className="h-3 w-px bg-foreground/10" />
            <span><strong className="text-foreground/60 font-mono">{totalTopics}</strong> topics</span>
            <span className="h-3 w-px bg-foreground/10" />
            <span><strong className="text-foreground/60 font-mono">160+</strong> questions</span>
            <span className="h-3 w-px bg-foreground/10" />
            <span><strong className="text-foreground/60 font-mono">200+</strong> flashcards</span>
          </div>

          <div className={`mt-8 flex flex-wrap items-center justify-center gap-3 transition-all duration-700 delay-800 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
            <Link
              href="/arcade"
              className="rounded-full border border-primary/30 bg-primary/10 px-5 py-2 text-sm font-medium text-primary transition hover:bg-primary/15"
            >
              Enter Study Arcade
            </Link>
            <Link
              href="/exam"
              className="rounded-full border border-foreground/15 bg-card/70 px-5 py-2 text-sm font-medium text-foreground/80 transition hover:bg-card"
            >
              Open Exam Mode
            </Link>
            <span className="text-xs text-foreground/30">
              Daily challenge, boss battles, focused exam blocks, and more
            </span>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}
