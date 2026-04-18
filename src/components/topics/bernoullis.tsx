"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tex } from "@/components/ui/math";
import { PhysicsText } from "@/components/ui/physics-text";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface TopicProps {
  onComplete: () => void;
  isComplete: boolean;
}

export function BernoullisEquation({ onComplete, isComplete }: TopicProps) {
  const [p1, setP1] = useState(200); // kPa
  const [v1, setV1] = useState(2); // m/s
  const [h1, setH1] = useState(5); // m
  const [v2, setV2] = useState(6); // m/s
  const [h2, setH2] = useState(0); // m

  const rho = 1000; // water
  const g = 9.81;

  // Bernoulli: P1 + 0.5*rho*v1^2 + rho*g*h1 = P2 + 0.5*rho*v2^2 + rho*g*h2
  const p1Pa = p1 * 1000;
  const bernoulliLeft = p1Pa + 0.5 * rho * v1 * v1 + rho * g * h1;
  const p2Pa = bernoulliLeft - 0.5 * rho * v2 * v2 - rho * g * h2;
  const p2 = p2Pa / 1000;

  const kineticTerm1 = (0.5 * rho * v1 * v1) / 1000;
  const kineticTerm2 = (0.5 * rho * v2 * v2) / 1000;
  const potentialTerm1 = (rho * g * h1) / 1000;
  const potentialTerm2 = (rho * g * h2) / 1000;

  const maxBar = Math.max(
    p1 + kineticTerm1 + potentialTerm1,
    1
  );

  return (
    <div className="space-y-6">
      {/* Concept Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">
                Bernoulli&apos;s Equation
              </CardTitle>
              <CardDescription className="mt-1 text-base">
                Conservation of energy for flowing fluids
              </CardDescription>
            </div>
            <Button
              variant={isComplete ? "default" : "outline"}
              size="sm"
              onClick={onComplete}
              className="cursor-pointer"
            >
              {isComplete ? "Completed" : "Mark Complete"}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="key-concept">
            <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-primary">
              Key Formula
            </h3>
            <div className="text-lg font-bold tracking-tight sm:text-xl">
              <Tex display>{"P + \\tfrac{1}{2}\\rho v^2 + \\rho gh = \\text{constant}"}</Tex>
            </div>
            <div className="mt-3 flex flex-wrap gap-3 text-xs text-muted-foreground">
              <Badge variant="outline" className="font-normal">
                <Tex>P</Tex> = Pressure energy
              </Badge>
              <Badge variant="outline" className="font-normal">
                <Tex>{"\\tfrac{1}{2}\\rho v^2"}</Tex> = Kinetic energy
              </Badge>
              <Badge variant="outline" className="font-normal">
                <Tex>{"\\rho gh"}</Tex> = Potential energy
              </Badge>
            </div>
          </div>

          <div className="grid gap-2 text-sm leading-relaxed text-muted-foreground sm:grid-cols-2">
            <p>
              Bernoulli&apos;s equation is really just conservation of energy per
              unit volume applied to flowing fluids. The total &ldquo;energy
              density&rdquo; stays constant along a streamline.
            </p>
            <p>
              The key insight: <strong>where fluid moves faster, pressure is lower</strong>.
              This explains airplane lift, why shower curtains get sucked in,
              and how a Venturi tube works.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Interactive Simulation */}
      <div className="grid gap-6 lg:grid-cols-5">
        {/* Controls */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Point 1 (Input)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span>Pressure (P&#8321;)</span>
                <span className="formula-box">{p1} kPa</span>
              </div>
              <Slider
                value={[p1]}
                onValueChange={([v]) => setP1(v)}
                min={50}
                max={500}
                step={5}
                className="cursor-pointer"
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span>Velocity (v&#8321;)</span>
                <span className="formula-box">{v1.toFixed(1)} m/s</span>
              </div>
              <Slider
                value={[v1]}
                onValueChange={([v]) => setV1(v)}
                min={0}
                max={20}
                step={0.5}
                className="cursor-pointer"
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span>Height (h&#8321;)</span>
                <span className="formula-box">{h1.toFixed(1)} m</span>
              </div>
              <Slider
                value={[h1]}
                onValueChange={([v]) => setH1(v)}
                min={0}
                max={20}
                step={0.5}
                className="cursor-pointer"
              />
            </div>

            <Separator />

            <div>
              <h4 className="mb-3 text-sm font-semibold">Point 2 (Output)</h4>
              <div className="space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Velocity (v&#8322;)</span>
                    <span className="formula-box">{v2.toFixed(1)} m/s</span>
                  </div>
                  <Slider
                    value={[v2]}
                    onValueChange={([v]) => setV2(v)}
                    min={0}
                    max={20}
                    step={0.5}
                    className="cursor-pointer"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Height (h&#8322;)</span>
                    <span className="formula-box">{h2.toFixed(1)} m</span>
                  </div>
                  <Slider
                    value={[h2]}
                    onValueChange={([v]) => setH2(v)}
                    min={0}
                    max={20}
                    step={0.5}
                    className="cursor-pointer"
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Result */}
            <div className="rounded-xl bg-primary/5 border border-primary/20 p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold">P&#8322; =</span>
                <span className={`font-mono text-lg font-bold ${p2 < 0 ? "text-destructive" : "text-primary"}`}>
                  {p2.toFixed(1)} kPa
                </span>
              </div>
              {p2 < 0 && (
                <p className="mt-2 text-xs text-destructive">
                  Negative pressure! This means the flow conditions are
                  physically impossible (cavitation would occur).
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Energy Bar Visualization */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="text-lg">Energy Distribution</CardTitle>
            <CardDescription>
              Each bar shows the three energy terms. Total stays constant.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Energy bar chart */}
            <div className="space-y-6">
              {/* Point 1 */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm font-medium">
                  <span>Point 1</span>
                  <span className="font-mono text-xs text-muted-foreground">
                    Total: {(p1 + kineticTerm1 + potentialTerm1).toFixed(1)} kPa
                  </span>
                </div>
                <div className="flex h-12 w-full overflow-hidden rounded-xl">
                  <div
                    className="flex items-center justify-center transition-all duration-300"
                    style={{
                      width: `${(p1 / maxBar) * 100}%`,
                      backgroundColor: "oklch(0.55 0.2 260)",
                    }}
                  >
                    {p1 / maxBar > 0.1 && (
                      <span className="text-[10px] font-bold text-white">
                        P: {p1.toFixed(0)}
                      </span>
                    )}
                  </div>
                  <div
                    className="flex items-center justify-center transition-all duration-300"
                    style={{
                      width: `${(kineticTerm1 / maxBar) * 100}%`,
                      backgroundColor: "oklch(0.6 0.2 145)",
                    }}
                  >
                    {kineticTerm1 / maxBar > 0.08 && (
                      <span className="text-[10px] font-bold text-white">
                        KE: {kineticTerm1.toFixed(0)}
                      </span>
                    )}
                  </div>
                  <div
                    className="flex items-center justify-center transition-all duration-300"
                    style={{
                      width: `${(potentialTerm1 / maxBar) * 100}%`,
                      backgroundColor: "oklch(0.65 0.18 75)",
                    }}
                  >
                    {potentialTerm1 / maxBar > 0.08 && (
                      <span className="text-[10px] font-bold text-white">
                        PE: {potentialTerm1.toFixed(0)}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Point 2 */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm font-medium">
                  <span>Point 2</span>
                  <span className="font-mono text-xs text-muted-foreground">
                    Total: {(p2 + kineticTerm2 + potentialTerm2).toFixed(1)} kPa
                  </span>
                </div>
                <div className="flex h-12 w-full overflow-hidden rounded-xl">
                  <div
                    className="flex items-center justify-center transition-all duration-300"
                    style={{
                      width: `${Math.max(0, (p2 / maxBar) * 100)}%`,
                      backgroundColor: p2 >= 0 ? "oklch(0.55 0.2 260)" : "oklch(0.577 0.245 27.325)",
                    }}
                  >
                    {p2 / maxBar > 0.1 && (
                      <span className="text-[10px] font-bold text-white">
                        P: {p2.toFixed(0)}
                      </span>
                    )}
                  </div>
                  <div
                    className="flex items-center justify-center transition-all duration-300"
                    style={{
                      width: `${(kineticTerm2 / maxBar) * 100}%`,
                      backgroundColor: "oklch(0.6 0.2 145)",
                    }}
                  >
                    {kineticTerm2 / maxBar > 0.08 && (
                      <span className="text-[10px] font-bold text-white">
                        KE: {kineticTerm2.toFixed(0)}
                      </span>
                    )}
                  </div>
                  <div
                    className="flex items-center justify-center transition-all duration-300"
                    style={{
                      width: `${(potentialTerm2 / maxBar) * 100}%`,
                      backgroundColor: "oklch(0.65 0.18 75)",
                    }}
                  >
                    {potentialTerm2 / maxBar > 0.08 && (
                      <span className="text-[10px] font-bold text-white">
                        PE: {potentialTerm2.toFixed(0)}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Legend */}
              <div className="flex flex-wrap items-center justify-center gap-4 text-xs">
                <span className="flex items-center gap-1.5">
                  <span className="inline-block h-3 w-3 rounded-sm" style={{ backgroundColor: "oklch(0.55 0.2 260)" }} />
                  Pressure (P)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="inline-block h-3 w-3 rounded-sm" style={{ backgroundColor: "oklch(0.6 0.2 145)" }} />
                  Kinetic (&#189;&#961;v&#178;)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="inline-block h-3 w-3 rounded-sm" style={{ backgroundColor: "oklch(0.65 0.18 75)" }} />
                  Potential (&#961;gh)
                </span>
              </div>
            </div>

            <Separator />

            {/* Detailed breakdown table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-xs text-muted-foreground">
                    <th className="pb-2 font-medium">Term</th>
                    <th className="pb-2 text-right font-medium">Point 1</th>
                    <th className="pb-2 text-right font-medium">Point 2</th>
                    <th className="pb-2 text-right font-medium">Change</th>
                  </tr>
                </thead>
                <tbody className="font-mono text-xs">
                  <tr className="border-b">
                    <td className="py-2 font-sans">Pressure P</td>
                    <td className="py-2 text-right">{p1.toFixed(1)} kPa</td>
                    <td className="py-2 text-right">{p2.toFixed(1)} kPa</td>
                    <td className={`py-2 text-right ${p2 - p1 < 0 ? "text-destructive" : "text-green-600"}`}>
                      {(p2 - p1) > 0 ? "+" : ""}{(p2 - p1).toFixed(1)}
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 font-sans">Kinetic &#189;&#961;v&#178;</td>
                    <td className="py-2 text-right">{kineticTerm1.toFixed(1)} kPa</td>
                    <td className="py-2 text-right">{kineticTerm2.toFixed(1)} kPa</td>
                    <td className={`py-2 text-right ${kineticTerm2 - kineticTerm1 > 0 ? "text-green-600" : "text-destructive"}`}>
                      {(kineticTerm2 - kineticTerm1) > 0 ? "+" : ""}{(kineticTerm2 - kineticTerm1).toFixed(1)}
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 font-sans">Potential &#961;gh</td>
                    <td className="py-2 text-right">{potentialTerm1.toFixed(1)} kPa</td>
                    <td className="py-2 text-right">{potentialTerm2.toFixed(1)} kPa</td>
                    <td className={`py-2 text-right ${potentialTerm2 - potentialTerm1 > 0 ? "text-green-600" : "text-destructive"}`}>
                      {(potentialTerm2 - potentialTerm1) > 0 ? "+" : ""}{(potentialTerm2 - potentialTerm1).toFixed(1)}
                    </td>
                  </tr>
                  <tr className="font-bold">
                    <td className="py-2 font-sans">Total</td>
                    <td className="py-2 text-right">{(p1 + kineticTerm1 + potentialTerm1).toFixed(1)}</td>
                    <td className="py-2 text-right">{(p2 + kineticTerm2 + potentialTerm2).toFixed(1)}</td>
                    <td className="py-2 text-right text-primary">= 0</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Insight */}
            <div className="rounded-xl bg-muted/50 p-3 text-sm text-muted-foreground">
              {v2 > v1 && h2 <= h1
                ? `Higher velocity at Point 2 means lower pressure (Venturi effect). The faster the fluid flows, the less pressure it exerts on the sides.`
                : h2 < h1 && v2 <= v1
                  ? `Point 2 is lower, so gravitational PE decreases. This energy goes into higher pressure.`
                  : `Notice how the three terms trade off: the total energy per unit volume stays constant along the streamline.`}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Key Takeaways */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Key Takeaways</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion multiple className="w-full">
            <AccordionItem value="1">
              <AccordionTrigger className="cursor-pointer text-sm">
                Fast flow = Low pressure (the Bernoulli effect)
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">
                This is the most important intuition from Bernoulli&apos;s
                equation. Where a fluid speeds up (like in a constriction),
                pressure drops. This creates the lift force on airplane wings and
                makes a spinning baseball curve.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="2">
              <AccordionTrigger className="cursor-pointer text-sm">
                Bernoulli&apos;s only applies along a streamline in ideal flow
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">
                The assumptions are: (1) incompressible fluid, (2) no viscosity
                (no friction/energy loss), (3) steady flow, (4) along a single
                streamline. AP Physics 1 problems almost always give you these
                ideal conditions.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="3">
              <AccordionTrigger className="cursor-pointer text-sm">
                Special case: Torricelli&apos;s Theorem
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">
                Water draining from a hole in a tank: if the tank is large (v at
                surface &#8776; 0) and the hole is open to the atmosphere (P
                cancels), then v = &#8730;(2gh). The exit speed is the same as
                if the water had fallen from height h in free fall!
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="4">
              <AccordionTrigger className="cursor-pointer text-sm">
                AP Exam strategy: Simplify first
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">
                Before plugging into Bernoulli&apos;s, cancel what you can:
                Same height? Remove &#961;gh terms. Open to atmosphere on both
                ends? P cancels. Large tank vs small opening? v&#8321; &#8776; 0.
                Most AP problems let you drop at least one term.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
