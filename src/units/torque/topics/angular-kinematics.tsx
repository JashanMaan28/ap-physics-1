"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tex } from "@/components/ui/math";
import { PhysicsText } from "@/components/ui/physics-text";

interface TopicProps {
  onComplete: () => void;
  isComplete: boolean;
}

export function AngularKinematics({ onComplete, isComplete }: TopicProps) {
  const [omega0, setOmega0] = useState(2);
  const [alphaVal, setAlphaVal] = useState(3);
  const [time, setTime] = useState(2);

  const omegaFinal = omega0 + alphaVal * time;
  const theta = omega0 * time + 0.5 * alphaVal * time * time;
  const omegaSq = omega0 * omega0 + 2 * alphaVal * theta;
  const revolutions = theta / (2 * Math.PI);

  // Spinning wheel animation
  const cx = 200;
  const cy = 150;
  const wheelR = 70;
  const spinDur = omegaFinal > 0.1 ? Math.max(0.2, (2 * Math.PI) / omegaFinal) : 100;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Angular Kinematics</CardTitle>
              <CardDescription className="mt-1 text-base">
                Describing rotational motion with &theta;, &omega;, and &alpha;
              </CardDescription>
            </div>
            <Button
              variant={isComplete ? "default" : "outline"}
              size="sm"
              onClick={onComplete}
              className="cursor-pointer"
            >
              {isComplete ? "Completed" : "Mark Complete"}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-primary">
              Key Formulas
            </h3>
            <div className="space-y-1">
              <div><Tex display>{"\\omega = \\omega_0 + \\alpha t"}</Tex></div>
              <div><Tex display>{"\\theta = \\omega_0 t + \\tfrac{1}{2}\\alpha t^2"}</Tex></div>
              <div><Tex display>{"\\omega^2 = \\omega_0^2 + 2\\alpha\\theta"}</Tex></div>
            </div>
            <ul className="mt-3 space-y-1 text-sm text-muted-foreground">
              <li><Tex>{"\\theta"}</Tex> = angular displacement (rad)</li>
              <li><Tex>{"\\omega"}</Tex> = angular velocity (rad/s)</li>
              <li><Tex>{"\\alpha"}</Tex> = angular acceleration (rad/s²)</li>
            </ul>
          </div>
          <Separator />
          <p className="text-sm leading-relaxed text-muted-foreground">
            Angular kinematics equations are the rotational analogs of the linear kinematic
            equations. Replace x with &theta;, v with &omega;, and a with &alpha;. These equations
            apply when angular acceleration is constant.
          </p>
        </CardContent>
      </Card>

      {/* Interactive Spinning Wheel */}
      <Card>
        <CardHeader>
          <CardTitle>Interactive: Spinning Wheel</CardTitle>
          <CardDescription>
            Set initial angular velocity, angular acceleration, and time to see the final state
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex justify-center">
            <svg viewBox="0 0 400 300" className="w-full max-w-md border rounded-lg bg-muted/30">
              {/* Wheel rim */}
              <circle cx={cx} cy={cy} r={wheelR} fill="none" stroke="#ec4899" strokeWidth={4} />
              <circle cx={cx} cy={cy} r={wheelR - 8} fill="none" stroke="#ec4899" strokeWidth={1} opacity={0.3} />
              <circle cx={cx} cy={cy} r={6} fill="#ec4899" />

              {/* Spokes with rotation */}
              {[0, 60, 120, 180, 240, 300].map((deg) => (
                <line
                  key={deg}
                  x1={cx}
                  y1={cy}
                  x2={cx + wheelR * Math.cos((deg * Math.PI) / 180)}
                  y2={cy + wheelR * Math.sin((deg * Math.PI) / 180)}
                  stroke="#ec4899"
                  strokeWidth={2}
                  opacity={0.5}
                >
                  <animateTransform
                    attributeName="transform"
                    type="rotate"
                    from={`0 ${cx} ${cy}`}
                    to={`${omegaFinal > 0 ? 360 : -360} ${cx} ${cy}`}
                    dur={`${spinDur}s`}
                    repeatCount="indefinite"
                  />
                </line>
              ))}

              {/* Reference marker */}
              <circle cx={cx + wheelR} cy={cy} r={5} fill="#3b82f6">
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  from={`0 ${cx} ${cy}`}
                  to={`${omegaFinal > 0 ? 360 : -360} ${cx} ${cy}`}
                  dur={`${spinDur}s`}
                  repeatCount="indefinite"
                />
              </circle>

              {/* Labels */}
              <text x={cx} y={cy + wheelR + 30} textAnchor="middle" fontSize="12" fill="currentColor" opacity={0.7}>
                &omega;&#8320; = {omega0.toFixed(1)} rad/s &rarr; &omega; = {omegaFinal.toFixed(1)} rad/s
              </text>
              <text x={cx} y={cy + wheelR + 48} textAnchor="middle" fontSize="11" fill="currentColor" opacity={0.5}>
                {revolutions.toFixed(1)} revolutions in {time} s
              </text>

              {/* Angular acceleration indicator */}
              {alphaVal !== 0 && (
                <>
                  <path
                    d={`M ${cx - 30} ${cy - wheelR - 15} A 30 30 0 0 1 ${cx + 30} ${cy - wheelR - 15}`}
                    fill="none"
                    stroke={alphaVal > 0 ? "#22c55e" : "#ef4444"}
                    strokeWidth={2}
                    markerEnd="url(#alphaArrow)"
                  />
                  <defs>
                    <marker id="alphaArrow" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
                      <polygon points="0 0, 8 3, 0 6" fill={alphaVal > 0 ? "#22c55e" : "#ef4444"} />
                    </marker>
                  </defs>
                  <text x={cx} y={cy - wheelR - 25} textAnchor="middle" fontSize="11"
                    fill={alphaVal > 0 ? "#22c55e" : "#ef4444"}>
                    &alpha; = {alphaVal.toFixed(1)} rad/s&sup2;
                  </text>
                </>
              )}
            </svg>
          </div>

          {/* Controls */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Initial Angular Velocity (&omega;&#8320;): {omega0.toFixed(1)} rad/s</Label>
              <Slider value={[omega0]} onValueChange={([v]) => setOmega0(v)} min={0} max={20} step={0.5} />
            </div>
            <div className="space-y-2">
              <Label>Angular Acceleration (&alpha;): {alphaVal.toFixed(1)} rad/s&sup2;</Label>
              <Slider value={[alphaVal]} onValueChange={([v]) => setAlphaVal(v)} min={-10} max={10} step={0.5} />
            </div>
            <div className="space-y-2">
              <Label>Time (t): {time.toFixed(1)} s</Label>
              <Slider value={[time]} onValueChange={([v]) => setTime(v)} min={0} max={10} step={0.1} />
            </div>
          </div>

          <Separator />

          {/* Results */}
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardContent className="pt-4">
                <p className="text-sm text-muted-foreground">Final &omega;</p>
                <p className="text-xl font-bold text-primary">{omegaFinal.toFixed(2)} rad/s</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <p className="text-sm text-muted-foreground">Displacement &theta;</p>
                <p className="text-xl font-bold">{theta.toFixed(2)} rad</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <p className="text-sm text-muted-foreground">&omega;&sup2;</p>
                <p className="text-xl font-bold">{omegaSq.toFixed(2)} rad&sup2;/s&sup2;</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <p className="text-sm text-muted-foreground">Revolutions</p>
                <p className="text-xl font-bold">{revolutions.toFixed(2)}</p>
              </CardContent>
            </Card>
          </div>

          <div className="rounded-lg bg-muted/50 p-3 text-sm">
            <strong>Linear-Rotational Analogy:</strong> x &harr; &theta;, v &harr; &omega;, a &harr; &alpha;.
            Every linear kinematic equation has a rotational twin. If you know one set, you know the other!
          </div>
        </CardContent>
      </Card>

      {/* FAQ */}
      <Card>
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion>
            <AccordionItem value="q1">
              <AccordionTrigger>When can I use these angular kinematic equations?</AccordionTrigger>
              <AccordionContent>
                These equations are valid only when angular acceleration (&alpha;) is constant.
                If &alpha; varies with time, you need calculus-based approaches (not required for AP Physics 1).
                Most AP problems involve constant &alpha;.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q2">
              <AccordionTrigger>How do I convert between radians, degrees, and revolutions?</AccordionTrigger>
              <AccordionContent>
                1 revolution = 2&pi; radians = 360&deg;. Always use radians in kinematic equations.
                To convert: multiply degrees by &pi;/180 to get radians, or multiply revolutions
                by 2&pi; to get radians.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q3">
              <AccordionTrigger>How do angular and linear quantities relate for a point on a rotating object?</AccordionTrigger>
              <AccordionContent>
                For a point at distance r from the axis: s = r&theta; (arc length),
                v = r&omega; (tangential velocity), a_t = r&alpha; (tangential acceleration).
                The centripetal acceleration is a_c = &omega;&sup2;r = v&sup2;/r.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q4">
              <AccordionTrigger>What happens when &alpha; is negative?</AccordionTrigger>
              <AccordionContent>
                Negative &alpha; means the angular acceleration opposes the positive direction.
                If &omega; is positive and &alpha; is negative, the object is slowing down (angular
                deceleration). If both are negative, the object spins faster in the negative direction.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
