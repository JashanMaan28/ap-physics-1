"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { unitConfigs, units } from "@/units/registry";
import { useProgress } from "@/contexts/progress-context";
import { Confetti } from "@/components/effects/confetti";

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

export function UnitGrid({ mounted, enterDone, overall }: { mounted: boolean; enterDone: boolean; overall: number }) {
  const { getProgress } = useProgress();
  const [confettiColor, setConfettiColor] = useState<string | null>(null);
  const [weightCard, setWeightCard] = useState<{ slug: string; mass: number } | null>(null);
  const holdTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [confettiShown] = useState<Set<string>>(() => {
    try {
      const saved = typeof window !== "undefined" ? localStorage.getItem("ap-physics-confetti-shown") : null;
      return saved ? new Set(JSON.parse(saved) as string[]) : new Set();
    } catch { return new Set(); }
  });

  useEffect(() => {
    if (!mounted) return;
    for (const unit of units) {
      const config = unitConfigs[unit.slug];
      if (!config) continue;
      const topicCount = config.learnTopicIds.length;
      const progress = getProgress(unit.slug, topicCount);
      if (progress === 100 && !confettiShown.has(unit.slug)) {
        confettiShown.add(unit.slug);
        try { localStorage.setItem("ap-physics-confetti-shown", JSON.stringify([...confettiShown])); } catch {}
        requestAnimationFrame(() => setConfettiColor(unit.color));
        break;
      }
    }
  }, [mounted, getProgress, confettiShown]);

  const handleCardHold = useCallback((slug: string) => {
    holdTimer.current = setTimeout(() => {
      const mass = (Math.random() * 50 + 1).toFixed(1);
      setWeightCard({ slug, mass: parseFloat(mass) });
      setTimeout(() => setWeightCard(null), 3000);
    }, 2000);
  }, []);

  const cancelCardHold = useCallback(() => {
    if (holdTimer.current) {
      clearTimeout(holdTimer.current);
      holdTimer.current = null;
    }
  }, []);

  return (
    <>
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
                className={`group relative overflow-hidden rounded-2xl border bg-card hover:shadow-lg hover:-translate-y-0.5 ${enterDone ? "transition-[box-shadow,transform] duration-300" : mounted ? "opacity-100 translate-y-0 transition-all duration-300" : "opacity-0 translate-y-8 transition-all duration-300"}`}
                style={{
                  transitionDelay: enterDone ? undefined : `${400 + i * 80}ms`,
                  borderColor: isAvailable ? `color-mix(in oklch, ${unit.color} 20%, transparent)` : undefined,
                }}
                onPointerDown={() => handleCardHold(unit.slug)}
                onPointerUp={cancelCardHold}
                onPointerLeave={cancelCardHold}
              >
                {isAvailable && (
                  <div
                    className="absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                    style={{
                      background: `radial-gradient(400px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), color-mix(in oklch, ${unit.color} 15%, transparent), transparent 60%)`,
                    }}
                  />
                )}

                <div className="relative p-5">
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

                  {weightCard?.slug === unit.slug && (
                    <div className="weight-tooltip absolute top-2 right-2 z-10 rounded-lg bg-foreground/90 text-background px-3 py-1.5 text-[11px] font-mono shadow-lg">
                      m = {weightCard.mass} kg &rarr; F = {(weightCard.mass * 9.8).toFixed(1)} N
                    </div>
                  )}

                  <h3 className="text-sm font-semibold text-foreground/90 leading-tight mb-1.5 transition-colors group-hover:text-foreground">
                    {unit.name}
                  </h3>
                  <p className="text-xs text-foreground/30 leading-relaxed line-clamp-2 mb-5">
                    {unit.description}
                  </p>

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

      <Confetti
        active={confettiColor !== null}
        color={confettiColor ?? undefined}
        onComplete={() => setConfettiColor(null)}
      />
    </>
  );
}
