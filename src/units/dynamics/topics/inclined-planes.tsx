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

export function InclinedPlanes({
  onComplete,
  isComplete,
}: {
  onComplete: () => void;
  isComplete: boolean;
}) {
  const [angle, setAngle] = useState(30);
  const [mass, setMass] = useState(5);
  const [muK, setMuK] = useState(0.2);

  const g = 9.8;
  const theta = (angle * Math.PI) / 180;
  const weight = mass * g;
  const mgSinTheta = weight * Math.sin(theta);
  const mgCosTheta = weight * Math.cos(theta);
  const normalForce = mgCosTheta;
  const frictionForce = muK * normalForce;
  const netForce = mgSinTheta - frictionForce;
  const acceleration = Math.max(netForce / mass, 0);

  // SVG geometry
  const rampLen = 280;
  const rampX2 = 320;
  const rampY2 = 180;
  const rampX1 = rampX2 - rampLen * Math.cos(theta);
  const rampY1 = rampY2 - rampLen * Math.sin(theta);
  const blockCx = (rampX1 + rampX2) / 2;
  const blockCy = (rampY1 + rampY2) / 2;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div>
              <CardTitle className="text-2xl">Inclined Planes</CardTitle>
              <CardDescription className="mt-1">
                Analyzing forces on an inclined plane by decomposing gravity into components parallel
                and perpendicular to the surface.
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
          {/* Controls */}
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <label className="text-sm font-medium">Angle: {angle}&deg;</label>
              <Slider value={[angle]} onValueChange={(v) => setAngle(v[0])} min={5} max={85} step={1} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Mass: {mass} kg</label>
              <Slider value={[mass]} onValueChange={(v) => setMass(v[0])} min={1} max={20} step={0.5} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium"><Tex>{"\\mu_k"}</Tex>: {muK.toFixed(2)}</label>
              <Slider value={[muK]} onValueChange={(v) => setMuK(v[0])} min={0} max={1} step={0.01} />
            </div>
          </div>

          {/* SVG FBD */}
          <div className="rounded-lg border bg-white dark:bg-slate-900 p-2">
            <svg viewBox="0 0 400 220" className="w-full">
              {/* Ramp surface */}
              <line x1={rampX1} y1={rampY1} x2={rampX2} y2={rampY2} stroke="#64748b" strokeWidth="3" />
              {/* Ground */}
              <line x1={rampX2} y1={rampY2} x2={rampX2} y2={rampY2 + 2} stroke="#64748b" strokeWidth="2" />
              {/* Angle arc */}
              <path
                d={`M ${rampX2 - 40} ${rampY2} A 40 40 0 0 0 ${rampX2 - 40 * Math.cos(theta)} ${rampY2 - 40 * Math.sin(theta)}`}
                fill="none"
                stroke="#64748b"
                strokeWidth="1"
              />
              <text x={rampX2 - 55} y={rampY2 - 8} fontSize="11" fill="#64748b">{angle}&deg;</text>

              {/* Block (small rectangle at midpoint) */}
              <rect
                x={blockCx - 15}
                y={blockCy - 15}
                width={30}
                height={20}
                fill="#ef4444"
                rx={3}
                transform={`rotate(${-angle}, ${blockCx}, ${blockCy})`}
              />

              {/* mg down */}
              <line x1={blockCx} y1={blockCy} x2={blockCx} y2={blockCy + 50} stroke="#ef4444" strokeWidth="2" markerEnd="url(#arrowMg)" />
              <text x={blockCx + 5} y={blockCy + 55} fill="#ef4444" fontSize="10" fontWeight="bold">mg={weight.toFixed(1)}N</text>

              {/* mg sin theta (parallel, down-ramp) */}
              <line
                x1={blockCx}
                y1={blockCy}
                x2={blockCx + mgSinTheta * 0.8 * Math.cos(theta)}
                y2={blockCy + mgSinTheta * 0.8 * Math.sin(theta)}
                stroke="#f59e0b"
                strokeWidth="2"
                markerEnd="url(#arrowPar)"
              />
              <text
                x={blockCx + mgSinTheta * 0.5 * Math.cos(theta) - 5}
                y={blockCy + mgSinTheta * 0.5 * Math.sin(theta) + 15}
                fill="#f59e0b"
                fontSize="9"
                fontWeight="bold"
              >
                mg sin&theta;={mgSinTheta.toFixed(1)}N
              </text>

              {/* Normal force (perpendicular, away from surface) */}
              <line
                x1={blockCx}
                y1={blockCy}
                x2={blockCx - normalForce * 0.6 * Math.sin(theta)}
                y2={blockCy + normalForce * 0.6 * (-Math.cos(theta))}
                stroke="#8b5cf6"
                strokeWidth="2"
                markerEnd="url(#arrowNorm)"
              />
              <text
                x={blockCx - normalForce * 0.4 * Math.sin(theta) - 10}
                y={blockCy + normalForce * 0.4 * (-Math.cos(theta)) - 5}
                fill="#8b5cf6"
                fontSize="9"
                fontWeight="bold"
              >
                N={normalForce.toFixed(1)}N
              </text>

              {/* Friction (up-ramp) */}
              {frictionForce > 0.1 && (
                <line
                  x1={blockCx}
                  y1={blockCy}
                  x2={blockCx - frictionForce * 0.8 * Math.cos(theta)}
                  y2={blockCy - frictionForce * 0.8 * Math.sin(theta)}
                  stroke="#22c55e"
                  strokeWidth="2"
                  markerEnd="url(#arrowFr)"
                />
              )}

              <defs>
                <marker id="arrowMg" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
                  <path d="M0,0 L8,3 L0,6 Z" fill="#ef4444" />
                </marker>
                <marker id="arrowPar" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
                  <path d="M0,0 L8,3 L0,6 Z" fill="#f59e0b" />
                </marker>
                <marker id="arrowNorm" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
                  <path d="M0,0 L8,3 L0,6 Z" fill="#8b5cf6" />
                </marker>
                <marker id="arrowFr" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
                  <path d="M0,0 L8,3 L0,6 Z" fill="#22c55e" />
                </marker>
              </defs>
            </svg>
          </div>

          {/* Results */}
          <div className="grid gap-3 sm:grid-cols-4">
            <Card className="bg-slate-50 dark:bg-slate-500/10">
              <CardContent className="pt-3 text-center">
                <p className="text-xs text-muted-foreground"><Tex>{"mg \\sin \\theta"}</Tex></p>
                <p className="text-lg font-bold">{mgSinTheta.toFixed(1)} N</p>
              </CardContent>
            </Card>
            <Card className="bg-slate-50 dark:bg-slate-500/10">
              <CardContent className="pt-3 text-center">
                <p className="text-xs text-muted-foreground">Normal (N)</p>
                <p className="text-lg font-bold">{normalForce.toFixed(1)} N</p>
              </CardContent>
            </Card>
            <Card className="bg-slate-50 dark:bg-slate-500/10">
              <CardContent className="pt-3 text-center">
                <p className="text-xs text-muted-foreground">Friction</p>
                <p className="text-lg font-bold">{frictionForce.toFixed(1)} N</p>
              </CardContent>
            </Card>
            <Card className="bg-slate-50 dark:bg-slate-500/10">
              <CardContent className="pt-3 text-center">
                <p className="text-xs text-muted-foreground">Acceleration</p>
                <p className="text-lg font-bold">{acceleration.toFixed(2)} m/s²</p>
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
              <div className="text-center text-lg font-bold text-amber-900 dark:text-amber-200"><Tex display>{"a = g(\\sin \\theta - \\mu_k \\cos \\theta)"}</Tex></div>
              <div className="text-center text-lg font-bold text-amber-900 dark:text-amber-200"><Tex display>{"N = mg \\cos \\theta"}</Tex></div>
            </CardContent>
          </Card>

          <Separator />

          {/* FAQ */}
          <Accordion className="w-full">
            <AccordionItem value="q1">
              <AccordionTrigger>Why decompose gravity into parallel and perpendicular components?</AccordionTrigger>
              <AccordionContent>
                <PhysicsText display={false}>{"The object can only accelerate along the ramp surface. By decomposing gravity into a component along the ramp (mg sin θ) and perpendicular to it (mg cos θ), we can apply Newton's second law separately in each direction."}</PhysicsText>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q2">
              <AccordionTrigger>At what angle does the block start sliding?</AccordionTrigger>
              <AccordionContent>
                <PhysicsText display={false}>{"The block slides when mg sin(θ) exceeds the maximum static friction μ_s · mg cos(θ). This gives the critical angle: θ = arctan(μ_s). For μ_s = 0.5, that is about 26.6 degrees."}</PhysicsText>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q3">
              <AccordionTrigger>How does adding a push up or down the ramp change things?</AccordionTrigger>
              <AccordionContent>
                An applied force along the ramp simply adds to (or subtracts from) the net force
                parallel to the surface. A force perpendicular to the ramp changes the normal force,
                which in turn changes friction.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
