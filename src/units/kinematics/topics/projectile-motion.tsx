"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface TopicProps { onComplete: () => void; isComplete: boolean; }

const g = 9.8;

export function ProjectileMotion({ onComplete, isComplete }: TopicProps) {
  const [angle, setAngle] = useState(45);
  const [speed, setSpeed] = useState(20);

  const rad = (angle * Math.PI) / 180;
  const vx = speed * Math.cos(rad);
  const vy = speed * Math.sin(rad);
  const totalTime = (2 * vy) / g;
  const range = vx * totalTime;
  const maxHeight = (vy * vy) / (2 * g);

  // Generate trajectory points
  const points: { x: number; y: number }[] = [];
  const steps = 50;
  for (let i = 0; i <= steps; i++) {
    const t = (totalTime * i) / steps;
    points.push({ x: vx * t, y: vy * t - 0.5 * g * t * t });
  }

  const svgW = 500;
  const svgH = 250;
  const scaleX = range > 0 ? (svgW - 80) / range : 1;
  const scaleY = maxHeight > 0 ? (svgH - 80) / maxHeight : 1;
  const scale = Math.min(scaleX, scaleY, 5);

  const pathD = points.map((p, i) => {
    const sx = 40 + p.x * scale;
    const sy = svgH - 30 - p.y * scale;
    return `${i === 0 ? "M" : "L"} ${sx} ${sy}`;
  }).join(" ");

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Projectile Motion</CardTitle>
              <CardDescription className="mt-1 text-base">2D motion under gravity — combining horizontal and vertical kinematics</CardDescription>
            </div>
            <Button variant={isComplete ? "default" : "outline"} size="sm" onClick={onComplete} className="cursor-pointer">
              {isComplete ? "Completed" : "Mark Complete"}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-primary">Key Formulas</h3>
            <div className="grid gap-1 font-mono">
              <p className="text-lg font-bold">R = v₀² sin(2θ) / g</p>
              <p className="text-lg font-bold">H = v₀² sin²(θ) / (2g)</p>
              <p className="text-base">T = 2v₀ sin(θ) / g</p>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 text-sm text-muted-foreground">
              <span><strong>R</strong> = Range (horizontal)</span>
              <span><strong>H</strong> = Max height</span>
              <span><strong>T</strong> = Total flight time</span>
              <span><strong>θ</strong> = Launch angle</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Interactive Simulation</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-xs text-muted-foreground">Launch Angle θ = {angle}°</label>
              <Slider value={angle} onValueChange={setAngle} min={5} max={85} step={1} />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Initial Speed v₀ = {speed} m/s</label>
              <Slider value={speed} onValueChange={setSpeed} min={5} max={40} step={1} />
            </div>
          </div>

          <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full rounded-lg border bg-muted/30">
            {/* Ground */}
            <line x1="30" y1={svgH - 30} x2={svgW - 10} y2={svgH - 30} stroke="currentColor" strokeWidth="1" opacity="0.3" />
            {/* Trajectory */}
            <path d={pathD} fill="none" stroke="#3b82f6" strokeWidth="2.5" />
            {/* Launch point */}
            <circle cx="40" cy={svgH - 30} r="4" fill="#3b82f6" />
            {/* Max height marker */}
            <line x1={40 + (range / 2) * scale} y1={svgH - 30 - maxHeight * scale} x2={40 + (range / 2) * scale} y2={svgH - 30} stroke="#f59e0b" strokeWidth="1" strokeDasharray="4,4" />
            <text x={40 + (range / 2) * scale + 5} y={svgH - 30 - maxHeight * scale / 2} fontSize="10" fill="#f59e0b">H = {maxHeight.toFixed(1)} m</text>
            {/* Range marker */}
            <line x1="40" y1={svgH - 22} x2={40 + range * scale} y2={svgH - 22} stroke="#10b981" strokeWidth="1.5" markerEnd="url(#arrowG)" />
            <defs><marker id="arrowG" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L10 5L0 10z" fill="#10b981" /></marker></defs>
            <text x={40 + (range * scale) / 2} y={svgH - 8} textAnchor="middle" fontSize="10" fill="#10b981">R = {range.toFixed(1)} m</text>
            {/* Velocity components at launch */}
            <line x1="40" y1={svgH - 30} x2={40 + vx * 2} y2={svgH - 30} stroke="#ef4444" strokeWidth="1.5" />
            <text x={40 + vx * 2 + 3} y={svgH - 32} fontSize="9" fill="#ef4444">vₓ</text>
            <line x1="40" y1={svgH - 30} x2="40" y2={svgH - 30 - vy * 2} stroke="#8b5cf6" strokeWidth="1.5" />
            <text x="28" y={svgH - 30 - vy * 2} fontSize="9" fill="#8b5cf6">vᵧ</text>
          </svg>

          <Separator />
          <div className="grid gap-3 sm:grid-cols-4">
            <div className="rounded-lg bg-muted/50 border p-3 text-center">
              <p className="text-xs text-muted-foreground">Range</p>
              <p className="font-mono text-lg font-bold text-emerald-500">{range.toFixed(1)} m</p>
            </div>
            <div className="rounded-lg bg-muted/50 border p-3 text-center">
              <p className="text-xs text-muted-foreground">Max Height</p>
              <p className="font-mono text-lg font-bold text-amber-500">{maxHeight.toFixed(1)} m</p>
            </div>
            <div className="rounded-lg bg-muted/50 border p-3 text-center">
              <p className="text-xs text-muted-foreground">Flight Time</p>
              <p className="font-mono text-lg font-bold">{totalTime.toFixed(2)} s</p>
            </div>
            <div className="rounded-lg bg-muted/50 border p-3 text-center">
              <p className="text-xs text-muted-foreground">vₓ / vᵧ</p>
              <p className="font-mono text-lg font-bold">{vx.toFixed(1)} / {vy.toFixed(1)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Accordion>
        <AccordionItem value="faq-1">
          <AccordionTrigger>What angle gives maximum range?</AccordionTrigger>
          <AccordionContent className="text-sm text-muted-foreground">45° gives maximum range on level ground (since sin(2×45°) = sin(90°) = 1). Complementary angles (e.g., 30° and 60°) give the same range but different max heights.</AccordionContent>
        </AccordionItem>
        <AccordionItem value="faq-2">
          <AccordionTrigger>Does mass affect projectile motion?</AccordionTrigger>
          <AccordionContent className="text-sm text-muted-foreground">No (ignoring air resistance). All objects fall at the same rate under gravity. A heavier ball and lighter ball launched at the same speed and angle land at the same spot.</AccordionContent>
        </AccordionItem>
        <AccordionItem value="faq-3">
          <AccordionTrigger>What&apos;s the acceleration at the top of the trajectory?</AccordionTrigger>
          <AccordionContent className="text-sm text-muted-foreground">Still g = 9.8 m/s² downward! The velocity at the top is purely horizontal (vᵧ = 0), but gravity still acts. A common mistake is thinking a = 0 at the peak.</AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
