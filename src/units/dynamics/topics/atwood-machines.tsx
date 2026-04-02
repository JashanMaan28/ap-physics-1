"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
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

export function AtwoodMachines({
  onComplete,
  isComplete,
}: {
  onComplete: () => void;
  isComplete: boolean;
}) {
  const [m1, setM1] = useState(8);
  const [m2, setM2] = useState(5);

  const g = 9.8;
  const heavier = Math.max(m1, m2);
  const lighter = Math.min(m1, m2);
  const acceleration = ((heavier - lighter) * g) / (m1 + m2);
  const tension = (2 * m1 * m2 * g) / (m1 + m2);

  const m1Side = m1 >= m2 ? "heavier" : "lighter";
  const m1Y = m1 >= m2 ? 120 : 80;
  const m2Y = m1 >= m2 ? 80 : 120;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl">Atwood Machines</CardTitle>
            {isComplete && <Badge variant="secondary">Completed</Badge>}
          </div>
          <CardDescription>
            Two masses connected by a string over a frictionless, massless pulley. A classic system
            for studying Newton&apos;s second law.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Theory */}
          <div className="space-y-2">
            <p className="text-muted-foreground">
              In an Atwood machine, both masses share the same magnitude of acceleration and the
              same tension throughout the rope. The heavier mass accelerates downward and the lighter
              mass accelerates upward.
            </p>
          </div>

          {/* Controls */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                m₁ (left): {m1} kg {m1Side === "heavier" ? "(heavier)" : "(lighter)"}
              </label>
              <Slider value={[m1]} onValueChange={(v) => setM1(v[0])} min={1} max={20} step={0.5} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">
                m₂ (right): {m2} kg {m1Side === "heavier" ? "(lighter)" : "(heavier)"}
              </label>
              <Slider value={[m2]} onValueChange={(v) => setM2(v[0])} min={1} max={20} step={0.5} />
            </div>
          </div>

          {/* SVG Diagram */}
          <div className="rounded-lg border bg-white p-2">
            <svg viewBox="0 0 300 240" className="w-full max-w-sm mx-auto">
              {/* Support bar */}
              <rect x="100" y="10" width="100" height="8" fill="#64748b" rx="2" />
              <line x1="150" y1="18" x2="150" y2="10" stroke="#64748b" strokeWidth="2" />

              {/* Pulley */}
              <circle cx="150" cy="35" r="15" fill="none" stroke="#334155" strokeWidth="3" />
              <circle cx="150" cy="35" r="3" fill="#334155" />

              {/* Left rope */}
              <line x1="135" y1="35" x2="80" y2="35" stroke="#78716c" strokeWidth="0" />
              <line x1="135" y1="35" x2="80" y2={m1Y} stroke="#78716c" strokeWidth="2" />

              {/* Right rope */}
              <line x1="165" y1="35" x2="220" y2="35" stroke="#78716c" strokeWidth="0" />
              <line x1="165" y1="35" x2="220" y2={m2Y} stroke="#78716c" strokeWidth="2" />

              {/* Left mass */}
              <rect x="55" y={m1Y} width="50" height="40" fill="#3b82f6" rx="5" />
              <text x="80" y={m1Y + 20} textAnchor="middle" fill="white" fontSize="11" fontWeight="bold">
                m₁
              </text>
              <text x="80" y={m1Y + 33} textAnchor="middle" fill="white" fontSize="10">
                {m1}kg
              </text>

              {/* Right mass */}
              <rect x="195" y={m2Y} width="50" height="40" fill="#ef4444" rx="5" />
              <text x="220" y={m2Y + 20} textAnchor="middle" fill="white" fontSize="11" fontWeight="bold">
                m₂
              </text>
              <text x="220" y={m2Y + 33} textAnchor="middle" fill="white" fontSize="10">
                {m2}kg
              </text>

              {/* Acceleration arrows */}
              {m1 !== m2 && (
                <>
                  {/* Left mass arrow */}
                  <line
                    x1="55"
                    y1={m1Y + 20}
                    x2="55"
                    y2={m1 >= m2 ? m1Y + 50 : m1Y - 10}
                    stroke="#22c55e"
                    strokeWidth="2"
                    markerEnd="url(#arrowAcc)"
                  />
                  <text x="42" y={m1 >= m2 ? m1Y + 55 : m1Y - 12} fontSize="9" fill="#22c55e" fontWeight="bold">a</text>

                  {/* Right mass arrow */}
                  <line
                    x1="245"
                    y1={m2Y + 20}
                    x2="245"
                    y2={m2 >= m1 ? m2Y + 50 : m2Y - 10}
                    stroke="#22c55e"
                    strokeWidth="2"
                    markerEnd="url(#arrowAcc)"
                  />
                  <text x="248" y={m2 >= m1 ? m2Y + 55 : m2Y - 12} fontSize="9" fill="#22c55e" fontWeight="bold">a</text>
                </>
              )}

              <defs>
                <marker id="arrowAcc" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
                  <path d="M0,0 L8,3 L0,6 Z" fill="#22c55e" />
                </marker>
              </defs>
            </svg>
          </div>

          {/* Results */}
          <div className="grid gap-3 sm:grid-cols-2">
            <Card className="bg-green-50 border-green-200">
              <CardContent className="pt-4 text-center">
                <p className="text-xs text-muted-foreground">Acceleration</p>
                <p className="text-sm text-green-800 mt-1">
                  a = (m₁ - m₂)g / (m₁ + m₂)
                </p>
                <p className="text-2xl font-bold text-green-900">{acceleration.toFixed(2)} m/s²</p>
              </CardContent>
            </Card>
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="pt-4 text-center">
                <p className="text-xs text-muted-foreground">Tension</p>
                <p className="text-sm text-blue-800 mt-1">
                  T = 2m₁m₂g / (m₁ + m₂)
                </p>
                <p className="text-2xl font-bold text-blue-900">{tension.toFixed(2)} N</p>
              </CardContent>
            </Card>
          </div>

          {m1 === m2 && (
            <Card className="bg-yellow-50 border-yellow-200">
              <CardContent className="pt-3 text-center">
                <p className="font-semibold text-yellow-900">
                  Equal masses: the system is in equilibrium (a = 0), and T = mg = {(m1 * g).toFixed(1)} N.
                </p>
              </CardContent>
            </Card>
          )}

          <Separator />

          {/* Key Formula */}
          <Card className="bg-amber-50 border-amber-200">
            <CardHeader>
              <CardTitle className="text-lg text-amber-900">Key Formulas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              <p className="text-center text-lg font-bold text-amber-900">a = (m₁ - m₂)g / (m₁ + m₂)</p>
              <p className="text-center text-lg font-bold text-amber-900">T = 2m₁m₂g / (m₁ + m₂)</p>
              <p className="text-center text-sm text-amber-700 mt-1">Massless rope, frictionless pulley</p>
            </CardContent>
          </Card>

          <Separator />

          {/* FAQ */}
          <Accordion className="w-full">
            <AccordionItem value="q1">
              <AccordionTrigger>Why is the tension the same on both sides?</AccordionTrigger>
              <AccordionContent>
                With a massless rope and frictionless pulley, there is no net force needed to
                accelerate the rope itself, so the tension must be equal throughout. If the rope
                had mass, tension would differ on each side.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q2">
              <AccordionTrigger>What if one mass sits on a table (modified Atwood)?</AccordionTrigger>
              <AccordionContent>
                In a modified Atwood machine, one mass hangs off the edge while the other slides on
                a table. The hanging mass provides the driving force: a = m_hang * g / (m_hang + m_table)
                without friction. Add friction as mu_k * m_table * g in the denominator treatment.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q3">
              <AccordionTrigger>Is the acceleration always less than g?</AccordionTrigger>
              <AccordionContent>
                Yes. The maximum acceleration occurs when one mass approaches zero, giving a approaching g.
                With two equal masses, a = 0. The Atwood machine effectively reduces gravitational acceleration.
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <Separator />

          <Button onClick={onComplete} disabled={isComplete} className="w-full" size="lg">
            {isComplete ? "Topic Completed" : "Mark as Complete"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
