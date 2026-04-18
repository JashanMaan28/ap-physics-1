"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tex } from "@/components/ui/math";
import { toLatex } from "@/lib/latex";

interface TopicProps { onComplete: () => void; isComplete: boolean; }

export function PositionVelocity({ onComplete, isComplete }: TopicProps) {
  const [time, setTime] = useState(3);
  const [x0, setX0] = useState(0);
  const [velocity, setVelocity] = useState(5);

  const position = x0 + velocity * time;
  const displacement = velocity * time;

  const svgWidth = 500;
  const svgHeight = 200;
  const scale = 4;
  const objX = 50 + (position * scale);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Position & Velocity</CardTitle>
              <CardDescription className="mt-1 text-base">
                Understanding displacement, position, and average velocity
              </CardDescription>
            </div>
            <Button variant={isComplete ? "default" : "outline"} size="sm" onClick={onComplete} className="cursor-pointer">
              {isComplete ? "Completed" : "Mark Complete"}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-primary">Key Formulas</h3>
            <div className="space-y-1">
              <div className="text-xl font-bold"><Tex display>{toLatex("x = x₀ + vt")}</Tex></div>
              <div className="text-lg"><Tex display>{"v_{avg} = \\Delta x / \\Delta t"}</Tex></div>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 text-sm text-muted-foreground sm:grid-cols-4">
              <span><Tex>x</Tex> = Position</span>
              <span><Tex>{toLatex("x₀")}</Tex> = Initial position</span>
              <span><Tex>v</Tex> = Velocity</span>
              <span><Tex>{toLatex("Δx")}</Tex> = Displacement</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Interactive Simulation</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="text-xs text-muted-foreground">Initial Position x₀ = {x0} m</label>
              <Slider value={x0} onValueChange={setX0} min={-10} max={10} step={1} />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Velocity v = {velocity} m/s</label>
              <Slider value={velocity} onValueChange={setVelocity} min={-10} max={10} step={0.5} />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Time t = {time} s</label>
              <Slider value={time} onValueChange={setTime} min={0} max={10} step={0.5} />
            </div>
          </div>

          <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full rounded-lg border bg-muted/30">
            {/* Number line */}
            <line x1="20" y1="100" x2="480" y2="100" stroke="currentColor" strokeWidth="1" opacity="0.3" />
            {Array.from({ length: 21 }, (_, i) => i - 10).map(n => (
              <g key={n}>
                <line x1={50 + n * scale * 10} y1="95" x2={50 + n * scale * 10} y2="105" stroke="currentColor" strokeWidth="1" opacity="0.3" />
                {n % 5 === 0 && <text x={50 + n * scale * 10} y="120" textAnchor="middle" fontSize="10" fill="currentColor" opacity="0.5">{n * 10}</text>}
              </g>
            ))}
            {/* Initial position marker */}
            <circle cx={50 + x0 * scale} cy="100" r="6" fill="#94a3b8" opacity="0.5" />
            <text x={50 + x0 * scale} y="85" textAnchor="middle" fontSize="10" fill="#94a3b8">x₀</text>
            {/* Displacement arrow */}
            {displacement !== 0 && (
              <line x1={50 + x0 * scale} y1="70" x2={Math.min(Math.max(objX, 20), 480)} y2="70" stroke="#3b82f6" strokeWidth="2" markerEnd="url(#arrow)" />
            )}
            <defs><marker id="arrow" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#3b82f6" /></marker></defs>
            {/* Current position */}
            <circle cx={Math.min(Math.max(objX, 20), 480)} cy="100" r="10" fill="#3b82f6" />
            <text x={Math.min(Math.max(objX, 20), 480)} y="145" textAnchor="middle" fontSize="11" fill="#3b82f6" fontWeight="bold">x = {position.toFixed(1)} m</text>
          </svg>

          <Separator />
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg bg-muted/50 border p-3 text-center">
              <p className="text-xs text-muted-foreground">Position</p>
              <p className="font-mono text-lg font-bold">{position.toFixed(1)} m</p>
            </div>
            <div className="rounded-lg bg-muted/50 border p-3 text-center">
              <p className="text-xs text-muted-foreground">Displacement</p>
              <p className="font-mono text-lg font-bold">{displacement.toFixed(1)} m</p>
            </div>
            <div className="rounded-lg bg-muted/50 border p-3 text-center">
              <p className="text-xs text-muted-foreground">Avg Velocity</p>
              <p className="font-mono text-lg font-bold">{time > 0 ? (displacement / time).toFixed(2) : "—"} m/s</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Key Concepts</CardTitle></CardHeader>
        <CardContent>
          <div className="grid gap-2 text-sm leading-relaxed text-muted-foreground sm:grid-cols-2">
            <p><strong>Position</strong> is the location of an object relative to an origin. It can be positive or negative depending on direction.</p>
            <p><strong>Displacement</strong> (<Tex>{toLatex("Δx = x - x₀")}</Tex>) is the change in position — a vector quantity with both magnitude and direction.</p>
            <p><strong>Distance</strong> is the total path length traveled — always positive (scalar).</p>
            <p><strong>Average velocity</strong> is displacement over time. Unlike speed, it can be negative, indicating direction.</p>
          </div>
        </CardContent>
      </Card>

      <Accordion>
        <AccordionItem value="faq-1">
          <AccordionTrigger>Is displacement the same as distance?</AccordionTrigger>
          <AccordionContent className="text-sm text-muted-foreground">No. Displacement is the straight-line change in position (vector), while distance is the total path length (scalar). If you walk 3 m east then 3 m west, <Tex>{"\\text{displacement} = 0"}</Tex> but <Tex>{"\\text{distance} = 6 \\text{ m}"}</Tex>.</AccordionContent>
        </AccordionItem>
        <AccordionItem value="faq-2">
          <AccordionTrigger>Can velocity be negative?</AccordionTrigger>
          <AccordionContent className="text-sm text-muted-foreground">Yes! Velocity is a vector. Negative velocity simply means the object is moving in the negative direction (e.g., left or down). Speed is the magnitude of velocity and is always positive.</AccordionContent>
        </AccordionItem>
        <AccordionItem value="faq-3">
          <AccordionTrigger>What&apos;s the difference between average and instantaneous velocity?</AccordionTrigger>
          <AccordionContent className="text-sm text-muted-foreground">Average velocity <Tex>{"= \\Delta x / \\Delta t"}</Tex> over an interval. Instantaneous velocity is the velocity at a single moment — the slope of the <Tex>x</Tex>-<Tex>t</Tex> graph at that point (the derivative <Tex>{"dx/dt"}</Tex>).</AccordionContent>
        </AccordionItem>
        <AccordionItem value="faq-4">
          <AccordionTrigger>Can an object have zero velocity but nonzero position?</AccordionTrigger>
          <AccordionContent className="text-sm text-muted-foreground">Absolutely. An object sitting still at <Tex>{"x = 10 \\text{ m}"}</Tex> has position = 10 m and velocity = 0. Position tells you where something is; velocity tells you how fast it&apos;s changing position.</AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
