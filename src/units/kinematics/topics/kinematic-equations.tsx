"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface TopicProps { onComplete: () => void; isComplete: boolean; }

const equations = [
  { id: "eq1", label: "v = v₀ + at", vars: ["v₀", "a", "t"], solve: "v", calc: (vals: Record<string, number>) => vals["v₀"] + vals["a"] * vals["t"], result: "v" },
  { id: "eq2", label: "x = x₀ + v₀t + ½at²", vars: ["x₀", "v₀", "t", "a"], solve: "x", calc: (vals: Record<string, number>) => vals["x₀"] + vals["v₀"] * vals["t"] + 0.5 * vals["a"] * vals["t"] ** 2, result: "x" },
  { id: "eq3", label: "v² = v₀² + 2a(x − x₀)", vars: ["v₀", "a", "x", "x₀"], solve: "v", calc: (vals: Record<string, number>) => { const sq = vals["v₀"] ** 2 + 2 * vals["a"] * (vals["x"] - vals["x₀"]); return sq >= 0 ? Math.sqrt(sq) : NaN; }, result: "v" },
  { id: "eq4", label: "x = x₀ + ½(v₀ + v)t", vars: ["x₀", "v₀", "v", "t"], solve: "x", calc: (vals: Record<string, number>) => vals["x₀"] + 0.5 * (vals["v₀"] + vals["v"]) * vals["t"], result: "x" },
];

export function KinematicEquations({ onComplete, isComplete }: TopicProps) {
  const [selectedEq, setSelectedEq] = useState("eq1");
  const [inputs, setInputs] = useState<Record<string, string>>({});

  const eq = equations.find(e => e.id === selectedEq)!;
  const vals: Record<string, number> = {};
  let allValid = true;
  for (const v of eq.vars) {
    const n = parseFloat(inputs[v] ?? "");
    if (isNaN(n)) { allValid = false; break; }
    vals[v] = n;
  }
  const result = allValid ? eq.calc(vals) : null;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Kinematic Equations</CardTitle>
              <CardDescription className="mt-1 text-base">The four equations for constant acceleration motion</CardDescription>
            </div>
            <Button variant={isComplete ? "default" : "outline"} size="sm" onClick={onComplete} className="cursor-pointer">
              {isComplete ? "Completed" : "Mark Complete"}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-primary">The Four Equations</h3>
          <div className="grid gap-2 sm:grid-cols-2">
            {equations.map(eq => (
              <div key={eq.id} className="rounded-lg border bg-muted/30 p-3">
                <p className="font-mono text-base font-bold">{eq.label}</p>
                <p className="text-xs text-muted-foreground mt-1">Missing variable: {eq.id === "eq1" ? "x" : eq.id === "eq2" ? "v" : eq.id === "eq3" ? "t" : "a"}</p>
              </div>
            ))}
          </div>
          <p className="text-sm text-muted-foreground">All four equations assume <strong>constant acceleration</strong>. Each equation relates 4 of the 5 kinematic variables (x, v₀, v, a, t) — use whichever omits the unknown you don&apos;t need.</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Equation Calculator</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <Tabs value={selectedEq} onValueChange={(v) => { setSelectedEq(v); setInputs({}); }}>
            <TabsList className="flex flex-wrap h-auto gap-1">
              {equations.map(eq => (
                <TabsTrigger key={eq.id} value={eq.id} className="text-xs">{eq.label.split("=")[0].trim()}</TabsTrigger>
              ))}
            </TabsList>
            {equations.map(equation => (
              <TabsContent key={equation.id} value={equation.id}>
                <p className="font-mono text-lg font-bold mb-4">{equation.label}</p>
                <div className="grid gap-3 sm:grid-cols-2">
                  {equation.vars.map(v => (
                    <div key={v} className="space-y-1">
                      <label className="text-xs text-muted-foreground uppercase">{v}</label>
                      <input
                        type="number"
                        value={inputs[v] ?? ""}
                        onChange={e => setInputs(prev => ({ ...prev, [v]: e.target.value }))}
                        className="w-full rounded-md border bg-background px-3 py-2 text-sm font-mono shadow-sm focus:outline-none focus:ring-2 focus:ring-ring"
                        placeholder={`Enter ${v}…`}
                      />
                    </div>
                  ))}
                </div>
                <Separator className="my-4" />
                <div className="rounded-lg bg-muted/50 border px-5 py-4">
                  {result !== null && !isNaN(result) ? (
                    <>
                      <p className="text-xs text-muted-foreground">Result</p>
                      <p className="font-mono text-2xl font-bold">{equation.result} = {result.toFixed(4)}</p>
                    </>
                  ) : (
                    <p className="text-sm text-muted-foreground italic">Enter all values above to calculate.</p>
                  )}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>How to Choose the Right Equation</CardTitle></CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p>1. <strong>Identify knowns and unknowns</strong> — list which of the 5 variables (x, x₀, v, v₀, a, t) you know.</p>
          <p>2. <strong>Pick the equation that doesn&apos;t contain your unknown you don&apos;t need.</strong></p>
          <p>3. Plug in and solve algebraically before substituting numbers.</p>
        </CardContent>
      </Card>

      <Accordion>
        <AccordionItem value="faq-1">
          <AccordionTrigger>When can I use these equations?</AccordionTrigger>
          <AccordionContent className="text-sm text-muted-foreground">Only when acceleration is constant. For variable acceleration, you need calculus or graphical methods.</AccordionContent>
        </AccordionItem>
        <AccordionItem value="faq-2">
          <AccordionTrigger>Do these work in 2D?</AccordionTrigger>
          <AccordionContent className="text-sm text-muted-foreground">Yes, but you must apply them separately to each direction (x and y). In projectile motion, aₓ = 0 and aᵧ = -g.</AccordionContent>
        </AccordionItem>
        <AccordionItem value="faq-3">
          <AccordionTrigger>What about the &quot;fifth equation&quot; x = ½(v₀+v)t?</AccordionTrigger>
          <AccordionContent className="text-sm text-muted-foreground">This is derived from the average velocity under constant acceleration. It&apos;s useful when you don&apos;t know acceleration directly.</AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
