"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { units } from "@/data/units";
import { useProgress } from "@/contexts/progress-context";
import { unitConfigs } from "@/units/registry";
import { ThemeToggle } from "@/components/theme-toggle";

/* ─── Floating equations that drift across the hero ─── */
const EQUATIONS = [
  "F = ma", "p = mv", "KE = ½mv²", "τ = rF sinθ",
  "W = Fd cosθ", "T = 2π√(L/g)", "P = ΔE/Δt", "v = v₀ + at",
  "ΣF = 0", "L = Iω", "ρgh", "A₁v₁ = A₂v₂",
];

function FloatingEquations() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none" aria-hidden>
      {EQUATIONS.map((eq, i) => (
        <span
          key={i}
          className="absolute font-mono text-foreground/[0.04] text-sm whitespace-nowrap"
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

/* ─── Animated orbital rings in hero ─── */
function OrbitalRings() {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none" aria-hidden>
      {[180, 260, 350].map((size, i) => (
        <div
          key={i}
          className="absolute rounded-full border"
          style={{
            width: size,
            height: size,
            borderColor: `oklch(0.7 0.15 ${220 + i * 40} / ${0.08 + i * 0.03})`,
            animationName: "spin",
            animationDuration: `${25 + i * 12}s`,
            animationTimingFunction: "linear",
            animationIterationCount: "infinite",
            animationDirection: i % 2 === 0 ? "normal" : "reverse",
            transform: `rotate(${i * 30}deg)`,
          }}
        >
          {/* Orbiting dot */}
          <div
            className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full"
            style={{
              backgroundColor: `oklch(0.75 0.2 ${220 + i * 40})`,
              boxShadow: `0 0 8px oklch(0.75 0.2 ${220 + i * 40} / 0.6)`,
            }}
          />
        </div>
      ))}
    </div>
  );
}

/* ─── Circular progress ring ─── */
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

/* ─── Unit icon SVGs ─── */
function UnitIcon({ slug, className = "" }: { slug: string; className?: string }) {
  const props = { width: 20, height: 20, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, className };
  switch (slug) {
    case "kinematics": return <svg {...props}><path d="M5 12h14M12 5l7 7-7 7" /></svg>;
    case "dynamics": return <svg {...props}><path d="M12 2v20M2 12h20" /><circle cx="12" cy="12" r="3" /></svg>;
    case "energy": return <svg {...props}><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>;
    case "momentum": return <svg {...props}><circle cx="8" cy="12" r="3" /><circle cx="18" cy="12" r="2" /><path d="M5 12h6M15 12h1" /></svg>;
    case "torque": return <svg {...props}><path d="M12 3v18M8 7l4-4 4 4" /><circle cx="12" cy="12" r="8" /></svg>;
    case "rotating-systems": return <svg {...props}><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="3" /><path d="M12 3v6M12 15v6" /></svg>;
    case "oscillations": return <svg {...props}><path d="M2 12c2-4 4-8 6-8s4 16 6 16 4-8 6-8" /></svg>;
    case "fluids": return <svg {...props}><path d="M12 2v6M8 8c0 8-4 6-4 10a8 8 0 0016 0c0-4-4-2-4-10" /></svg>;
    default: return null;
  }
}

/* ─── Stat card for exam info ─── */
function StatCard({ value, label, sublabel }: { value: string; label: string; sublabel: string }) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-foreground/[0.06] bg-foreground/[0.02] p-6 backdrop-blur-sm transition-all hover:border-foreground/[0.12] hover:bg-foreground/[0.04]">
      <div className="text-3xl font-bold font-mono text-foreground/90 tracking-tight">{value}</div>
      <div className="mt-1 text-sm font-medium text-foreground/60">{label}</div>
      <div className="mt-0.5 text-xs text-foreground/30">{sublabel}</div>
    </div>
  );
}

/* ─── Main Page ─── */
export default function HomePage() {
  const { getProgress, getOverallProgress } = useProgress();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const unitTotals: Record<string, number> = {};
  for (const unit of units) {
    const config = unitConfigs[unit.slug];
    unitTotals[unit.slug] = config?.learnTopicIds.length ?? 0;
  }
  const overall = getOverallProgress(unitTotals);
  const totalTopics = Object.values(unitTotals).reduce((a, b) => a + b, 0);

  return (
    <div className="min-h-dvh bg-background text-foreground">
      {/* Theme toggle — fixed top right */}
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle className="bg-card/80 backdrop-blur-sm border border-border shadow-sm" />
      </div>

      {/* ═══════════ HERO ═══════════ */}
      <section className="relative overflow-hidden">
        {/* Background gradient layers */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,oklch(0.25_0.12_270_/_0.15),transparent)]" />

        <FloatingEquations />
        <OrbitalRings />

        <div className="relative mx-auto max-w-6xl px-4 pb-16 pt-20 sm:px-6 sm:pt-28 lg:px-8 lg:pt-36">
          <div className="flex flex-col items-center text-center">
            {/* Badge */}
            <div
              className={`mb-6 inline-flex items-center gap-2 rounded-full border border-foreground/10 bg-foreground/[0.04] px-4 py-1.5 text-xs font-medium text-foreground/60 backdrop-blur-md transition-all duration-700 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              College Board 2024–25 CED
            </div>

            {/* Title */}
            <h1
              className={`text-5xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl transition-all duration-700 delay-100 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
            >
              <span className="bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent">
                AP Physics 1
              </span>
            </h1>

            <p
              className={`mt-4 max-w-lg text-base text-foreground/40 leading-relaxed sm:text-lg transition-all duration-700 delay-200 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
            >
              Interactive simulations, practice quizzes, flashcards, and FRQ prep across all 8 units.
            </p>

            {/* Progress ring */}
            <div className={`mt-10 transition-all duration-1000 delay-500 ${mounted ? "opacity-100 scale-100" : "opacity-0 scale-75"}`}>
              <ProgressRing progress={overall} size={130} />
            </div>

            {/* Quick stats row */}
            <div className={`mt-8 flex items-center gap-6 text-xs text-foreground/30 transition-all duration-700 delay-700 ${mounted ? "opacity-100" : "opacity-0"}`}>
              <span><strong className="text-foreground/60 font-mono">{units.length}</strong> units</span>
              <span className="h-3 w-px bg-foreground/10" />
              <span><strong className="text-foreground/60 font-mono">{totalTopics}</strong> topics</span>
              <span className="h-3 w-px bg-foreground/10" />
              <span><strong className="text-foreground/60 font-mono">160+</strong> questions</span>
              <span className="h-3 w-px bg-foreground/10" />
              <span><strong className="text-foreground/60 font-mono">200+</strong> flashcards</span>
            </div>
          </div>
        </div>

        {/* Fade to content */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* ═══════════ UNIT GRID ═══════════ */}
      <section className="relative mx-auto max-w-6xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-lg font-semibold text-foreground/80">All Units</h2>
            <p className="text-sm text-foreground/30">Choose a unit to begin studying</p>
          </div>
          <span className="hidden text-xs text-foreground/20 font-mono sm:block">
            {Math.round(overall)}% overall
          </span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {units.map((unit, i) => {
            const config = unitConfigs[unit.slug];
            const topicCount = config?.learnTopicIds.length ?? 0;
            const progress = getProgress(unit.slug, topicCount);
            const isAvailable = !!config;

            const card = (
              <div
                className={`group relative overflow-hidden rounded-2xl border transition-all duration-300 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                style={{
                  transitionDelay: `${400 + i * 80}ms`,
                  borderColor: isAvailable ? `color-mix(in oklch, ${unit.color} 20%, transparent)` : "oklch(1 0 0 / 0.04)",
                  background: isAvailable
                    ? `linear-gradient(135deg, color-mix(in oklch, ${unit.color} 6%, oklch(0.13 0.02 260)) 0%, oklch(0.12 0.015 260) 100%)`
                    : "oklch(1 0 0 / 0.02)",
                }}
              >
                {/* Glow effect on hover */}
                {isAvailable && (
                  <div
                    className="absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                    style={{
                      background: `radial-gradient(400px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), color-mix(in oklch, ${unit.color} 15%, transparent), transparent 60%)`,
                    }}
                  />
                )}

                <div className="relative p-5">
                  {/* Header row */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="flex h-10 w-10 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110"
                        style={{
                          backgroundColor: `color-mix(in oklch, ${unit.color} 15%, transparent)`,
                          color: unit.color,
                        }}
                      >
                        <UnitIcon slug={unit.slug} />
                      </div>
                      <div>
                        <span className="text-[10px] font-mono uppercase tracking-widest text-foreground/25">
                          Unit {unit.number}
                        </span>
                      </div>
                    </div>
                    <span
                      className="rounded-full px-2.5 py-1 text-[10px] font-mono font-medium"
                      style={{
                        backgroundColor: `color-mix(in oklch, ${unit.color} 10%, transparent)`,
                        color: `color-mix(in oklch, ${unit.color} 80%, white)`,
                      }}
                    >
                      {unit.examWeight}
                    </span>
                  </div>

                  {/* Title + description */}
                  <h3 className="text-sm font-semibold text-foreground/90 leading-tight mb-1.5 transition-colors group-hover:text-foreground">
                    {unit.name}
                  </h3>
                  <p className="text-xs text-foreground/30 leading-relaxed line-clamp-2 mb-5">
                    {unit.description}
                  </p>

                  {/* Progress or locked */}
                  {isAvailable ? (
                    <div>
                      <div className="flex items-center justify-between text-[10px] mb-1.5">
                        <span className="text-foreground/30">{topicCount} topics</span>
                        <span className="font-mono text-foreground/50">{Math.round(progress)}%</span>
                      </div>
                      <div className="h-1 rounded-full bg-foreground/[0.06] overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{
                            width: `${Math.max(progress, 0)}%`,
                            background: `linear-gradient(90deg, ${unit.color}, color-mix(in oklch, ${unit.color} 70%, white))`,
                          }}
                        />
                      </div>
                      {/* Hover CTA */}
                      <div className="mt-4 flex items-center gap-1.5 text-[11px] font-medium opacity-0 translate-y-1 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0"
                        style={{ color: unit.color }}
                      >
                        {progress > 0 ? "Continue studying" : "Start learning"}
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-[10px] text-foreground/20">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                        <path d="M7 11V7a5 5 0 0110 0v4" />
                      </svg>
                      Coming soon
                    </div>
                  )}
                </div>
              </div>
            );

            if (isAvailable) {
              return (
                <Link key={unit.slug} href={`/${unit.slug}`} className="no-underline outline-none focus-visible:ring-2 focus-visible:ring-white/20 rounded-2xl">
                  {card}
                </Link>
              );
            }
            return <div key={unit.slug}>{card}</div>;
          })}
        </div>
      </section>

      {/* ═══════════ EXAM WEIGHTAGE ═══════════ */}
      <section className="relative mx-auto max-w-6xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-foreground/[0.06] bg-foreground/[0.02] p-6 sm:p-8 backdrop-blur-sm">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <h2 className="text-lg font-semibold text-foreground/80">Exam Weightage</h2>
              <p className="text-sm text-foreground/30">Multiple-choice section distribution by unit</p>
            </div>
            <span className="hidden text-[10px] text-foreground/20 font-mono sm:block">% of MC questions</span>
          </div>

          <div className="space-y-3">
            {units.map((unit) => {
              // Parse the weight range, e.g. "10–15%" → use midpoint for bar width
              const match = unit.examWeight.match(/(\d+)[–-](\d+)/);
              const low = match ? parseInt(match[1]) : 5;
              const high = match ? parseInt(match[2]) : 10;
              const mid = (low + high) / 2;
              // Scale so the widest bar (23%) fills ~85% of the container
              const barWidth = (mid / 23) * 85;

              return (
                <div key={unit.slug} className="group flex items-center gap-3">
                  {/* Unit label */}
                  <div className="w-28 shrink-0 text-right sm:w-36">
                    <span className="text-xs font-medium text-foreground/50 group-hover:text-foreground/70 transition-colors">
                      {unit.shortName}
                    </span>
                  </div>

                  {/* Bar */}
                  <div className="flex-1 h-6 rounded-lg bg-foreground/[0.03] overflow-hidden relative">
                    <div
                      className="h-full rounded-lg transition-all duration-700 flex items-center justify-end pr-2.5"
                      style={{
                        width: `${barWidth}%`,
                        background: `linear-gradient(90deg, color-mix(in oklch, ${unit.color} 40%, transparent), color-mix(in oklch, ${unit.color} 70%, transparent))`,
                      }}
                    >
                      <span className="text-[10px] font-mono font-semibold text-foreground/80">
                        {unit.examWeight}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="mt-6 pt-4 border-t border-foreground/[0.04] flex flex-wrap gap-x-6 gap-y-2">
            <div className="flex items-center gap-2 text-[10px] text-foreground/25">
              <div className="h-2 w-2 rounded-full bg-amber-500/60" />
              <span>High weight (18–23%): Dynamics, Energy</span>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-foreground/25">
              <div className="h-2 w-2 rounded-full bg-blue-500/60" />
              <span>Medium (10–15%): Kinematics, Momentum, Torque, Fluids</span>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-foreground/25">
              <div className="h-2 w-2 rounded-full bg-teal-500/60" />
              <span>Lower (5–8%): Rotating Systems, Oscillations</span>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ EXAM INFO ═══════════ */}
      <section className="relative border-t border-foreground/[0.04]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_100%,oklch(0.2_0.06_260_/_0.2),transparent)]" />
        <div className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <h2 className="text-xl font-semibold text-foreground/80">About the Exam</h2>
            <p className="mt-1 text-sm text-foreground/30">AP Physics 1: Algebra-Based</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard value="40" label="Multiple Choice" sublabel="90 minutes · 50% of score" />
            <StatCard value="5" label="Free Response" sublabel="90 minutes · 50% of score" />
            <StatCard value="3h" label="Total Duration" sublabel="Calculator allowed throughout" />
            <StatCard value="5" label="Score Scale" sublabel="3+ qualifies for credit" />
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {[
              { icon: "📐", title: "Algebra-Based", desc: "No calculus required. Uses algebra, geometry, and trigonometry." },
              { icon: "📊", title: "Equation Sheet", desc: "A reference table of equations and constants is provided during the exam." },
              { icon: "🧪", title: "Lab Skills", desc: "Experimental design and data analysis questions appear on the exam." },
            ].map((item) => (
              <div key={item.title} className="flex gap-3 rounded-xl border border-foreground/[0.04] bg-foreground/[0.02] p-4">
                <span className="text-lg">{item.icon}</span>
                <div>
                  <h4 className="text-sm font-medium text-foreground/70">{item.title}</h4>
                  <p className="mt-0.5 text-xs text-foreground/30 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ FOOTER ═══════════ */}
      <footer className="border-t border-foreground/[0.04] py-8">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
            <p className="text-xs text-foreground/20">
              AP Physics 1 Study Guide · Built for the 2024–25 College Board CED
            </p>
            <p className="text-xs text-foreground/10">
              Not affiliated with College Board
            </p>
          </div>
        </div>
      </footer>

      {/* ═══════════ CSS ANIMATIONS ═══════════ */}
      <style>{`
        @keyframes float-drift {
          0% { transform: translateY(0) translateX(0); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(-60px) translateX(30px); opacity: 0; }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
