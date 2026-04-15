"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { RadarPreviewCard } from "@/components/insights/radar-preview-card";
import { WeakSpotRadar } from "@/components/insights/weak-spot-radar";
import { useInsightsView } from "@/components/insights/use-insights-view";
import { recommendNextExamBlock } from "@/lib/insights";
import { HomeIcon, type HomeIconHandle } from "@/components/icons/home-icon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ExamRunner } from "@/components/exam/exam-runner";
import type { ExamModeKind } from "@/types/insights";

export function ExamModeDashboard() {
  const homeIconRef = useRef<HomeIconHandle>(null);
  const { readiness, examRuns } = useInsightsView();
  const [activeMode, setActiveMode] = useState<ExamModeKind | null>(null);
  const recommendation = recommendNextExamBlock(readiness);

  if (activeMode) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <ExamRunner modeKind={activeMode} onExit={() => setActiveMode(null)} />
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
          <div>
            <Badge variant="outline" className="border-primary/25 bg-primary/10 text-primary">
              Exam Mode
            </Badge>
            <h1 className="mt-4 text-4xl font-black tracking-tight">Focused AP-style study blocks</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-foreground/65">
              Use the radar, launch timed blocks, and track whether recent exam work is moving readiness in the right direction.
            </p>
          </div>
          <Link
            href="/"
            onMouseEnter={() => homeIconRef.current?.startAnimation()}
            onMouseLeave={() => homeIconRef.current?.stopAnimation()}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-card/80 px-3 py-2 text-sm text-foreground/75 transition hover:border-primary/30 hover:text-foreground"
            aria-label="Go home"
          >
            <HomeIcon ref={homeIconRef} size={20} className="text-primary" />
            <span>Home</span>
          </Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <Card className="border-white/[0.08] bg-white/[0.03]">
            <CardHeader>
              <CardTitle>Readiness Summary</CardTitle>
              <CardDescription>Derived live from progress, mistakes, predictions, and exam runs.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-border bg-background/40 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Overall readiness</p>
                <p className="mt-2 text-3xl font-black">{Math.round(readiness.overallReadiness)}</p>
              </div>
              <div className="rounded-2xl border border-border bg-background/40 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Recent prediction accuracy</p>
                <p className="mt-2 text-3xl font-black">
                  {readiness.recentPredictionAccuracy === null
                    ? "—"
                    : Math.round(readiness.recentPredictionAccuracy)}
                </p>
              </div>
              <div className="rounded-2xl border border-border bg-background/40 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Recent exam trend</p>
                <p className="mt-2 text-3xl font-black">
                  {readiness.recentExamTrend === null ? "—" : Math.round(readiness.recentExamTrend)}
                </p>
              </div>
              <div className="rounded-2xl border border-border bg-background/40 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Recommended next block</p>
                <p className="mt-2 text-lg font-semibold">{recommendation.title}</p>
                <p className="mt-1 text-xs text-muted-foreground">{recommendation.reason}</p>
              </div>
            </CardContent>
          </Card>

          <RadarPreviewCard title="Quick Radar" description="Highest urgency units right now." />
        </div>

        <div className="mt-6">
          <WeakSpotRadar />
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          {[
            {
              kind: "mixed-mc-sprint" as const,
              title: "Mixed MC Sprint",
              detail: "10 questions · 12 minutes · weighted by urgency and exam weight",
            },
            {
              kind: "weak-unit-focus" as const,
              title: "Weak-Unit Focus",
              detail: "8 questions · 10 minutes · concentrated on the top 2 units",
            },
            {
              kind: "frq-focus-block" as const,
              title: "FRQ Focus Block",
              detail: "1 FRQ · 15 minutes · rubric and self-score at the end",
            },
          ].map((card) => (
            <Card key={card.kind} className="border-white/[0.08] bg-white/[0.03]">
              <CardHeader>
                <CardTitle>{card.title}</CardTitle>
                <CardDescription>{card.detail}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={() => setActiveMode(card.kind)}>Start block</Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <Card className="border-white/[0.08] bg-white/[0.03]">
            <CardHeader>
              <CardTitle>Recent Runs</CardTitle>
              <CardDescription>Latest saved exam mode blocks.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {examRuns.length === 0 ? (
                <p className="text-sm text-muted-foreground">No exam blocks recorded yet.</p>
              ) : (
                examRuns.slice(0, 5).map((run) => (
                  <div key={run.id} className="rounded-2xl border border-border bg-background/40 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-medium">{run.modeKind}</span>
                      <span className="font-mono text-sm">{Math.round(run.accuracy)}%</span>
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">
                      {run.correctCount}/{run.questionCount} · {Math.round(run.durationSec / 60)} min
                    </p>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card className="border-white/[0.08] bg-white/[0.03]">
            <CardHeader>
              <CardTitle>Recommended Next Block</CardTitle>
              <CardDescription>{recommendation.reason}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-lg font-semibold">{recommendation.title}</p>
              <Button onClick={() => setActiveMode(recommendation.kind)}>
                Launch recommended block
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
