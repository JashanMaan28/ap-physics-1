"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tex } from "@/components/ui/math";
import { toLatex } from "@/lib/latex";

interface TopicProps { onComplete: () => void; isComplete: boolean; }

type MotionType = "constant-v" | "constant-a" | "deceleration" | "freefall";

function generateData(type: MotionType) {
  const pts = 50;
  const data: { t: number; x: number; v: number; a: number }[] = [];
  for (let i = 0; i <= pts; i++) {
    const t = (i / pts) * 5;
    let x = 0, v = 0, a = 0;
    switch (type) {
      case "constant-v": v = 4; a = 0; x = v * t; break;
      case "constant-a": a = 2; v = a * t; x = 0.5 * a * t * t; break;
      case "deceleration": a = -3; v = 15 + a * t; x = 15 * t + 0.5 * a * t * t; break;
      case "freefall": a = -9.8; v = a * t; x = 50 + 0.5 * a * t * t; break;
    }
    data.push({ t, x, v, a });
  }
  return data;
}

function MiniGraph({ data, yKey, color, label, unit }: { data: { t: number; x: number; v: number; a: number }[]; yKey: "x" | "v" | "a"; color: string; label: string; unit: string }) {
  const w = 200, h = 100, pad = 30;
  const ys = data.map(d => d[yKey]);
  const yMin = Math.min(...ys, 0);
  const yMax = Math.max(...ys, 0.1);
  const range = yMax - yMin || 1;
  const scaleX = (w - pad * 2) / 5;
  const scaleY = (h - pad * 2) / range;

  const pathD = data.map((d, i) => {
    const sx = pad + d.t * scaleX;
    const sy = h - pad - (d[yKey] - yMin) * scaleY;
    return `${i === 0 ? "M" : "L"} ${sx} ${sy}`;
  }).join(" ");

  const zeroY = h - pad - (0 - yMin) * scaleY;

  return (
    <div>
      <p className="text-xs font-semibold mb-1" style={{ color }}>{label} ({unit})</p>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full rounded border bg-background">
        <line x1={pad} y1={zeroY} x2={w - pad} y2={zeroY} stroke="currentColor" strokeWidth="0.5" opacity="0.2" />
        <line x1={pad} y1={pad} x2={pad} y2={h - pad} stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
        <line x1={pad} y1={h - pad} x2={w - pad} y2={h - pad} stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
        <path d={pathD} fill="none" stroke={color} strokeWidth="2" />
        <text x={w / 2} y={h - 5} textAnchor="middle" fontSize="8" fill="currentColor" opacity="0.5">t (s)</text>
      </svg>
    </div>
  );
}

export function MotionGraphs({ onComplete, isComplete }: TopicProps) {
  const [motionType, setMotionType] = useState<MotionType>("constant-v");
  const data = generateData(motionType);

  const descriptions: Record<MotionType, string> = {
    "constant-v": "Object moves at constant velocity. x-t is linear, v-t is flat, a-t is zero.",
    "constant-a": "Object accelerates uniformly from rest. x-t is parabolic, v-t is linear, a-t is constant.",
    "deceleration": "Object starts fast and slows down. v-t line slopes downward, x-t curve flattens.",
    "freefall": "Object in free fall. a = −9.8 m/s², v increases downward, x is parabolic.",
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Motion Graphs</CardTitle>
              <CardDescription className="mt-1 text-base">Understanding x-t, v-t, and a-t graph relationships</CardDescription>
            </div>
            <Button variant={isComplete ? "default" : "outline"} size="sm" onClick={onComplete} className="cursor-pointer">
              {isComplete ? "Completed" : "Mark Complete"}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-primary">Key Relationships</h3>
          <div className="grid gap-2 text-sm text-muted-foreground sm:grid-cols-3">
            <div className="rounded-lg border p-3">
              <p className="font-semibold text-foreground">x-t → v-t</p>
              <p>Slope of x-t graph = velocity</p>
            </div>
            <div className="rounded-lg border p-3">
              <p className="font-semibold text-foreground">v-t → a-t</p>
              <p>Slope of v-t graph = acceleration</p>
            </div>
            <div className="rounded-lg border p-3">
              <p className="font-semibold text-foreground">v-t → Δx</p>
              <p>Area under v-t graph = displacement</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Interactive Graph Viewer</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <Tabs value={motionType} onValueChange={(v) => setMotionType(v as MotionType)}>
            <TabsList className="flex flex-wrap h-auto gap-1">
              <TabsTrigger value="constant-v" className="text-xs">Constant Velocity</TabsTrigger>
              <TabsTrigger value="constant-a" className="text-xs">Constant Accel.</TabsTrigger>
              <TabsTrigger value="deceleration" className="text-xs">Deceleration</TabsTrigger>
              <TabsTrigger value="freefall" className="text-xs">Free Fall</TabsTrigger>
            </TabsList>
          </Tabs>

          <p className="text-sm text-muted-foreground">{descriptions[motionType]}</p>

          <div className="grid gap-4 sm:grid-cols-3">
            <MiniGraph data={data} yKey="x" color="#3b82f6" label="Position" unit="m" />
            <MiniGraph data={data} yKey="v" color="#10b981" label="Velocity" unit="m/s" />
            <MiniGraph data={data} yKey="a" color="#f59e0b" label="Acceleration" unit="m/s²" />
          </div>
        </CardContent>
      </Card>

      <Accordion>
        <AccordionItem value="faq-1">
          <AccordionTrigger>What does a curved x-t graph mean?</AccordionTrigger>
          <AccordionContent className="text-sm text-muted-foreground">A curved position-time graph means the velocity is changing — the object is accelerating. A steeper curve means higher speed at that instant.</AccordionContent>
        </AccordionItem>
        <AccordionItem value="faq-2">
          <AccordionTrigger>Can the v-t graph go below the time axis?</AccordionTrigger>
          <AccordionContent className="text-sm text-muted-foreground">Yes! That means the object is moving in the negative direction. The area below the axis represents negative displacement.</AccordionContent>
        </AccordionItem>
        <AccordionItem value="faq-3">
          <AccordionTrigger>How do I find displacement from a v-t graph?</AccordionTrigger>
          <AccordionContent className="text-sm text-muted-foreground">Calculate the area between the v-t curve and the time axis. Areas above = positive displacement, areas below = negative. The net area is the total displacement.</AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
