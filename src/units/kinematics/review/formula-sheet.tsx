"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tex } from "@/components/ui/math";
import { toLatex } from "@/lib/latex";

const sections = [
  {
    title: "Kinematic Equations (Constant a)",
    formulas: [
      { eq: "v = v₀ + at", note: "No Δx" },
      { eq: "Δx = v₀t + ½at²", note: "No v" },
      { eq: "v² = v₀² + 2aΔx", note: "No t" },
      { eq: "Δx = ½(v₀ + v)t", note: "No a" },
    ],
  },
  {
    title: "Definitions",
    formulas: [
      { eq: "v_avg = Δx / Δt", note: "Average velocity" },
      { eq: "a_avg = Δv / Δt", note: "Average acceleration" },
      { eq: "Δx = x_f − x_i", note: "Displacement" },
      { eq: "speed = |v|", note: "Scalar, always ≥ 0" },
    ],
  },
  {
    title: "Free Fall",
    formulas: [
      { eq: "g ≈ 9.8 m/s² ≈ 10 m/s²", note: "Downward" },
      { eq: "v = v₀ − gt (upward positive)", note: "Taking up as positive" },
      { eq: "y = v₀t − ½gt²", note: "From launch point" },
    ],
  },
  {
    title: "Projectile Motion",
    formulas: [
      { eq: "vₓ = v₀ cos θ (constant)", note: "Horizontal" },
      { eq: "vᵧ = v₀ sin θ − gt", note: "Vertical" },
      { eq: "R = v₀² sin(2θ) / g", note: "Range (level ground)" },
      { eq: "H = v₀² sin²(θ) / (2g)", note: "Max height" },
      { eq: "T = 2v₀ sin(θ) / g", note: "Flight time" },
    ],
  },
  {
    title: "Graph Relationships",
    formulas: [
      { eq: "Slope of x-t = velocity", note: "" },
      { eq: "Slope of v-t = acceleration", note: "" },
      { eq: "Area under v-t = displacement", note: "" },
      { eq: "Area under a-t = Δv", note: "" },
    ],
  },
];

export function FormulaSheet() {
  return (
    <div className="space-y-4 max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Kinematics Formula Sheet</CardTitle>
          <CardDescription>All equations for AP Physics 1 Unit 1</CardDescription>
        </CardHeader>
      </Card>
      {sections.map(sec => (
        <Card key={sec.title}>
          <CardHeader><CardTitle className="text-base">{sec.title}</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-2">
              {sec.formulas.map((f, i) => (
                <div key={i} className="flex items-center justify-between rounded-md border bg-background px-3 py-2.5 gap-2">
                  <div className="text-sm font-semibold text-foreground"><Tex display={false}>{toLatex(f.eq)}</Tex></div>
                  {f.note && <Badge variant="outline" className="text-[10px] shrink-0">{f.note}</Badge>}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
