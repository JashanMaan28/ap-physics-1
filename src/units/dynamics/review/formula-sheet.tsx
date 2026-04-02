"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const sections = [
  {
    title: "Newton's Laws",
    formulas: [
      { formula: "ΣF = ma", description: "Net force equals mass times acceleration (Newton's 2nd Law)" },
      { formula: "ΣF = 0 ⟹ a = 0", description: "Equilibrium condition (Newton's 1st Law)" },
      { formula: "F_AB = −F_BA", description: "Action-reaction pairs (Newton's 3rd Law)" },
    ],
  },
  {
    title: "Weight & Gravity",
    formulas: [
      { formula: "W = mg", description: "Weight (gravitational force), g ≈ 9.8 m/s²" },
      { formula: "g = G·M/R²", description: "Gravitational field strength at distance R from mass M" },
    ],
  },
  {
    title: "Friction",
    formulas: [
      { formula: "f_s ≤ μ_s · N", description: "Static friction (up to maximum)" },
      { formula: "f_k = μ_k · N", description: "Kinetic friction (constant magnitude)" },
      { formula: "μ_s > μ_k", description: "Static coefficient is always greater than kinetic" },
    ],
  },
  {
    title: "Inclined Planes",
    formulas: [
      { formula: "F_∥ = mg sin θ", description: "Gravity component parallel to incline (down the ramp)" },
      { formula: "F_⊥ = mg cos θ", description: "Gravity component perpendicular to incline" },
      { formula: "N = mg cos θ", description: "Normal force on an incline (no extra perpendicular forces)" },
      { formula: "a = g(sin θ − μ_k cos θ)", description: "Acceleration down incline with kinetic friction" },
      { formula: "θ_c = arctan(μ_s)", description: "Critical angle for sliding to begin" },
    ],
  },
  {
    title: "Atwood Machines",
    formulas: [
      { formula: "a = (m₁ − m₂)g / (m₁ + m₂)", description: "System acceleration (m₁ > m₂)" },
      { formula: "T = 2m₁m₂g / (m₁ + m₂)", description: "Tension in the rope" },
    ],
  },
  {
    title: "Tension & Normal Force",
    formulas: [
      { formula: "T = mg", description: "Tension for a mass hanging at rest" },
      { formula: "T = m(g + a)", description: "Tension when accelerating upward" },
      { formula: "T = m(g − a)", description: "Tension when accelerating downward" },
      { formula: "N = m(g + a)", description: "Apparent weight accelerating upward (elevator going up)" },
      { formula: "N = m(g − a)", description: "Apparent weight accelerating downward" },
    ],
  },
  {
    title: "Modified Atwood Machine",
    formulas: [
      { formula: "a = m_hang · g / (m_table + m_hang)", description: "Frictionless table, one mass hanging" },
      { formula: "T = m_table · m_hang · g / (m_table + m_hang)", description: "Tension in the string" },
    ],
  },
];

export function FormulaSheet() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Dynamics Formula Sheet</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            All key formulas for Unit 2: Force and Translational Dynamics. Use these for quick
            reference during practice.
          </p>
        </CardContent>
      </Card>

      {sections.map((section, sIdx) => (
        <Card key={sIdx}>
          <CardHeader>
            <CardTitle className="text-lg">{section.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {section.formulas.map((f, fIdx) => (
              <div key={fIdx}>
                <div className="flex items-start gap-3">
                  <Badge variant="outline" className="font-mono text-sm shrink-0 mt-0.5">
                    {f.formula}
                  </Badge>
                  <p className="text-sm text-muted-foreground">{f.description}</p>
                </div>
                {fIdx < section.formulas.length - 1 && <Separator className="mt-3" />}
              </div>
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
