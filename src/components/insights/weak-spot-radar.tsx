"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useInsightsView } from "@/components/insights/use-insights-view";

function scoreTone(score: number) {
  if (score >= 75) return "bg-red-500";
  if (score >= 55) return "bg-amber-500";
  return "bg-emerald-500";
}

export function WeakSpotRadar({
  preview = false,
  defaultUnitSlug,
}: {
  preview?: boolean;
  defaultUnitSlug?: string;
}) {
  const { radar } = useInsightsView();
  const [selectedUnitSlug, setSelectedUnitSlug] = useState<string | undefined>(
    defaultUnitSlug
  );
  const effectiveSelectedUnitSlug =
    selectedUnitSlug ?? defaultUnitSlug ?? radar.unitNodes[0]?.unitSlug;

  const selectedTopics = useMemo(
    () =>
      radar.topicNodesByUnit[effectiveSelectedUnitSlug ?? ""] ?? [],
    [effectiveSelectedUnitSlug, radar.topicNodesByUnit]
  );

  const unitNodes = preview ? radar.unitNodes.slice(0, 3) : radar.unitNodes;
  const topicNodes = preview ? selectedTopics.slice(0, 3) : selectedTopics;

  return (
    <Card className="border-white/[0.08] bg-white/[0.03]">
      <CardHeader>
        <CardTitle>{preview ? "Weak Spot Radar" : "Weak Spot Radar"}</CardTitle>
        <CardDescription>
          Unit urgency blends exam weight, progress gaps, mistakes, exam runs, and prediction misses.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Unit Layer
            </p>
            {unitNodes.map((node) => (
              <button
                key={node.unitSlug}
                type="button"
                onClick={() => setSelectedUnitSlug(node.unitSlug)}
                className={`w-full rounded-2xl border px-4 py-3 text-left transition ${
                  effectiveSelectedUnitSlug === node.unitSlug
                    ? "border-primary bg-primary/10"
                    : "border-border hover:border-primary/40"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="font-medium">{node.label}</span>
                  <span className="font-mono text-sm">{Math.round(node.score)}</span>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className={`h-full rounded-full ${scoreTone(node.score)}`}
                    style={{ width: `${node.score}%` }}
                  />
                </div>
                <p className="mt-2 text-xs text-muted-foreground">{node.reason}</p>
              </button>
            ))}
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Topic Layer
              </p>
              {!preview && effectiveSelectedUnitSlug && (
                <Link
                  href={`/${effectiveSelectedUnitSlug}?view=quiz`}
                  className="text-xs text-primary hover:underline"
                >
                  Open unit quiz
                </Link>
              )}
            </div>
            {topicNodes.length > 0 ? (
              topicNodes.map((node) => (
                <div key={`${node.unitSlug}:${node.topicKey}`} className="rounded-2xl border border-border bg-background/40 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium">{node.label}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{node.reason}</p>
                    </div>
                    <span className="font-mono text-sm">{Math.round(node.score)}</span>
                  </div>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className={`h-full rounded-full ${scoreTone(node.score)}`}
                      style={{ width: `${node.score}%` }}
                    />
                  </div>
                  <Link href={node.targetHref} className="mt-3 inline-flex text-xs text-primary hover:underline">
                    Drill down
                  </Link>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">
                No topic-level hotspots yet. Complete more work or add more signals.
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
