"use client";

import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function EnergySHM({
  onComplete,
  isComplete,
}: {
  onComplete: () => void;
  isComplete: boolean;
}) {
  const [amplitude, setAmplitude] = useState(1);
  const [springK, setSpringK] = useState(50);
  const [phase, setPhase] = useState(0);

  const omega = Math.sqrt(springK / 2);
  const x = amplitude * Math.cos(phase);
  const v = -amplitude * omega * Math.sin(phase);

  const totalEnergy = 0.5 * springK * amplitude * amplitude;
  const pe = 0.5 * springK * x * x;
  const ke = totalEnergy - pe;

  const barWidth = 80;
  const maxBarH = 150;
  const svgWidth = 400;
  const svgHeight = 220;
  const barBaseY = 190;

  const peBarH = totalEnergy > 0 ? (pe / totalEnergy) * maxBarH : 0;
  const keBarH = totalEnergy > 0 ? (ke / totalEnergy) * maxBarH : 0;
  const totalBarH = maxBarH;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl">Energy in SHM</CardTitle>
            {isComplete && <Badge variant="secondary">Completed</Badge>}
          </div>
          <CardDescription>
            In simple harmonic motion, energy oscillates between kinetic and
            potential forms while the total mechanical energy remains constant.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Key Formula */}
          <Card className="bg-cyan-50 border-cyan-200">
            <CardContent className="pt-4">
              <p className="text-lg font-semibold text-cyan-900">Key Formulas</p>
              <p className="text-xl font-mono text-cyan-800 mt-1">
                E = &frac12;kA&sup2; = &frac12;kx&sup2; + &frac12;mv&sup2;
              </p>
              <p className="text-sm text-cyan-700 mt-1">
                PE = &frac12;kx&sup2;, KE = &frac12;mv&sup2;
              </p>
              <p className="text-sm text-cyan-700 mt-1">
                Total energy E is constant (no friction).
              </p>
            </CardContent>
          </Card>

          <Separator />

          {/* Energy Bar Chart SVG */}
          <div>
            <h3 className="font-semibold mb-3">Energy Bar Chart</h3>
            <svg
              width={svgWidth}
              height={svgHeight}
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              className="border rounded bg-white w-full"
            >
              {/* Axis */}
              <line x1={30} y1={barBaseY} x2={svgWidth - 20} y2={barBaseY} stroke="#888" strokeWidth={1} />
              <text x={svgWidth / 2} y={15} textAnchor="middle" fontSize={13} fill="#444" fontWeight="bold">
                Position: x = {x.toFixed(2)} m
              </text>

              {/* PE bar */}
              <rect
                x={70}
                y={barBaseY - peBarH}
                width={barWidth}
                height={peBarH}
                fill="#f59e0b"
                rx={3}
              />
              <text x={70 + barWidth / 2} y={barBaseY + 16} textAnchor="middle" fontSize={12} fill="#444" fontWeight="bold">
                PE
              </text>
              <text x={70 + barWidth / 2} y={barBaseY - peBarH - 6} textAnchor="middle" fontSize={11} fill="#d97706">
                {pe.toFixed(1)} J
              </text>

              {/* KE bar */}
              <rect
                x={170}
                y={barBaseY - keBarH}
                width={barWidth}
                height={keBarH}
                fill="#06b6d4"
                rx={3}
              />
              <text x={170 + barWidth / 2} y={barBaseY + 16} textAnchor="middle" fontSize={12} fill="#444" fontWeight="bold">
                KE
              </text>
              <text x={170 + barWidth / 2} y={barBaseY - keBarH - 6} textAnchor="middle" fontSize={11} fill="#0e7490">
                {ke.toFixed(1)} J
              </text>

              {/* Total bar */}
              <rect
                x={270}
                y={barBaseY - totalBarH}
                width={barWidth}
                height={totalBarH}
                fill="#16a34a"
                rx={3}
              />
              <text x={270 + barWidth / 2} y={barBaseY + 16} textAnchor="middle" fontSize={12} fill="#444" fontWeight="bold">
                Total
              </text>
              <text x={270 + barWidth / 2} y={barBaseY - totalBarH - 6} textAnchor="middle" fontSize={11} fill="#16a34a">
                {totalEnergy.toFixed(1)} J
              </text>
            </svg>
          </div>

          {/* Sliders */}
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">
                Amplitude: {amplitude.toFixed(2)} m
              </label>
              <Slider
                value={[amplitude]}
                onValueChange={(v) => setAmplitude(v[0])}
                min={0.1}
                max={2}
                step={0.05}
              />
            </div>
            <div>
              <label className="text-sm font-medium">
                Spring Constant (k): {springK} N/m
              </label>
              <Slider
                value={[springK]}
                onValueChange={(v) => setSpringK(v[0])}
                min={10}
                max={200}
                step={5}
              />
            </div>
            <div>
              <label className="text-sm font-medium">
                Phase (oscillation position): {((phase / (2 * Math.PI)) * 100).toFixed(0)}% through cycle
              </label>
              <Slider
                value={[phase]}
                onValueChange={(v) => setPhase(v[0])}
                min={0}
                max={2 * Math.PI}
                step={0.05}
              />
            </div>
          </div>

          <Separator />

          {/* FAQ */}
          <Accordion>
            <AccordionItem value="q1">
              <AccordionTrigger>
                Where is KE maximum?
              </AccordionTrigger>
              <AccordionContent>
                Kinetic energy is maximum at the equilibrium position (x = 0),
                where all energy is kinetic and the object moves fastest.
                At the extremes (x = &plusmn;A), KE = 0.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q2">
              <AccordionTrigger>
                Where is PE maximum?
              </AccordionTrigger>
              <AccordionContent>
                Potential energy is maximum at the turning points (x = &plusmn;A),
                where the object momentarily stops. At equilibrium, PE = 0
                and all energy is kinetic.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q3">
              <AccordionTrigger>
                What happens if you double the amplitude?
              </AccordionTrigger>
              <AccordionContent>
                Since E = &frac12;kA&sup2;, doubling the amplitude quadruples the
                total energy. Energy scales with the square of amplitude.
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <Separator />

          <Button onClick={onComplete} disabled={isComplete} className="w-full">
            {isComplete ? "Completed" : "Mark Complete"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
