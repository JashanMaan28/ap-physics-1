"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useArcade } from "@/contexts/arcade-context";
import { useInsights } from "@/contexts/insights-context";
import { scorePredictionRecord } from "@/lib/insights";
import type { PredictionConfidence, PredictionManifest } from "@/types/insights";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const confidenceOptions: Array<{
  value: PredictionConfidence;
  label: string;
}> = [
  { value: "low", label: "Low confidence" },
  { value: "medium", label: "Medium confidence" },
  { value: "high", label: "High confidence" },
];

interface PredictionPanelProps {
  manifest: PredictionManifest;
  autoActualNumber?: number;
  autoActualChoice?: string;
  resolutionToken?: string | number | null;
}

function formatPredictionSummary(manifest: PredictionManifest, value: {
  predictedNumber?: number;
  predictedChoice?: string;
  actualNumber?: number;
  actualChoice?: string;
  outcome: string;
}) {
  if (manifest.scoringMode === "numeric") {
    return `Predicted ${value.predictedNumber ?? "?"}, observed ${value.actualNumber ?? "?"}. ${value.outcome}.`;
  }

  return `Predicted ${value.predictedChoice ?? "?"}, observed ${value.actualChoice ?? "?"}. ${value.outcome}.`;
}

export function PredictionPanel({
  manifest,
  autoActualNumber,
  autoActualChoice,
  resolutionToken,
}: PredictionPanelProps) {
  const { predictions, createPrediction, resolvePrediction } = useInsights();
  const { savePrediction } = useArcade();
  const [predictedNumber, setPredictedNumber] = useState("");
  const [predictedChoice, setPredictedChoice] = useState(
    manifest.choiceOptions?.[0] ?? ""
  );
  const [actualNumber, setActualNumber] = useState("");
  const [actualChoice, setActualChoice] = useState(
    manifest.choiceOptions?.[0] ?? ""
  );
  const [rationale, setRationale] = useState("");
  const [confidence, setConfidence] = useState<PredictionConfidence>("medium");
  const [saving, setSaving] = useState(false);
  const lastResolvedToken = useRef<string | number | null>(null);

  const simPredictions = useMemo(
    () =>
      predictions
        .filter((prediction) => prediction.simId === manifest.simId)
        .sort((a, b) => b.createdAt - a.createdAt),
    [manifest.simId, predictions]
  );
  const activePrediction = simPredictions.find(
    (prediction) => prediction.resolvedAt === null
  );
  const recentResolved = simPredictions.find(
    (prediction) => prediction.resolvedAt !== null
  );

  useEffect(() => {
    if (
      !activePrediction ||
      resolutionToken === null ||
      resolutionToken === undefined ||
      lastResolvedToken.current === resolutionToken
    ) {
      return;
    }

    const hasNumericReality =
      manifest.scoringMode === "numeric" && autoActualNumber !== undefined;
    const hasChoiceReality =
      manifest.scoringMode === "choice" && autoActualChoice !== undefined;

    if (!hasNumericReality && !hasChoiceReality) {
      return;
    }

    lastResolvedToken.current = resolutionToken;
    const scored = scorePredictionRecord(manifest, {
      predictedNumber: activePrediction.predictedNumber,
      predictedChoice: activePrediction.predictedChoice,
      actualNumber: autoActualNumber,
      actualChoice: autoActualChoice,
    });

    void (async () => {
      const resolved = await resolvePrediction({
        predictionId: activePrediction.id,
        actualNumber: autoActualNumber,
        actualChoice: autoActualChoice,
        outcome: scored.outcome,
        score: scored.score,
        resolvedAt: Date.now(),
      });

      if (resolved) {
        savePrediction({
          title: `${manifest.promptLabel} resolved`,
          body: formatPredictionSummary(manifest, resolved),
          unitSlug: manifest.unitSlug,
          confidence: resolved.confidence,
        });
      }
    })();
  }, [
    activePrediction,
    autoActualChoice,
    autoActualNumber,
    manifest,
    resolutionToken,
    resolvePrediction,
    savePrediction,
  ]);

  async function handleLockPrediction() {
    const parsedNumber =
      manifest.promptKind === "number" ? Number(predictedNumber) : undefined;
    if (manifest.promptKind === "number" && Number.isNaN(parsedNumber)) {
      return;
    }

    setSaving(true);
    await createPrediction({
      simId: manifest.simId,
      unitSlug: manifest.unitSlug,
      topicKey: manifest.topicKey,
      promptKind: manifest.promptKind,
      predictedNumber:
        manifest.promptKind === "number" ? parsedNumber : undefined,
      predictedChoice:
        manifest.promptKind === "choice" ? predictedChoice : undefined,
      rationale: rationale.trim(),
      confidence,
      createdAt: Date.now(),
    });
    setSaving(false);
    setPredictedNumber("");
    setRationale("");
  }

  async function handleRecordReality() {
    if (!activePrediction) {
      return;
    }

    const parsedActual =
      manifest.scoringMode === "numeric" ? Number(actualNumber) : undefined;
    if (manifest.scoringMode === "numeric" && Number.isNaN(parsedActual)) {
      return;
    }

    const scored = scorePredictionRecord(manifest, {
      predictedNumber: activePrediction.predictedNumber,
      predictedChoice: activePrediction.predictedChoice,
      actualNumber:
        manifest.scoringMode === "numeric" ? parsedActual : undefined,
      actualChoice:
        manifest.scoringMode === "choice" ? actualChoice : undefined,
    });

    const resolved = await resolvePrediction({
      predictionId: activePrediction.id,
      actualNumber:
        manifest.scoringMode === "numeric" ? parsedActual : undefined,
      actualChoice: manifest.scoringMode === "choice" ? actualChoice : undefined,
      outcome: scored.outcome,
      score: scored.score,
      resolvedAt: Date.now(),
    });
    if (resolved) {
      savePrediction({
        title: `${manifest.promptLabel} resolved`,
        body: formatPredictionSummary(manifest, resolved),
        unitSlug: manifest.unitSlug,
        confidence: resolved.confidence,
      });
    }
    setActualNumber("");
  }

  return (
    <Card className="border-white/[0.08] bg-white/[0.03]">
      <CardContent className="space-y-4 p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Prediction vs Reality
            </p>
            <p className="mt-1 text-sm text-foreground/75">
              {manifest.promptLabel}. Lock the prediction before running, then compare it with what the sim actually does.
            </p>
          </div>
          <Link href="/arcade#lab-notebook" className="text-xs text-primary hover:underline">
            Open notebook
          </Link>
        </div>

        {!activePrediction ? (
          <div className="space-y-3">
            {manifest.promptKind === "number" ? (
              <input
                value={predictedNumber}
                onChange={(event) => setPredictedNumber(event.target.value)}
                placeholder={manifest.predictionPlaceholder ?? "Enter a prediction"}
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
              />
            ) : (
              <select
                value={predictedChoice}
                onChange={(event) => setPredictedChoice(event.target.value)}
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
              >
                {(manifest.choiceOptions ?? []).map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            )}

            <textarea
              value={rationale}
              onChange={(event) => setRationale(event.target.value)}
              placeholder="Why do you think that will happen?"
              className="min-h-24 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
            />

            <div className="flex flex-wrap gap-2">
              {confidenceOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setConfidence(option.value)}
                  className={`rounded-full border px-3 py-1 text-xs transition ${
                    confidence === option.value
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border text-muted-foreground hover:border-primary/40"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>

            <Button
              onClick={() => void handleLockPrediction()}
              disabled={
                saving ||
                (manifest.promptKind === "number"
                  ? predictedNumber.trim().length === 0
                  : predictedChoice.trim().length === 0)
              }
            >
              {saving ? "Saving..." : "Lock prediction"}
            </Button>
          </div>
        ) : (
          <div className="space-y-3 rounded-2xl border border-primary/20 bg-primary/5 p-4">
            <p className="text-sm text-foreground/80">
              Locked prediction:
              <span className="ml-2 font-medium">
                {manifest.promptKind === "number"
                  ? activePrediction.predictedNumber
                  : activePrediction.predictedChoice}
              </span>
            </p>
            <p className="text-xs text-muted-foreground">
              {manifest.manualActualEntry
                ? "Run the PhET sim, then record the real result below."
                : "Run the native sim. This panel will resolve automatically when the measurement is available."}
            </p>

            {manifest.manualActualEntry && (
              <div className="space-y-3">
                {manifest.scoringMode === "numeric" ? (
                  <input
                    value={actualNumber}
                    onChange={(event) => setActualNumber(event.target.value)}
                    placeholder={manifest.actualLabel ?? "Record what happened"}
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
                  />
                ) : (
                  <select
                    value={actualChoice}
                    onChange={(event) => setActualChoice(event.target.value)}
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
                  >
                    {(manifest.choiceOptions ?? []).map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                )}
                <Button
                  onClick={() => void handleRecordReality()}
                  disabled={
                    manifest.scoringMode === "numeric"
                      ? actualNumber.trim().length === 0
                      : actualChoice.trim().length === 0
                  }
                >
                  Record reality
                </Button>
              </div>
            )}
          </div>
        )}

        {recentResolved && (
          <div className="rounded-2xl border bg-background/60 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Recent Result
            </p>
            <p className="mt-2 text-sm text-foreground/80">
              {formatPredictionSummary(manifest, recentResolved)}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
