"use client";

import { useMemo } from "react";
import { units } from "@/data/units";
import { useInsights } from "@/contexts/insights-context";
import { useMistakes } from "@/contexts/mistake-context";
import { useProgress } from "@/contexts/progress-context";
import { deriveReadinessSnapshot, deriveWeakSpotNodes, type RadarInputs } from "@/lib/insights";
import { unitConfigs } from "@/units/registry";

export function useInsightsView() {
  const { predictions, examRuns } = useInsights();
  const { mistakes } = useMistakes();
  const { getCompleted, getProgress } = useProgress();

  const inputs = useMemo<RadarInputs>(() => {
    const progressByUnit: Record<string, number> = {};
    const completedTopicsByUnit: Record<string, string[]> = {};

    for (const unit of units) {
      const topicCount = unitConfigs[unit.slug]?.learnTopicIds.length ?? 0;
      progressByUnit[unit.slug] = getProgress(unit.slug, topicCount);
      completedTopicsByUnit[unit.slug] = [...getCompleted(unit.slug)];
    }

    return {
      progressByUnit,
      completedTopicsByUnit,
      mistakes,
      predictions,
      examRuns,
    };
  }, [examRuns, getCompleted, getProgress, mistakes, predictions]);

  const radar = useMemo(() => deriveWeakSpotNodes(inputs), [inputs]);
  const readiness = useMemo(() => deriveReadinessSnapshot(inputs), [inputs]);

  return {
    inputs,
    radar,
    readiness,
    predictions,
    examRuns,
  };
}
