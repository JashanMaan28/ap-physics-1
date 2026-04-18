"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tex } from "@/components/ui/math";
import { PhysicsText } from "@/components/ui/physics-text";

export function TensionNormal({
  onComplete,
  isComplete,
}: {
  onComplete: () => void;
  isComplete: boolean;
}) {
  const [mass, setMass] = useState(5);
  const g = 9.8;
  const weight = mass * g;
  const tension = weight; // hanging mass at rest
  const normalForce = weight; // mass on table

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div>
              <CardTitle className="text-2xl">Tension &amp; Normal Force</CardTitle>
              <CardDescription className="mt-1">
                Tension is the pulling force transmitted through a string, rope, or cable. The normal
                force is the contact force perpendicular to a surface.
              </CardDescription>
            </div>
            <Button
              variant={isComplete ? "default" : "outline"}
              size="sm"
              onClick={onComplete}
              className="cursor-pointer shrink-0"
            >
              {isComplete ? "Completed" : "Mark Complete"}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Tension Section */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Tension in a Hanging Mass</h3>
            <p className="text-muted-foreground">
              When a mass hangs from a rope at rest, the tension in the rope equals the weight of
              the mass: <Tex>T = mg</Tex>. The rope transmits force without changing its magnitude (for a
              massless rope).
            </p>

            <div className="space-y-2">
              <label className="text-sm font-medium">Mass: {mass} kg</label>
              <Slider value={[mass]} onValueChange={(v) => setMass(v[0])} min={0.5} max={20} step={0.5} />
            </div>

            {/* SVG: Hanging mass */}
            <div className="rounded-lg border bg-white dark:bg-slate-900 p-2">
              <svg viewBox="0 0 300 220" className="w-full max-w-sm mx-auto">
                {/* Ceiling */}
                <rect x="0" y="0" width="300" height="15" fill="#94a3b8" />
                {Array.from({ length: 15 }).map((_, i) => (
                  <line key={i} x1={i * 20} y1="0" x2={i * 20 + 10} y2="12" stroke="#64748b" strokeWidth="1" />
                ))}

                {/* Rope */}
                <line x1="150" y1="15" x2="150" y2="100" stroke="#78716c" strokeWidth="2" strokeDasharray="4,2" />

                {/* Mass block */}
                <rect x="120" y="100" width="60" height="50" fill="#3b82f6" rx="5" />
                <text x="150" y="130" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">
                  {mass}kg
                </text>

                {/* Tension arrow (up) */}
                <line x1="150" y1="98" x2="150" y2="45" stroke="#22c55e" strokeWidth="3" markerEnd="url(#arrowT)" />
                <text x="165" y="70" fill="#22c55e" fontSize="12" fontWeight="bold">
                  T={tension.toFixed(1)}N
                </text>

                {/* Weight arrow (down) */}
                <line x1="150" y1="152" x2="150" y2="205" stroke="#ef4444" strokeWidth="3" markerEnd="url(#arrowW)" />
                <text x="165" y="190" fill="#ef4444" fontSize="12" fontWeight="bold">
                  W={weight.toFixed(1)}N
                </text>

                <defs>
                  <marker id="arrowT" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
                    <path d="M0,0 L8,3 L0,6 Z" fill="#22c55e" />
                  </marker>
                  <marker id="arrowW" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
                    <path d="M0,0 L8,3 L0,6 Z" fill="#ef4444" />
                  </marker>
                </defs>
              </svg>
            </div>

            <Card className="bg-green-50 border-green-200 dark:bg-green-500/10 dark:border-green-500/30">
              <CardContent className="pt-3 text-center">
                <div className="font-semibold text-green-900 dark:text-green-200">At rest: <Tex>{`T = mg = ${tension.toFixed(1)}`}</Tex> N</div>
              </CardContent>
            </Card>
          </div>

          <Separator />

          {/* Normal Force Section */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Normal Force</h3>
            <p className="text-muted-foreground">
              The normal force is the support force exerted by a surface perpendicular to the
              surface. On a flat, horizontal surface with no other vertical forces, <Tex>N = mg</Tex>.
            </p>

            <div className="rounded-lg border bg-white dark:bg-slate-900 p-2">
              <svg viewBox="0 0 300 160" className="w-full max-w-sm mx-auto">
                {/* Surface */}
                <rect x="0" y="110" width="300" height="15" fill="#94a3b8" />
                {Array.from({ length: 15 }).map((_, i) => (
                  <line key={i} x1={i * 20} y1="125" x2={i * 20 + 10} y2="137" stroke="#64748b" strokeWidth="1" />
                ))}

                {/* Block on surface */}
                <rect x="120" y="70" width="60" height="40" fill="#f59e0b" rx="4" />
                <text x="150" y="95" textAnchor="middle" fill="white" fontSize="13" fontWeight="bold">
                  {mass}kg
                </text>

                {/* Normal force arrow (up) */}
                <line x1="150" y1="68" x2="150" y2="20" stroke="#8b5cf6" strokeWidth="3" markerEnd="url(#arrowN)" />
                <text x="170" y="45" fill="#8b5cf6" fontSize="12" fontWeight="bold">
                  N={normalForce.toFixed(1)}N
                </text>

                {/* Weight arrow (down) */}
                <line x1="150" y1="112" x2="150" y2="155" stroke="#ef4444" strokeWidth="3" markerEnd="url(#arrowW2)" />
                <text x="170" y="145" fill="#ef4444" fontSize="12" fontWeight="bold">
                  W={weight.toFixed(1)}N
                </text>

                <defs>
                  <marker id="arrowN" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
                    <path d="M0,0 L8,3 L0,6 Z" fill="#8b5cf6" />
                  </marker>
                  <marker id="arrowW2" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
                    <path d="M0,0 L8,3 L0,6 Z" fill="#ef4444" />
                  </marker>
                </defs>
              </svg>
            </div>

            <Card className="bg-purple-50 border-purple-200 dark:bg-purple-500/10 dark:border-purple-500/30">
              <CardContent className="pt-3 text-center">
                <div className="font-semibold text-purple-900 dark:text-purple-200">
                  Flat surface, no extra vertical forces: <Tex>{`N = mg = ${normalForce.toFixed(1)}`}</Tex> N
                </div>
              </CardContent>
            </Card>
          </div>

          <Separator />

          {/* Key Formula */}
          <Card className="bg-amber-50 border-amber-200 dark:bg-amber-500/10 dark:border-amber-500/30">
            <CardHeader>
              <CardTitle className="text-lg text-amber-900 dark:text-amber-200">Key Formulas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              <div className="text-center text-xl font-bold text-amber-900 dark:text-amber-200"><Tex display>T = mg</Tex> (hanging at rest)</div>
              <div className="text-center text-xl font-bold text-amber-900 dark:text-amber-200"><Tex display>N = mg</Tex> (flat surface)</div>
              <p className="text-center text-sm text-amber-700 dark:text-amber-300/80 mt-1">
                These change when the system accelerates or the surface is inclined.
              </p>
            </CardContent>
          </Card>

          <Separator />

          {/* FAQ */}
          <Accordion className="w-full">
            <AccordionItem value="q1">
              <AccordionTrigger>Is the normal force always equal to weight?</AccordionTrigger>
              <AccordionContent>
                <PhysicsText display={false}>{"No. The normal force equals mg only on a flat surface with no other vertical forces. On an incline, N = mg cos(θ). If you push down on the object, N increases. In an accelerating elevator, N differs from mg."}</PhysicsText>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q2">
              <AccordionTrigger>Can tension vary along a rope?</AccordionTrigger>
              <AccordionContent>
                For a massless rope (the AP Physics 1 model), tension is the same everywhere. For a
                rope with mass, tension varies -- it is greater at the top because it must support
                more rope below.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q3">
              <AccordionTrigger>What about tension in a rope over a pulley?</AccordionTrigger>
              <AccordionContent>
                For a massless, frictionless pulley with a massless rope, the tension is the same on
                both sides. A pulley only changes the direction of the tension force, not its
                magnitude.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
