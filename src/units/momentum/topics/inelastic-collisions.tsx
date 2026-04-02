"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";

interface TopicProps {
  onComplete: () => void;
  isComplete: boolean;
}

export function InelasticCollisions({ onComplete, isComplete }: TopicProps) {
  const [m1, setM1] = useState(4);
  const [v1i, setV1i] = useState(10);
  const [m2, setM2] = useState(6);
  const [v2i, setV2i] = useState(0);

  // Perfectly inelastic: objects stick together
  const vf = (m1 * v1i + m2 * v2i) / (m1 + m2);
  const keBefore = 0.5 * m1 * v1i * v1i + 0.5 * m2 * v2i * v2i;
  const keAfter = 0.5 * (m1 + m2) * vf * vf;
  const keLost = keBefore - keAfter;
  const keLostPercent = keBefore > 0 ? (keLost / keBefore) * 100 : 0;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Inelastic Collisions</CardTitle>
              <CardDescription>Momentum conserved, kinetic energy is NOT conserved</CardDescription>
            </div>
            <Badge variant={isComplete ? "default" : "secondary"}>
              {isComplete ? "Completed" : "In Progress"}
            </Badge>
          </div>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Core Concept</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            In an <strong>inelastic collision</strong>, momentum is conserved but kinetic energy is not.
            Some KE is converted to heat, sound, or deformation.
          </p>
          <p>
            In a <strong>perfectly inelastic collision</strong>, the objects stick together after the
            collision and move with the same final velocity. This is the maximum possible KE loss
            for a given momentum change.
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Most real-world collisions are inelastic (car crashes, catching a ball, etc.).</li>
            <li>Objects stick together &rarr; perfectly inelastic.</li>
            <li>Total momentum is still conserved even when KE is lost.</li>
          </ul>
        </CardContent>
      </Card>

      {/* Key Formula */}
      <Card className="border-2 border-purple-500/30 bg-purple-500/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>Key Formula</span>
            <Badge variant="outline" className="text-purple-600 border-purple-400">Must Know</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-2xl font-mono font-bold py-4">
            m<sub>1</sub>v<sub>1i</sub> + m<sub>2</sub>v<sub>2i</sub> = (m<sub>1</sub> + m<sub>2</sub>)v<sub>f</sub>
          </div>
          <div className="text-center text-sm text-muted-foreground space-y-1">
            <p>Objects stick together &rarr; single final velocity v<sub>f</sub></p>
            <p>KE<sub>lost</sub> = KE<sub>before</sub> &minus; KE<sub>after</sub> &gt; 0</p>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="simulation">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="simulation">Stick-Together Sim</TabsTrigger>
          <TabsTrigger value="examples">Worked Example</TabsTrigger>
        </TabsList>

        <TabsContent value="simulation">
          <Card>
            <CardHeader>
              <CardTitle>Perfectly Inelastic Collision</CardTitle>
              <CardDescription>Objects stick together &mdash; see how much KE is lost</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-semibold text-blue-500">Object 1</h4>
                  <div className="space-y-2">
                    <Label>Mass: {m1} kg</Label>
                    <Slider value={[m1]} onValueChange={([v]) => setM1(v)} min={1} max={10} step={0.5} />
                  </div>
                  <div className="space-y-2">
                    <Label>Initial v: {v1i} m/s</Label>
                    <Slider value={[v1i]} onValueChange={([v]) => setV1i(v)} min={-15} max={15} step={1} />
                  </div>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold text-red-500">Object 2</h4>
                  <div className="space-y-2">
                    <Label>Mass: {m2} kg</Label>
                    <Slider value={[m2]} onValueChange={([v]) => setM2(v)} min={1} max={10} step={0.5} />
                  </div>
                  <div className="space-y-2">
                    <Label>Initial v: {v2i} m/s</Label>
                    <Slider value={[v2i]} onValueChange={([v]) => setV2i(v)} min={-15} max={15} step={1} />
                  </div>
                </div>
              </div>

              {/* SVG Before/After */}
              <div className="flex justify-center">
                <svg width="400" height="170" viewBox="0 0 400 170">
                  <text x="200" y="18" textAnchor="middle" fill="#888" fontSize="13" fontWeight="bold">BEFORE</text>

                  {/* Before objects */}
                  <rect x={80} y={35} width={25 + m1 * 2} height={30} rx="4" fill="#3b82f6" opacity={0.85} />
                  <text x={92 + m1} y={55} textAnchor="middle" fill="white" fontSize="10">{m1}kg</text>

                  <rect x={250} y={35} width={25 + m2 * 2} height={30} rx="4" fill="#ef4444" opacity={0.85} />
                  <text x={262 + m2} y={55} textAnchor="middle" fill="white" fontSize="10">{m2}kg</text>

                  <line x1="20" y1="85" x2="380" y2="85" stroke="#555" strokeWidth="1" strokeDasharray="4" />

                  <text x="200" y="103" textAnchor="middle" fill="#888" fontSize="13" fontWeight="bold">AFTER (stuck together)</text>

                  {/* Combined object */}
                  <rect x={140} y={115} width={30 + (m1 + m2) * 2} height={35} rx="4" fill="#8b5cf6" opacity={0.85} />
                  <text x={155 + (m1 + m2)} y={137} textAnchor="middle" fill="white" fontSize="10">
                    {(m1 + m2).toFixed(1)}kg
                  </text>

                  {/* Velocity arrow after */}
                  {Math.abs(vf) > 0.1 && (
                    <>
                      <line
                        x1={170 + (m1 + m2) * 2}
                        y1="132"
                        x2={170 + (m1 + m2) * 2 + vf * 3}
                        y2="132"
                        stroke="#22c55e"
                        strokeWidth="3"
                        markerEnd="url(#arrowGreen)"
                      />
                      <defs>
                        <marker id="arrowGreen" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
                          <polygon points="0 0, 8 3, 0 6" fill="#22c55e" />
                        </marker>
                      </defs>
                    </>
                  )}
                </svg>
              </div>

              {/* Results */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded bg-muted text-center">
                  <div className="text-sm text-muted-foreground">Final Velocity</div>
                  <div className="text-lg font-bold">{vf.toFixed(2)} m/s</div>
                </div>
                <div className="p-3 rounded bg-red-500/10 border border-red-500/30 text-center">
                  <div className="text-sm text-muted-foreground">KE Lost</div>
                  <div className="text-lg font-bold text-red-500">{keLost.toFixed(1)} J ({keLostPercent.toFixed(1)}%)</div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>KE Before: {keBefore.toFixed(1)} J</span>
                  <span>KE After: {keAfter.toFixed(1)} J</span>
                </div>
                <div className="relative">
                  <Progress value={keBefore > 0 ? (keAfter / keBefore) * 100 : 0} className="h-3" />
                </div>
                <p className="text-sm text-muted-foreground text-center">
                  {keLostPercent.toFixed(1)}% of kinetic energy converted to heat, sound, and deformation
                </p>
              </div>

              <Badge variant="outline" className="text-green-600 border-green-400">Momentum Conserved</Badge>
              <Badge variant="outline" className="text-red-600 border-red-400 ml-2">KE NOT Conserved</Badge>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="examples">
          <Card>
            <CardHeader>
              <CardTitle>Worked Example</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="font-medium">
                A 1500 kg car moving at 20 m/s rear-ends a 1000 kg car at rest. They lock bumpers
                and slide together. Find the final velocity and the kinetic energy lost.
              </p>
              <Separator />
              <div className="space-y-2">
                <p><strong>Given:</strong> m<sub>1</sub>=1500 kg, v<sub>1i</sub>=20 m/s, m<sub>2</sub>=1000 kg, v<sub>2i</sub>=0</p>
                <div className="bg-muted p-4 rounded font-mono text-sm space-y-1">
                  <p>m<sub>1</sub>v<sub>1i</sub> + m<sub>2</sub>v<sub>2i</sub> = (m<sub>1</sub>+m<sub>2</sub>)v<sub>f</sub></p>
                  <p>(1500)(20) + (1000)(0) = (2500)v<sub>f</sub></p>
                  <p>v<sub>f</sub> = 30000/2500 = 12 m/s</p>
                  <br />
                  <p>KE<sub>i</sub> = &frac12;(1500)(20)&sup2; = 300,000 J</p>
                  <p>KE<sub>f</sub> = &frac12;(2500)(12)&sup2; = 180,000 J</p>
                  <p>KE<sub>lost</sub> = 300,000 &minus; 180,000 = 120,000 J (40%)</p>
                </div>
                <p className="text-sm text-muted-foreground">
                  40% of the kinetic energy was converted to heat, sound, and deformation of the vehicles.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion className="w-full">
            <AccordionItem value="q1">
              <AccordionTrigger>What&apos;s the difference between inelastic and perfectly inelastic?</AccordionTrigger>
              <AccordionContent>
                In any inelastic collision, some KE is lost. In a <strong>perfectly inelastic</strong>
                collision, the objects stick together, losing the maximum possible KE. Most real
                collisions are inelastic but not perfectly inelastic.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q2">
              <AccordionTrigger>Where does the lost kinetic energy go?</AccordionTrigger>
              <AccordionContent>
                The &ldquo;lost&rdquo; KE is converted into thermal energy (heat), sound, and permanent
                deformation of the objects. Energy is always conserved overall (1st law of thermodynamics),
                but KE specifically is not conserved in inelastic collisions.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q3">
              <AccordionTrigger>Can objects move in opposite directions after an inelastic collision?</AccordionTrigger>
              <AccordionContent>
                In a perfectly inelastic collision, no &mdash; they stick together and move as one.
                In a general inelastic collision (not perfectly inelastic), they can separate and
                move in different directions, but some KE will be lost.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q4">
              <AccordionTrigger>How does this apply to the AP exam?</AccordionTrigger>
              <AccordionContent>
                The AP exam frequently tests your ability to distinguish between elastic and inelastic
                collisions, calculate final velocities, and determine KE lost. FRQs often ask you to
                justify whether momentum and/or KE are conserved.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button
          onClick={onComplete}
          variant={isComplete ? "outline" : "default"}
          size="lg"
          className={isComplete ? "" : "bg-purple-600 hover:bg-purple-700"}
        >
          {isComplete ? "Completed ✓" : "Mark as Complete"}
        </Button>
      </div>
    </div>
  );
}

export default InelasticCollisions;
