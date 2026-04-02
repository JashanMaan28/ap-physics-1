"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Formula {
  name: string;
  equation: string;
  variables: string;
  notes: string;
  apWeight: "high" | "medium" | "low";
}

const formulas: Formula[] = [
  {
    name: "Momentum",
    equation: "p = mv",
    variables: "p = momentum (kg·m/s), m = mass (kg), v = velocity (m/s)",
    notes: "Vector quantity. Direction same as velocity.",
    apWeight: "high",
  },
  {
    name: "Impulse",
    equation: "J = FΔt",
    variables: "J = impulse (N·s), F = average force (N), Δt = time interval (s)",
    notes: "Area under F vs. t graph. Same units as momentum.",
    apWeight: "high",
  },
  {
    name: "Impulse-Momentum Theorem",
    equation: "J = Δp = mvf − mvi",
    variables: "Connects impulse to change in momentum",
    notes: "Derived from Newton's 2nd Law. Key equation for AP exam.",
    apWeight: "high",
  },
  {
    name: "Conservation of Momentum",
    equation: "m₁v₁ᵢ + m₂v₂ᵢ = m₁v₁f + m₂v₂f",
    variables: "Subscript i = initial, f = final",
    notes: "Valid when net external force = 0 (isolated system).",
    apWeight: "high",
  },
  {
    name: "Perfectly Inelastic Collision",
    equation: "m₁v₁ᵢ + m₂v₂ᵢ = (m₁ + m₂)vf",
    variables: "Objects stick together → single vf",
    notes: "Maximum KE loss. Momentum still conserved.",
    apWeight: "high",
  },
  {
    name: "Elastic Collision (1D, target at rest)",
    equation: "v₁f = v₁ᵢ(m₁−m₂)/(m₁+m₂)  |  v₂f = 2m₁v₁ᵢ/(m₁+m₂)",
    variables: "Special case: v₂ᵢ = 0",
    notes: "Both momentum and KE conserved. Equal masses → velocity exchange.",
    apWeight: "medium",
  },
  {
    name: "Kinetic Energy",
    equation: "KE = ½mv²",
    variables: "KE = kinetic energy (J), m = mass (kg), v = speed (m/s)",
    notes: "Scalar. Conserved only in elastic collisions.",
    apWeight: "medium",
  },
  {
    name: "Newton's 2nd Law (momentum form)",
    equation: "F_net = dp/dt",
    variables: "Rate of change of momentum equals net force",
    notes: "More general than F = ma. Works for variable mass systems.",
    apWeight: "medium",
  },
];

const weightColor = {
  high: "text-red-500 border-red-400",
  medium: "text-amber-500 border-amber-400",
  low: "text-green-500 border-green-400",
};

export function FormulaSheet() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Formula Sheet: Linear Momentum</CardTitle>
          <CardDescription>All key equations for Unit 4. Sorted by AP exam importance.</CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="all">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">All Formulas</TabsTrigger>
          <TabsTrigger value="high">Must Know</TabsTrigger>
          <TabsTrigger value="reference">Quick Reference</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {formulas.map((f, i) => (
            <Card key={i}>
              <CardContent className="pt-4 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">{f.name}</h3>
                  <Badge variant="outline" className={weightColor[f.apWeight]}>
                    {f.apWeight === "high" ? "Must Know" : f.apWeight === "medium" ? "Important" : "Good to Know"}
                  </Badge>
                </div>
                <div className="text-2xl font-mono font-bold text-center py-3 bg-muted rounded">
                  {f.equation}
                </div>
                <p className="text-sm"><strong>Variables:</strong> {f.variables}</p>
                <p className="text-sm text-muted-foreground">{f.notes}</p>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="high" className="space-y-4">
          {formulas
            .filter((f) => f.apWeight === "high")
            .map((f, i) => (
              <Card key={i} className="border-purple-500/30">
                <CardContent className="pt-4 space-y-2">
                  <h3 className="font-semibold">{f.name}</h3>
                  <div className="text-2xl font-mono font-bold text-center py-3 bg-purple-500/10 rounded">
                    {f.equation}
                  </div>
                  <p className="text-sm">{f.variables}</p>
                  <p className="text-sm text-muted-foreground">{f.notes}</p>
                </CardContent>
              </Card>
            ))}
        </TabsContent>

        <TabsContent value="reference">
          <Card>
            <CardContent className="pt-6">
              <div className="grid gap-3">
                {formulas.map((f, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded bg-muted">
                    <span className="font-medium text-sm">{f.name}</span>
                    <span className="font-mono font-bold">{f.equation}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-lg">Key Relationships to Remember</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>1 N·s = 1 kg·m/s (impulse and momentum have the same units)</p>
              <Separator />
              <p>Momentum is conserved in ALL collisions (if system is isolated).</p>
              <Separator />
              <p>KE is conserved ONLY in elastic collisions.</p>
              <Separator />
              <p>Doubling v → doubles p, but quadruples KE.</p>
              <Separator />
              <p>Perfectly inelastic = maximum KE loss for given initial conditions.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default FormulaSheet;
