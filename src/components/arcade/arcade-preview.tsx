"use client";

import Link from "next/link";
import { useArcade } from "@/contexts/arcade-context";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export function ArcadePreview() {
  const {
    level,
    xp,
    streak,
    overallProgress,
    achievements,
    rematchWins,
  } = useArcade();

  const unlockedCount = achievements.filter((achievement) => achievement.unlocked).length;

  return (
    <section className="relative mx-auto max-w-6xl px-4 pb-20 sm:px-6 lg:px-8">
      <div className="overflow-hidden rounded-[2rem] border bg-card">
        <div className="grid gap-0 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="border-b p-6 sm:p-8 lg:border-b-0 lg:border-r">
            <Badge variant="outline" className="border-primary/25 bg-primary/10 text-primary">
              New Mode
            </Badge>
            <h2 className="mt-4 text-2xl font-bold tracking-tight text-foreground/90 sm:text-3xl">
              Study Arcade
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-foreground/55 sm:text-base">
              Daily challenge, mistake revenge mode, boss battles, exam drafting,
              a lab notebook, and shareable result cards now live in a cleaner
              arcade hub on top of the main study flow.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link
                href="/arcade"
                className="inline-flex h-8 items-center justify-center rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
              >
                Open arcade
              </Link>
              <span className="text-xs text-foreground/40">
                Level {level} · {xp} XP · {streak}-day streak
              </span>
            </div>
          </div>

          <div className="grid gap-3 p-6 sm:grid-cols-2 sm:p-8">
            <Card size="sm" className="border-white/8 bg-background/50">
              <CardContent className="p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-foreground/40">
                  Progress
                </p>
                <p className="mt-2 text-3xl font-black">{Math.round(overallProgress)}%</p>
                <p className="mt-1 text-xs text-foreground/55">Overall course completion</p>
              </CardContent>
            </Card>
            <Card size="sm" className="border-white/8 bg-background/50">
              <CardContent className="p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-foreground/40">
                  Achievements
                </p>
                <p className="mt-2 text-3xl font-black">{unlockedCount}</p>
                <p className="mt-1 text-xs text-foreground/55">Unlocked so far</p>
              </CardContent>
            </Card>
            <Card size="sm" className="border-white/8 bg-background/50 sm:col-span-2">
              <CardContent className="p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-foreground/40">
                  Quick hooks
                </p>
                <div className="mt-3 flex flex-wrap gap-2 text-xs text-foreground/60">
                  <Badge variant="secondary">Daily challenge</Badge>
                  <Badge variant="secondary">Boss battles</Badge>
                  <Badge variant="secondary">Lab notebook</Badge>
                  <Badge variant="secondary">{rematchWins} revenge clears</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
