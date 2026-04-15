"use client";

import { useState } from "react";
import { useMistakes } from "@/contexts/mistake-context";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";

import type { MistakeEntry } from "@/types/unit";

const TOPIC_COLORS: Record<string, string> = {
  Buoyancy: "bg-blue-500",
  Pressure: "bg-purple-500",
  "Fluid Flow": "bg-green-500",
  Continuity: "bg-teal-500",
  Bernoulli: "bg-orange-500",
  Density: "bg-pink-500",
  "Pascal's Law": "bg-yellow-500",
  Archimedes: "bg-cyan-500",
};

const TOPIC_BADGE_COLORS: Record<string, string> = {
  Buoyancy: "bg-blue-100 text-blue-800 border-blue-200",
  Pressure: "bg-purple-100 text-purple-800 border-purple-200",
  "Fluid Flow": "bg-green-100 text-green-800 border-green-200",
  Continuity: "bg-teal-100 text-teal-800 border-teal-200",
  Bernoulli: "bg-orange-100 text-orange-800 border-orange-200",
  Density: "bg-pink-100 text-pink-800 border-pink-200",
  "Pascal's Law": "bg-yellow-100 text-yellow-800 border-yellow-200",
  Archimedes: "bg-cyan-100 text-cyan-800 border-cyan-200",
};

const DEFAULT_BAR_COLOR = "bg-slate-500";
const DEFAULT_BADGE_COLOR = "bg-slate-100 text-slate-800 border-slate-200";

const STUDY_SUGGESTIONS: Record<string, string> = {
  Buoyancy:
    "Review the float condition: ρ_obj < ρ_fluid. An object floats when its average density is less than the fluid's density.",
  Pressure:
    "Remember P = F/A and P = ρgh for hydrostatic pressure. Pressure increases with depth.",
  "Fluid Flow":
    "Review laminar vs. turbulent flow. The Reynolds number Re = ρvL/μ determines the regime.",
  Continuity:
    "Apply A₁v₁ = A₂v₂ (continuity equation). Flow rate Q = Av is conserved in an ideal fluid.",
  Bernoulli:
    "Use P + ½ρv² + ρgh = constant. Higher velocity means lower pressure (Venturi effect).",
  Density:
    "Density ρ = m/V. For mixtures and composites, use weighted averages carefully.",
  "Pascal's Law":
    "Pressure applied to an enclosed fluid transmits equally in all directions: F₁/A₁ = F₂/A₂.",
  Archimedes:
    "Buoyant force F_b = ρ_fluid × V_submerged × g. Equals the weight of fluid displaced.",
};

function getTopicCounts(mistakes: MistakeEntry[]): Record<string, number> {
  return mistakes.reduce<Record<string, number>>((acc, m) => {
    acc[m.topic] = (acc[m.topic] ?? 0) + 1;
    return acc;
  }, {});
}

function formatTime(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function MistakeTracker() {
  const { mistakes, clearMistakes } = useMistakes();
  const [confirmClear, setConfirmClear] = useState(false);

  const topicCounts = getTopicCounts(mistakes);
  const sortedTopics = Object.entries(topicCounts).sort((a, b) => b[1] - a[1]);
  const maxCount = sortedTopics[0]?.[1] ?? 1;
  const weakAreas = sortedTopics.filter(([, count]) => count >= 2);
  const reversed = [...mistakes].reverse();

  function handleClear() {
    if (confirmClear) {
      clearMistakes();
      setConfirmClear(false);
    } else {
      setConfirmClear(true);
    }
  }

  if (mistakes.length === 0) {
    return (
      <Card className="max-w-2xl mx-auto mt-8">
        <CardContent className="flex flex-col items-center justify-center py-16 gap-4">
          <div className="text-5xl">🎉</div>
          <h2 className="text-2xl font-semibold text-slate-800">
            No mistakes yet!
          </h2>
          <p className="text-slate-500 text-center max-w-sm">
            You&apos;re on a clean slate. Keep practicing. Any mistakes you make
            while studying will appear here so you can review them.
          </p>
          <p className="text-sm text-slate-400 italic">
            &quot;Every expert was once a beginner.&quot;
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 py-6 px-4">
      {/* Summary Dashboard */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">Mistake Tracker</CardTitle>
              <CardDescription>
                Review your mistakes across all topics
              </CardDescription>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-red-500">
                {mistakes.length}
              </p>
              <p className="text-xs text-slate-500">total mistakes</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm font-medium text-slate-600">
            Mistakes by Topic
          </p>
          <div className="space-y-2">
            {sortedTopics.map(([topic, count]) => (
              <div key={topic} className="flex items-center gap-3">
                <span className="w-28 text-xs text-slate-600 truncate shrink-0">
                  {topic}
                </span>
                <div className="flex-1 bg-slate-100 rounded-full h-4 overflow-hidden">
                  <div
                    className={`h-4 rounded-full transition-all ${
                      TOPIC_COLORS[topic] ?? DEFAULT_BAR_COLOR
                    }`}
                    style={{ width: `${(count / maxCount) * 100}%` }}
                  />
                </div>
                <span className="text-xs font-semibold text-slate-700 w-5 text-right">
                  {count}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Weak Areas */}
      {weakAreas.length > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-orange-800">
              ⚠ Weak Areas
            </CardTitle>
            <CardDescription className="text-orange-600">
              Topics where you&apos;ve made 2 or more mistakes
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {weakAreas.map(([topic, count]) => (
              <div
                key={topic}
                className="rounded-lg border border-orange-200 bg-white p-3 space-y-1"
              >
                <div className="flex items-center justify-between">
                  <Badge
                    variant="outline"
                    className={`text-xs ${
                      TOPIC_BADGE_COLORS[topic] ?? DEFAULT_BADGE_COLOR
                    }`}
                  >
                    {topic}
                  </Badge>
                  <span className="text-xs text-orange-700 font-medium">
                    {count} mistake{count !== 1 ? "s" : ""}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {STUDY_SUGGESTIONS[topic] ??
                    `You have missed ${count} ${topic} questions. Review this topic carefully.`}
                </p>
                <div className="pt-1">
                  <Progress
                    value={Math.min((count / 5) * 100, 100)}
                    className="h-1.5"
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <Separator />

      {/* Mistake List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-slate-700">
            All Mistakes
            <span className="ml-2 text-slate-400 font-normal text-sm">
              (newest first)
            </span>
          </h2>
          <div className="flex items-center gap-2">
            {confirmClear && (
              <span className="text-xs text-red-500">Are you sure?</span>
            )}
            <Button
              variant={confirmClear ? "destructive" : "outline"}
              size="sm"
              onClick={handleClear}
              onBlur={() => setConfirmClear(false)}
            >
              {confirmClear ? "Yes, Clear All" : "Clear All"}
            </Button>
            {confirmClear && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setConfirmClear(false)}
              >
                Cancel
              </Button>
            )}
          </div>
        </div>

        {reversed.map((mistake, idx) => (
          <Card
            key={mistake.timestamp + "-" + idx}
            className="border-slate-200 hover:shadow-md transition-shadow"
          >
            <CardContent className="pt-4 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <Badge
                  variant="outline"
                  className={`text-xs shrink-0 ${
                    TOPIC_BADGE_COLORS[mistake.topic] ?? DEFAULT_BADGE_COLOR
                  }`}
                >
                  {mistake.topic}
                </Badge>
                <span className="text-xs text-slate-400 whitespace-nowrap">
                  {formatTime(mistake.timestamp)}
                </span>
              </div>

              <p className="text-sm text-slate-800 font-medium leading-snug">
                {mistake.question}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div className="rounded-md bg-red-50 border border-red-200 px-3 py-2">
                  <p className="text-xs font-semibold text-red-500 mb-0.5 uppercase tracking-wide">
                    Your Answer
                  </p>
                  <p className="text-sm text-red-700">{mistake.yourAnswer}</p>
                </div>
                <div className="rounded-md bg-green-50 border border-green-200 px-3 py-2">
                  <p className="text-xs font-semibold text-green-600 mb-0.5 uppercase tracking-wide">
                    Correct Answer
                  </p>
                  <p className="text-sm text-green-700">
                    {mistake.correctAnswer}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
