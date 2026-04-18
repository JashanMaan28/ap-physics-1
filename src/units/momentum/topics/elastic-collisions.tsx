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
import { Tex } from "@/components/ui/math";
import { PhysicsText } from "@/components/ui/physics-text";

interface TopicProps {
  onComplete: () => void;
  isComplete: boolean;
}

export function ElasticCollisions({ onComplete, isComplete }: TopicProps) {
  const [m1, setM1] = useState(3);
  const [v1i, setV1i] = useState(10);
  const [m2, setM2] = useState(5);
  const [v2i, setV2i] = useState(0);

  // Elastic collision formulas
  const v1f = ((m1 - m2) * v1i + 2 * m2 * v2i) / (m1 + m2);
  const v2f = ((m2 - m1) * v2i + 2 * m1 * v1i) / (m1 + m2);

  const keBefore = 0.5 * m1 * v1i * v1i + 0.5 * m2 * v2i * v2i;
  const keAfter = 0.5 * m1 * v1f * v1f + 0.5 * m2 * v2f * v2f;

  const pBefore = m1 * v1i + m2 * v2i;
  const pAfter = m1 * v1f + m2 * v2f;

  const barScale = 1.5;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Elastic Collisions</CardTitle>
              <CardDescription>Both momentum and kinetic energy are conserved</CardDescription>
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
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Core Concept</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            In an <strong>elastic collision</strong>, both momentum and kinetic energy are conserved.
            The objects bounce off each other with no permanent deformation or heat generated.
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Perfectly elastic collisions are an idealization &mdash; real collisions lose some KE.</li>
            <li>Collisions between billiard balls and atomic/molecular collisions are nearly elastic.</li>
            <li>Two conservation equations let you solve for two unknowns (both final velocities).</li>
          </ul>
        </CardContent>
      </Card>

      {/* Key Formulas */}
      <Card className="border-2 border-purple-500/30 bg-purple-500/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>Key Formulas</span>
            <Badge variant="outline" className="text-purple-600 border-purple-400 dark:text-purple-400">Must Know</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center font-bold py-2 text-xl">
            <Tex display>{"m_1 v_{1i} + m_2 v_{2i} = m_1 v_{1f} + m_2 v_{2f}"}</Tex>
          </div>
          <div className="text-center font-bold py-2 text-xl">
            <Tex display>{"\\tfrac{1}{2}m_1 v_{1i}^2 + \\tfrac{1}{2}m_2 v_{2i}^2 = \\tfrac{1}{2}m_1 v_{1f}^2 + \\tfrac{1}{2}m_2 v_{2f}^2"}</Tex>
          </div>
          <Separator />
          <div className="text-sm text-muted-foreground text-center space-y-1">
            <p>For 1D elastic collision with object 2 initially at rest:</p>
            <div><Tex display>{"v_{1f} = v_{1i}(m_1 - m_2)/(m_1 + m_2)"}</Tex></div>
            <div><Tex display>{"v_{2f} = 2 m_1 v_{1i}/(m_1 + m_2)"}</Tex></div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="simulation">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="simulation">Before &amp; After</TabsTrigger>
          <TabsTrigger value="examples">Worked Example</TabsTrigger>
        </TabsList>

        <TabsContent value="simulation">
          <Card>
            <CardHeader>
              <CardTitle>1D Elastic Collision</CardTitle>
              <CardDescription>Adjust initial conditions and see the before/after comparison</CardDescription>
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

              {/* Before / After SVG */}
              <div className="flex justify-center">
                <svg width="400" height="180" viewBox="0 0 400 180">
                  {/* BEFORE label */}
                  <text x="200" y="18" textAnchor="middle" fill="#888" fontSize="13" fontWeight="bold">BEFORE</text>

                  {/* Before: Object 1 arrow */}
                  <circle cx="100" cy="50" r={10 + m1} fill="#3b82f6" opacity={0.8} />
                  <text x="100" y="54" textAnchor="middle" fill="white" fontSize="9">{m1}kg</text>
                  {v1i !== 0 && (
                    <line x1={100 + 14 + m1} y1="50" x2={100 + 14 + m1 + v1i * barScale} y2="50"
                      stroke="#3b82f6" strokeWidth="3" markerEnd="url(#arrowBlue)" />
                  )}

                  {/* Before: Object 2 arrow */}
                  <circle cx="280" cy="50" r={10 + m2} fill="#ef4444" opacity={0.8} />
                  <text x="280" y="54" textAnchor="middle" fill="white" fontSize="9">{m2}kg</text>
                  {v2i !== 0 && (
                    <line x1={280 + 14 + m2} y1="50" x2={280 + 14 + m2 + v2i * barScale} y2="50"
                      stroke="#ef4444" strokeWidth="3" markerEnd="url(#arrowRed)" />
                  )}

                  <line x1="20" y1="90" x2="380" y2="90" stroke="#555" strokeWidth="1" strokeDasharray="4" />

                  {/* AFTER label */}
                  <text x="200" y="108" textAnchor="middle" fill="#888" fontSize="13" fontWeight="bold">AFTER</text>

                  {/* After: Object 1 */}
                  <circle cx="100" cy="140" r={10 + m1} fill="#3b82f6" opacity={0.8} />
                  <text x="100" y="144" textAnchor="middle" fill="white" fontSize="9">{m1}kg</text>
                  {Math.abs(v1f) > 0.1 && (
                    <line x1={100 + 14 + m1} y1="140" x2={100 + 14 + m1 + v1f * barScale} y2="140"
                      stroke="#3b82f6" strokeWidth="3" markerEnd="url(#arrowBlue)" />
                  )}

                  {/* After: Object 2 */}
                  <circle cx="280" cy="140" r={10 + m2} fill="#ef4444" opacity={0.8} />
                  <text x="280" y="144" textAnchor="middle" fill="white" fontSize="9">{m2}kg</text>
                  {Math.abs(v2f) > 0.1 && (
                    <line x1={280 + 14 + m2} y1="140" x2={280 + 14 + m2 + v2f * barScale} y2="140"
                      stroke="#ef4444" strokeWidth="3" markerEnd="url(#arrowRed)" />
                  )}

                  <defs>
                    <marker id="arrowBlue" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
                      <polygon points="0 0, 8 3, 0 6" fill="#3b82f6" />
                    </marker>
                    <marker id="arrowRed" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
                      <polygon points="0 0, 8 3, 0 6" fill="#ef4444" />
                    </marker>
                  </defs>
                </svg>
              </div>

              {/* Results */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <h5 className="font-semibold">Velocities After</h5>
                  <p className="text-blue-500">v<sub>1f</sub> = {v1f.toFixed(2)} m/s</p>
                  <p className="text-red-500">v<sub>2f</sub> = {v2f.toFixed(2)} m/s</p>
                </div>
                <div className="space-y-2">
                  <h5 className="font-semibold">Conservation Check</h5>
                  <p>p<sub>before</sub> = {pBefore.toFixed(1)} &rarr; p<sub>after</sub> = {pAfter.toFixed(1)} kg&middot;m/s</p>
                  <p>KE<sub>before</sub> = {keBefore.toFixed(1)} &rarr; KE<sub>after</sub> = {keAfter.toFixed(1)} J</p>
                </div>
              </div>

              <div className="flex gap-2 text-sm">
                <Badge variant="outline" className="text-green-600 border-green-400 dark:text-green-400">Momentum Conserved</Badge>
                <Badge variant="outline" className="text-green-600 border-green-400 dark:text-green-400">KE Conserved</Badge>
              </div>
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
                A 2 kg ball moving at 8 m/s strikes a 2 kg ball at rest in a perfectly elastic collision.
                Find the final velocities.
              </p>
              <Separator />
              <div className="space-y-2">
                <p><strong>Key insight:</strong> When equal masses collide elastically and one is at rest,
                  they <em>exchange velocities</em>.</p>
                <div className="bg-muted p-4 rounded font-mono text-sm space-y-1">
                  <p>v<sub>1f</sub> = v<sub>1i</sub>(m<sub>1</sub>&minus;m<sub>2</sub>)/(m<sub>1</sub>+m<sub>2</sub>) = 8(2&minus;2)/(2+2) = 0 m/s</p>
                  <p>v<sub>2f</sub> = 2m<sub>1</sub>v<sub>1i</sub>/(m<sub>1</sub>+m<sub>2</sub>) = 2(2)(8)/(2+2) = 8 m/s</p>
                </div>
                <p className="text-sm text-muted-foreground">
                  Object 1 stops completely and object 2 moves at 8 m/s &mdash; a perfect exchange!
                  This is the principle behind Newton&apos;s cradle.
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
              <AccordionTrigger>Are any real collisions perfectly elastic?</AccordionTrigger>
              <AccordionContent>
                No macroscopic collision is perfectly elastic, but some come very close. Billiard ball
                collisions, steel ball bearings, and atomic collisions are nearly elastic.
                On the AP exam, if a problem says &ldquo;elastic,&rdquo; treat it as perfectly elastic.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q2">
              <AccordionTrigger>What happens when a light object hits a heavy stationary one elastically?</AccordionTrigger>
              <AccordionContent>
                The light object bounces back at nearly the same speed, and the heavy object barely moves.
                Think of a tennis ball bouncing off a bowling ball.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q3">
              <AccordionTrigger>How do I know if a collision is elastic?</AccordionTrigger>
              <AccordionContent>
                Calculate total KE before and after. If they are equal, the collision is elastic.
                On the AP exam, the problem will state the collision type.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>

    </div>
  );
}

export default ElasticCollisions;
