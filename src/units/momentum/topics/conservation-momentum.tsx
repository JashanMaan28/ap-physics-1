"use client";

import { useState, useEffect } from "react";
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

export function ConservationMomentum({ onComplete, isComplete }: TopicProps) {
  const [m1, setM1] = useState(4);
  const [v1, setV1] = useState(8);
  const [m2, setM2] = useState(2);
  const [v2, setV2] = useState(-3);
  const [running, setRunning] = useState(false);
  const [t, setT] = useState(0);

  const totalMomentumBefore = m1 * v1 + m2 * v2;

  // Simple elastic collision formulas for visualization
  const v1f = ((m1 - m2) * v1 + 2 * m2 * v2) / (m1 + m2);
  const v2f = ((m2 - m1) * v2 + 2 * m1 * v1) / (m1 + m2);
  const totalMomentumAfter = m1 * v1f + m2 * v2f;

  // Animation
  useEffect(() => {
    if (!running) return;
    const interval = setInterval(() => {
      setT((prev) => {
        if (prev >= 100) {
          setRunning(false);
          return 100;
        }
        return prev + 2;
      });
    }, 30);
    return () => clearInterval(interval);
  }, [running]);

  const collisionPoint = 50;
  const beforeCollision = t < collisionPoint;

  // Cart positions
  const cart1X = beforeCollision
    ? 60 + (t / collisionPoint) * 100
    : 160 + ((t - collisionPoint) / 50) * (v1f > 0 ? 60 : -60)
  ;
  const cart2X = beforeCollision
    ? 280 - (t / collisionPoint) * 100
    : 180 + ((t - collisionPoint) / 50) * (v2f > 0 ? 60 : -60)
  ;

  const reset = () => {
    setT(0);
    setRunning(false);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Conservation of Momentum</CardTitle>
              <CardDescription>In an isolated system, total momentum is conserved</CardDescription>
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
            In an <strong>isolated system</strong> (no external net force), the total momentum
            before an interaction equals the total momentum after. This is the
            <strong> law of conservation of momentum</strong>.
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Applies to collisions, explosions, and any interaction in an isolated system.</li>
            <li>Works in each direction independently (x and y).</li>
            <li>Momentum is transferred between objects but never created or destroyed.</li>
          </ul>
        </CardContent>
      </Card>

      {/* Key Formula */}
      <Card className="border-2 border-purple-500/30 bg-purple-500/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>Key Formula</span>
            <Badge variant="outline" className="text-purple-600 border-purple-400 dark:text-purple-400">Must Know</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-3xl font-bold py-4">
            <Tex display>{"m_1 v_{1i} + m_2 v_{2i} = m_1 v_{1f} + m_2 v_{2f}"}</Tex>
          </div>
          <div className="text-center text-sm text-muted-foreground">
            <p>Total momentum before = Total momentum after</p>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="simulation">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="simulation">Two-Cart Collision</TabsTrigger>
          <TabsTrigger value="examples">Worked Example</TabsTrigger>
        </TabsList>

        <TabsContent value="simulation">
          <Card>
            <CardHeader>
              <CardTitle>Two-Cart Collision Simulator</CardTitle>
              <CardDescription>Set masses and velocities, then run the collision</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-semibold text-blue-500">Cart 1</h4>
                  <div className="space-y-2">
                    <Label>Mass: {m1} kg</Label>
                    <Slider value={[m1]} onValueChange={([v]) => { setM1(v); reset(); }} min={1} max={10} step={0.5} />
                  </div>
                  <div className="space-y-2">
                    <Label>Velocity: {v1} m/s</Label>
                    <Slider value={[v1]} onValueChange={([v]) => { setV1(v); reset(); }} min={-15} max={15} step={1} />
                  </div>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold text-red-500">Cart 2</h4>
                  <div className="space-y-2">
                    <Label>Mass: {m2} kg</Label>
                    <Slider value={[m2]} onValueChange={([v]) => { setM2(v); reset(); }} min={1} max={10} step={0.5} />
                  </div>
                  <div className="space-y-2">
                    <Label>Velocity: {v2} m/s</Label>
                    <Slider value={[v2]} onValueChange={([v]) => { setV2(v); reset(); }} min={-15} max={15} step={1} />
                  </div>
                </div>
              </div>

              {/* SVG Simulation */}
              <div className="flex justify-center">
                <svg width="400" height="100" viewBox="0 0 400 100">
                  {/* Track */}
                  <line x1="10" y1="75" x2="390" y2="75" stroke="#555" strokeWidth="2" />

                  {/* Cart 1 */}
                  <rect
                    x={cart1X - 15}
                    y={55 - m1}
                    width={30 + m1}
                    height={20 + m1}
                    rx="3"
                    fill="#3b82f6"
                    opacity={0.85}
                  />
                  <text x={cart1X} y={68} textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">
                    {m1}kg
                  </text>

                  {/* Cart 2 */}
                  <rect
                    x={cart2X - 15}
                    y={55 - m2}
                    width={30 + m2}
                    height={20 + m2}
                    rx="3"
                    fill="#ef4444"
                    opacity={0.85}
                  />
                  <text x={cart2X} y={68} textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">
                    {m2}kg
                  </text>

                  {/* Collision flash */}
                  {t >= 48 && t <= 52 && (
                    <circle cx="170" cy="65" r="12" fill="#fbbf24" opacity={0.6} />
                  )}
                </svg>
              </div>

              <div className="flex gap-3 justify-center">
                <Button onClick={() => { reset(); setRunning(true); }} disabled={running}>
                  Run Collision
                </Button>
                <Button variant="outline" onClick={reset}>Reset</Button>
              </div>

              {/* Momentum Readouts */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded bg-muted text-center">
                  <div className="text-sm text-muted-foreground">Total p (before)</div>
                  <div className="text-lg font-bold">{totalMomentumBefore.toFixed(1)} kg&middot;m/s</div>
                </div>
                <div className="p-3 rounded bg-purple-500/10 border border-purple-500/30 text-center">
                  <div className="text-sm text-muted-foreground">Total p (after)</div>
                  <div className="text-lg font-bold text-purple-500">{totalMomentumAfter.toFixed(1)} kg&middot;m/s</div>
                </div>
              </div>

              <p className="text-center text-sm text-green-500 font-medium">
                Momentum is conserved: {totalMomentumBefore.toFixed(1)} = {totalMomentumAfter.toFixed(1)} kg&middot;m/s
              </p>
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
                A 5 kg cart moving at 6 m/s collides with a 3 kg cart at rest.
                After the collision the 5 kg cart moves at 2 m/s. Find the velocity of the 3 kg cart.
              </p>
              <Separator />
              <div className="space-y-2">
                <p><strong>Given:</strong> m<sub>1</sub>=5 kg, v<sub>1i</sub>=6 m/s, m<sub>2</sub>=3 kg, v<sub>2i</sub>=0, v<sub>1f</sub>=2 m/s</p>
                <p><strong>Find:</strong> v<sub>2f</sub></p>
                <div className="bg-muted p-4 rounded font-mono text-sm space-y-1">
                  <p>m<sub>1</sub>v<sub>1i</sub> + m<sub>2</sub>v<sub>2i</sub> = m<sub>1</sub>v<sub>1f</sub> + m<sub>2</sub>v<sub>2f</sub></p>
                  <p>(5)(6) + (3)(0) = (5)(2) + (3)(v<sub>2f</sub>)</p>
                  <p>30 = 10 + 3v<sub>2f</sub></p>
                  <p>v<sub>2f</sub> = 20/3 &approx; 6.67 m/s</p>
                </div>
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
              <AccordionTrigger>When is momentum conserved?</AccordionTrigger>
              <AccordionContent>
                Momentum is conserved whenever the net external force on a system is zero (isolated system).
                Internal forces (like the forces between colliding objects) do not change total momentum.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q2">
              <AccordionTrigger>What about friction?</AccordionTrigger>
              <AccordionContent>
                Friction is an external force from the surface. If friction is significant, the system
                is not truly isolated and momentum is not perfectly conserved. However, during very brief
                collisions, friction&apos;s effect is negligible, so we often still apply conservation of momentum.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q3">
              <AccordionTrigger>Does conservation of momentum apply in 2D?</AccordionTrigger>
              <AccordionContent>
                Yes! In 2D, momentum is conserved independently in the x- and y-directions.
                You write one conservation equation for each axis.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>

    </div>
  );
}

export default ConservationMomentum;
