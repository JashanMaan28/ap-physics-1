"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { units } from "@/units/registry";
import { useArcade } from "@/contexts/arcade-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const confidenceOptions = [
  { value: "low", label: "Low confidence" },
  { value: "medium", label: "Medium confidence" },
  { value: "high", label: "High confidence" },
] as const;

export function SimulationPredictionCard({
  title,
}: {
  title: string;
}) {
  const pathname = usePathname();
  const { savePrediction } = useArcade();
  const [prediction, setPrediction] = useState("");
  const [confidence, setConfidence] = useState<
    "low" | "medium" | "high"
  >("medium");
  const [saved, setSaved] = useState(false);

  const maybeUnitSlug = pathname.split("/")[1];
  const unitSlug = units.some((unit) => unit.slug === maybeUnitSlug)
    ? maybeUnitSlug
    : undefined;

  function handleSave() {
    const trimmed = prediction.trim();
    if (!trimmed) {
      return;
    }

    savePrediction({
      title: `${title} hypothesis`,
      body: trimmed,
      unitSlug,
      confidence,
    });
    setSaved(true);
  }

  return (
    <Card className="border-white/[0.08] bg-white/[0.03]">
      <CardContent className="space-y-3 p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Prediction Before Simulation
            </p>
            <p className="mt-1 text-sm text-foreground/75">
              Write a quick hypothesis before you hit play. It gets saved to the
              lab notebook in the arcade.
            </p>
          </div>
          <Link href="/arcade#lab-notebook" className="text-xs text-primary hover:underline">
            Open notebook
          </Link>
        </div>

        <textarea
          value={prediction}
          onChange={(event) => {
            setPrediction(event.target.value);
            setSaved(false);
          }}
          placeholder="Example: If I increase the angle, the range should first grow and then shrink after 45°."
          className="min-h-24 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground outline-none ring-0 transition focus:border-primary/50"
        />

        <div className="flex flex-wrap gap-2">
          {confidenceOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                setConfidence(option.value);
                setSaved(false);
              }}
              className={`rounded-full border px-3 py-1 text-xs transition ${
                confidence === option.value
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button onClick={handleSave} disabled={!prediction.trim()}>
            Lock prediction
          </Button>
          {saved && (
            <span className="text-xs text-emerald-500">
              Saved to the notebook and counted toward prediction unlocks.
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
