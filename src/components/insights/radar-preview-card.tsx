"use client";

import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useInsightsView } from "@/components/insights/use-insights-view";

export function RadarPreviewCard({
  href = "/exam",
  title = "Weak Spot Radar",
  description = "Top urgency signals across the course.",
}: {
  href?: string;
  title?: string;
  description?: string;
}) {
  const { readiness } = useInsightsView();

  return (
    <Card className="border-white/[0.08] bg-white/[0.03]">
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          <span className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-mono text-primary">
            {Math.round(readiness.overallReadiness)} ready
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {readiness.topWeakUnits.slice(0, 3).map((unit) => (
          <div key={unit.unitSlug} className="rounded-2xl border border-border bg-background/40 p-4">
            <div className="flex items-center justify-between gap-3">
              <span className="font-medium">{unit.label}</span>
              <span className="font-mono text-sm">{Math.round(unit.score)}</span>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">{unit.reason}</p>
          </div>
        ))}
        <Link href={href} className="inline-flex text-sm font-medium text-primary hover:underline">
          Open full radar
        </Link>
      </CardContent>
    </Card>
  );
}
