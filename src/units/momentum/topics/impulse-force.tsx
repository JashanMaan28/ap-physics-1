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

export function ImpulseForce({ onComplete, isComplete }: TopicProps) {
  const [force, setForce] = useState(100);
  const [deltaT, setDeltaT] = useState(0.5);

  const impulse = force * deltaT;
  const graphWidth = 360;
  const graphHeight = 200;
  const barWidth = Math.max(20, (deltaT / 2) * (graphWidth - 80));
  const barHeight = Math.max(10, (force / 500) * (graphHeight - 60));

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Impulse & Force</CardTitle>
              <CardDescription>The Impulse-Momentum Theorem: <Tex>{"J = F\\Delta t = \\Delta p"}</Tex></CardDescription>
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

      {/* Core Concept */}
      <Card>
        <CardHeader>
          <CardTitle>Core Concept</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            <strong>Impulse</strong> is the product of force and the time interval over which the force acts.
            It equals the change in momentum of the object.
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Impulse is a vector quantity with the same direction as the net force.</li>
            <li>On a Force vs. Time graph, impulse equals the <strong>area under the curve</strong>.</li>
            <li>A large force over a short time can produce the same impulse as a small force over a long time.</li>
            <li>This principle explains why airbags and padding reduce injury: they extend the collision time,
              reducing the peak force while maintaining the same impulse.</li>
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
            <Tex display>{"J = F\\Delta t = \\Delta p = mv_f - mv_i"}</Tex>
          </div>
          <div className="text-center text-sm text-muted-foreground space-y-1">
            <p><Tex>J</Tex> = impulse (N·s = kg·m/s)</p>
            <p><Tex>F</Tex> = average net force (N)</p>
            <p><Tex>{"\\Delta t"}</Tex> = time interval (s)</p>
            <p><Tex>{"\\Delta p"}</Tex> = change in momentum (kg·m/s)</p>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="simulation">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="simulation">Force-Time Graph</TabsTrigger>
          <TabsTrigger value="examples">Worked Example</TabsTrigger>
        </TabsList>

        {/* Simulation Tab */}
        <TabsContent value="simulation">
          <Card>
            <CardHeader>
              <CardTitle>Force-Time Graph &mdash; Impulse as Area</CardTitle>
              <CardDescription>Adjust force and time to see the impulse (shaded area)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Average Force: {force} N</Label>
                  <Slider
                    value={[force]}
                    onValueChange={([v]) => setForce(v)}
                    min={10}
                    max={500}
                    step={10}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Time Interval: {deltaT.toFixed(2)} s</Label>
                  <Slider
                    value={[deltaT]}
                    onValueChange={([v]) => setDeltaT(v)}
                    min={0.05}
                    max={2}
                    step={0.05}
                  />
                </div>
              </div>

              {/* SVG Force-Time Graph */}
              <div className="flex justify-center">
                <svg width={graphWidth} height={graphHeight + 30} viewBox={`0 0 ${graphWidth} ${graphHeight + 30}`}>
                  {/* Axes */}
                  <line x1="50" y1="10" x2="50" y2={graphHeight - 20} stroke="#888" strokeWidth="2" />
                  <line x1="50" y1={graphHeight - 20} x2={graphWidth - 10} y2={graphHeight - 20} stroke="#888" strokeWidth="2" />

                  {/* Axis labels */}
                  <text x="15" y={graphHeight / 2} textAnchor="middle" fill="#888" fontSize="12" transform={`rotate(-90, 15, ${graphHeight / 2})`}>
                    Force (N)
                  </text>
                  <text x={(graphWidth + 50) / 2} y={graphHeight + 15} textAnchor="middle" fill="#888" fontSize="12">
                    Time (s)
                  </text>

                  {/* Shaded impulse area */}
                  <rect
                    x="50"
                    y={graphHeight - 20 - barHeight}
                    width={barWidth}
                    height={barHeight}
                    fill="#8b5cf6"
                    opacity={0.35}
                    stroke="#8b5cf6"
                    strokeWidth="2"
                  />

                  {/* Impulse label */}
                  <text
                    x={50 + barWidth / 2}
                    y={graphHeight - 20 - barHeight / 2 + 5}
                    textAnchor="middle"
                    fill="#8b5cf6"
                    fontSize="13"
                    fontWeight="bold"
                  >
                    J = {impulse.toFixed(1)} N&middot;s
                  </text>
                </svg>
              </div>

              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-3 rounded bg-muted">
                  <div className="text-sm text-muted-foreground">Force</div>
                  <div className="text-lg font-bold">{force} N</div>
                </div>
                <div className="p-3 rounded bg-muted">
                  <div className="text-sm text-muted-foreground">&Delta;t</div>
                  <div className="text-lg font-bold">{deltaT.toFixed(2)} s</div>
                </div>
                <div className="p-3 rounded bg-purple-500/10 border border-purple-500/30">
                  <div className="text-sm text-muted-foreground">Impulse</div>
                  <div className="text-lg font-bold text-purple-500">{impulse.toFixed(1)} N&middot;s</div>
                </div>
              </div>

              <Progress value={Math.min(100, (impulse / 1000) * 100)} className="h-2" />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Worked Example */}
        <TabsContent value="examples">
          <Card>
            <CardHeader>
              <CardTitle>Worked Example</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="font-medium">
                A 0.15 kg baseball moving at 40 m/s is hit by a bat. It leaves the bat at 50 m/s
                in the opposite direction. If the bat contacts the ball for 0.002 s, what is the
                average force on the ball?
              </p>
              <Separator />
              <div className="space-y-2">
                <p><strong>Given:</strong> m = 0.15 kg, v<sub>i</sub> = +40 m/s, v<sub>f</sub> = &minus;50 m/s, &Delta;t = 0.002 s</p>
                <p><strong>Find:</strong> F<sub>avg</sub> = ?</p>
                <p><strong>Solution:</strong></p>
                <div className="bg-muted p-4 rounded font-mono text-sm space-y-1">
                  <p>&Delta;p = mv<sub>f</sub> &minus; mv<sub>i</sub></p>
                  <p>&Delta;p = (0.15)(&minus;50) &minus; (0.15)(40)</p>
                  <p>&Delta;p = &minus;7.5 &minus; 6.0 = &minus;13.5 kg&middot;m/s</p>
                  <br />
                  <p>F = &Delta;p / &Delta;t = &minus;13.5 / 0.002</p>
                  <p>F = &minus;6,750 N</p>
                </div>
                <p className="text-sm text-muted-foreground">
                  The negative sign indicates the force is in the direction the ball leaves the bat.
                  The magnitude is 6,750 N &mdash; a huge force applied for a very short time.
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
              <AccordionTrigger>What is the relationship between impulse and momentum?</AccordionTrigger>
              <AccordionContent>
                The impulse-momentum theorem states that the impulse on an object equals its change
                in momentum: J = &Delta;p. This is derived from Newton&apos;s second law: F = ma = m(&Delta;v/&Delta;t),
                so F&Delta;t = m&Delta;v = &Delta;p.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q2">
              <AccordionTrigger>How do airbags use the impulse-momentum theorem?</AccordionTrigger>
              <AccordionContent>
                In a crash, your change in momentum (&Delta;p) is fixed &mdash; you go from moving to stopped.
                Since J = F&Delta;t = &Delta;p, increasing &Delta;t (the stopping time via the airbag) decreases
                the average force F on your body. This reduces injuries.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q3">
              <AccordionTrigger>How do I find impulse from a Force-Time graph?</AccordionTrigger>
              <AccordionContent>
                Impulse is the <strong>area under the F vs. t curve</strong>. For constant force,
                it&apos;s a rectangle (F &times; &Delta;t). For varying force, break it into geometric shapes
                (triangles, trapezoids) and sum the areas. Areas below the time axis are negative impulse.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>

    </div>
  );
}

export default ImpulseForce;
