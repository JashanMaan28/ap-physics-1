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

export function Acceleration({ onComplete, isComplete }: TopicProps) {
  const [v0, setV0] = useState(2);
  const [accel, setAccel] = useState(3);
  const [time, setTime] = useState(4);

  const vFinal = v0 + accel * time;
  const deltaV = vFinal - v0;

  const barMax = 30;
  const v0Pct = Math.abs(v0) / barMax * 100;
  const vfPct = Math.abs(vFinal) / barMax * 100;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Acceleration</CardTitle>
              <CardDescription className="mt-1 text-base">The rate of change of velocity over time</CardDescription>
            </div>
            <Button variant={isComplete ? "default" : "outline"} size="sm" onClick={onComplete} className="cursor-pointer">
              {isComplete ? "Completed" : "Mark Complete"}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-primary">Key Formulas</h3>
            <div className="text-xl font-bold"><Tex display>{toLatex("a = Δv / Δt = (v - v₀) / t")}</Tex></div>
            <div className="text-lg mt-1"><Tex display>{toLatex("v = v₀ + at")}</Tex></div>
            <div className="mt-3 grid grid-cols-2 gap-2 text-sm text-muted-foreground sm:grid-cols-4">
              <span><Tex>a</Tex> = Acceleration (m/s²)</span>
              <span><Tex>{toLatex("v₀")}</Tex> = Initial velocity</span>
              <span><Tex>v</Tex> = Final velocity</span>
              <span><Tex>t</Tex> = Time</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Interactive Simulation</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="text-xs text-muted-foreground">Initial Velocity v₀ = {v0} m/s</label>
              <Slider value={v0} onValueChange={setV0} min={-10} max={10} step={0.5} />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Acceleration a = {accel} m/s²</label>
              <Slider value={accel} onValueChange={setAccel} min={-5} max={5} step={0.5} />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Time t = {time} s</label>
              <Slider value={time} onValueChange={setTime} min={0} max={10} step={0.5} />
            </div>
          </div>

          <svg viewBox="0 0 400 160" className="w-full rounded-lg border bg-muted/30">
            <text x="200" y="20" textAnchor="middle" fontSize="12" fill="currentColor" fontWeight="bold">Velocity Comparison</text>
            {/* v0 bar */}
            <rect x="60" y="40" width={Math.max(v0Pct * 2.5, 2)} height="30" rx="4" fill={v0 >= 0 ? "#94a3b8" : "#f87171"} />
            <text x="50" y="60" textAnchor="end" fontSize="11" fill="currentColor">v₀</text>
            <text x={65 + v0Pct * 2.5} y="60" fontSize="11" fill="currentColor">{v0.toFixed(1)} m/s</text>
            {/* vf bar */}
            <rect x="60" y="90" width={Math.max(vfPct * 2.5, 2)} height="30" rx="4" fill={vFinal >= 0 ? "#3b82f6" : "#f87171"} />
            <text x="50" y="110" textAnchor="end" fontSize="11" fill="currentColor">v</text>
            <text x={65 + vfPct * 2.5} y="110" fontSize="11" fill="currentColor">{vFinal.toFixed(1)} m/s</text>
            {/* Arrow showing change */}
            <text x="200" y="148" textAnchor="middle" fontSize="10" fill="currentColor" opacity="0.6">Δv = {deltaV.toFixed(1)} m/s ({accel >= 0 ? "speeding up" : "slowing down"})</text>
          </svg>

          <Separator />
          <div className="grid gap-3 sm:grid-cols-4">
            <div className="rounded-lg bg-muted/50 border p-3 text-center">
              <p className="text-xs text-muted-foreground">Initial Velocity</p>
              <p className="font-mono text-lg font-bold">{v0.toFixed(1)} m/s</p>
            </div>
            <div className="rounded-lg bg-muted/50 border p-3 text-center">
              <p className="text-xs text-muted-foreground">Final Velocity</p>
              <p className="font-mono text-lg font-bold text-primary">{vFinal.toFixed(1)} m/s</p>
            </div>
            <div className="rounded-lg bg-muted/50 border p-3 text-center">
              <p className="text-xs text-muted-foreground">Change in Velocity</p>
              <p className="font-mono text-lg font-bold">{deltaV.toFixed(1)} m/s</p>
            </div>
            <div className="rounded-lg bg-muted/50 border p-3 text-center">
              <p className="text-xs text-muted-foreground">Acceleration</p>
              <p className="font-mono text-lg font-bold">{accel.toFixed(1)} m/s²</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Key Concepts</CardTitle></CardHeader>
        <CardContent>
          <div className="grid gap-2 text-sm leading-relaxed text-muted-foreground sm:grid-cols-2">
            <p><strong>Acceleration</strong> is the rate of change of velocity. It&apos;s a vector — it has magnitude and direction.</p>
            <p><strong>Constant acceleration</strong> means velocity changes by the same amount each second. This is the basis of all kinematic equations.</p>
            <p><strong>Deceleration</strong> is acceleration opposing the direction of motion. If <Tex>{"v > 0"}</Tex> and <Tex>{"a < 0"}</Tex>, the object slows down.</p>
            <p><strong>Free fall</strong> near Earth&apos;s surface has a constant acceleration of <Tex>{toLatex("g ≈ 9.8 m/s²")}</Tex> downward, regardless of mass.</p>
          </div>
        </CardContent>
      </Card>

      <Accordion>
        <AccordionItem value="faq-1">
          <AccordionTrigger>Can an object have zero velocity but nonzero acceleration?</AccordionTrigger>
          <AccordionContent className="text-sm text-muted-foreground">Yes! A ball thrown upward has <Tex>{"v = 0"}</Tex> at its highest point, but <Tex>{toLatex("a = -9.8 m/s²")}</Tex> (gravity still acts). Zero velocity is an instant; acceleration is continuous.</AccordionContent>
        </AccordionItem>
        <AccordionItem value="faq-2">
          <AccordionTrigger>Does negative acceleration always mean slowing down?</AccordionTrigger>
          <AccordionContent className="text-sm text-muted-foreground">No. If velocity is negative (moving left) and acceleration is also negative, the object speeds up (in the negative direction). &quot;Slowing down&quot; means <Tex>a</Tex> and <Tex>v</Tex> have opposite signs.</AccordionContent>
        </AccordionItem>
        <AccordionItem value="faq-3">
          <AccordionTrigger>What are the units of acceleration?</AccordionTrigger>
          <AccordionContent className="text-sm text-muted-foreground">m/s² (meters per second squared). This means velocity changes by that many m/s every second. For example, a = 3 m/s² means the object gains 3 m/s of velocity each second.</AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
