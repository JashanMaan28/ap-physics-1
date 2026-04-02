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

export function MomentumImpulse({ onComplete, isComplete }: TopicProps) {
  const [mass, setMass] = useState(5);
  const [velocity, setVelocity] = useState(10);

  const momentum = mass * velocity;
  const maxMomentum = 20 * 30;
  const arrowLength = Math.max(20, (Math.abs(momentum) / maxMomentum) * 280);

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Momentum & Impulse</CardTitle>
              <CardDescription>Understanding linear momentum: p = mv</CardDescription>
            </div>
            <Badge variant={isComplete ? "default" : "secondary"}>
              {isComplete ? "Completed" : "In Progress"}
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Core Concept */}
      <Card>
        <CardHeader>
          <CardTitle>Core Concept</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            <strong>Linear momentum</strong> is the product of an object&apos;s mass and velocity.
            It is a vector quantity, meaning it has both magnitude and direction.
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Momentum is directly proportional to both mass and velocity.</li>
            <li>A heavier object at the same speed has more momentum.</li>
            <li>A faster object with the same mass has more momentum.</li>
            <li>SI unit: kg&middot;m/s</li>
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
          <div className="text-center text-3xl font-mono font-bold py-4">
            p = mv
          </div>
          <div className="text-center text-sm text-muted-foreground space-y-1">
            <p><strong>p</strong> = momentum (kg&middot;m/s)</p>
            <p><strong>m</strong> = mass (kg)</p>
            <p><strong>v</strong> = velocity (m/s)</p>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="simulation">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="simulation">Interactive Simulation</TabsTrigger>
          <TabsTrigger value="examples">Worked Example</TabsTrigger>
        </TabsList>

        {/* Simulation Tab */}
        <TabsContent value="simulation">
          <Card>
            <CardHeader>
              <CardTitle>Momentum Visualization</CardTitle>
              <CardDescription>Adjust mass and velocity to see how momentum changes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Sliders */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Mass: {mass} kg</Label>
                  <Slider
                    value={[mass]}
                    onValueChange={([v]) => setMass(v)}
                    min={1}
                    max={20}
                    step={0.5}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Velocity: {velocity} m/s</Label>
                  <Slider
                    value={[velocity]}
                    onValueChange={([v]) => setVelocity(v)}
                    min={-30}
                    max={30}
                    step={1}
                  />
                </div>
              </div>

              {/* SVG Momentum Arrow */}
              <div className="flex justify-center">
                <svg width="400" height="140" viewBox="0 0 400 140">
                  {/* Object (circle representing mass) */}
                  <circle
                    cx="60"
                    cy="70"
                    r={12 + mass * 1.2}
                    fill="#8b5cf6"
                    opacity={0.8}
                  />
                  <text x="60" y="75" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold">
                    {mass}kg
                  </text>

                  {/* Momentum arrow */}
                  {velocity !== 0 && (
                    <g>
                      <line
                        x1={velocity > 0 ? 90 : 30}
                        y1="70"
                        x2={velocity > 0 ? 90 + arrowLength : 30 - arrowLength}
                        y2="70"
                        stroke="#22c55e"
                        strokeWidth="4"
                        markerEnd="url(#arrowhead)"
                      />
                      <defs>
                        <marker
                          id="arrowhead"
                          markerWidth="10"
                          markerHeight="7"
                          refX="10"
                          refY="3.5"
                          orient="auto"
                        >
                          <polygon points="0 0, 10 3.5, 0 7" fill="#22c55e" />
                        </marker>
                      </defs>
                      <text
                        x={velocity > 0 ? 90 + arrowLength / 2 : 30 - arrowLength / 2}
                        y="55"
                        textAnchor="middle"
                        fill="#22c55e"
                        fontSize="13"
                        fontWeight="bold"
                      >
                        p = {momentum.toFixed(1)} kg&middot;m/s
                      </text>
                    </g>
                  )}

                  {velocity === 0 && (
                    <text x="200" y="75" textAnchor="middle" fill="#888" fontSize="13">
                      p = 0 (object at rest)
                    </text>
                  )}

                  {/* Ground line */}
                  <line x1="0" y1="120" x2="400" y2="120" stroke="#555" strokeWidth="1" strokeDasharray="4" />
                </svg>
              </div>

              {/* Readout */}
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-3 rounded bg-muted">
                  <div className="text-sm text-muted-foreground">Mass</div>
                  <div className="text-lg font-bold">{mass} kg</div>
                </div>
                <div className="p-3 rounded bg-muted">
                  <div className="text-sm text-muted-foreground">Velocity</div>
                  <div className="text-lg font-bold">{velocity} m/s</div>
                </div>
                <div className="p-3 rounded bg-purple-500/10 border border-purple-500/30">
                  <div className="text-sm text-muted-foreground">Momentum</div>
                  <div className="text-lg font-bold text-purple-500">{momentum.toFixed(1)} kg&middot;m/s</div>
                </div>
              </div>

              <Progress value={Math.abs(momentum) / maxMomentum * 100} className="h-2" />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Worked Example Tab */}
        <TabsContent value="examples">
          <Card>
            <CardHeader>
              <CardTitle>Worked Example</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="font-medium">
                A 1200 kg car travels east at 25 m/s. What is its momentum?
              </p>
              <Separator />
              <div className="space-y-2">
                <p><strong>Given:</strong> m = 1200 kg, v = 25 m/s east</p>
                <p><strong>Find:</strong> p = ?</p>
                <p><strong>Solution:</strong></p>
                <div className="bg-muted p-4 rounded font-mono text-sm">
                  p = mv<br />
                  p = (1200 kg)(25 m/s)<br />
                  p = 30,000 kg&middot;m/s east
                </div>
                <p className="text-sm text-muted-foreground">
                  Note: The direction (east) is included because momentum is a vector.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* FAQ */}
      <Card>
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion className="w-full">
            <AccordionItem value="q1">
              <AccordionTrigger>Is momentum a scalar or vector quantity?</AccordionTrigger>
              <AccordionContent>
                Momentum is a <strong>vector quantity</strong>. It has both magnitude (how much)
                and direction (which way the object is moving). The direction of momentum is always
                the same as the direction of velocity.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q2">
              <AccordionTrigger>Can momentum be negative?</AccordionTrigger>
              <AccordionContent>
                Yes! Since momentum is a vector, its sign indicates direction. In a 1D problem,
                negative momentum means the object moves in the negative direction. The magnitude
                of momentum is always positive.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q3">
              <AccordionTrigger>What&apos;s the difference between momentum and kinetic energy?</AccordionTrigger>
              <AccordionContent>
                Both depend on mass and velocity, but momentum (p = mv) is a vector and is linearly
                proportional to velocity, while kinetic energy (KE = &frac12;mv&sup2;) is a scalar
                and depends on the square of velocity. Momentum is conserved in all collisions;
                kinetic energy is only conserved in elastic collisions.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q4">
              <AccordionTrigger>Why is momentum important on the AP exam?</AccordionTrigger>
              <AccordionContent>
                Linear Momentum accounts for 10&ndash;15% of the AP Physics 1 exam. You&apos;ll see
                questions on impulse, conservation of momentum in collisions, and comparing elastic
                vs. inelastic collisions. FRQs often ask you to derive or justify using conservation laws.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>

      {/* Mark Complete */}
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

export default MomentumImpulse;
