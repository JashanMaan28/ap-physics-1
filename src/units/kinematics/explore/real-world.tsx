"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PhysicsText } from "@/components/ui/physics-text";

const examples = [
  { title: "Car Braking Distances", topic: "Constant Deceleration", description: "When you brake, your car decelerates (negative acceleration). Using $v² = v₀² + 2aΔx$, doubling your speed quadruples the braking distance. At 60 mph vs 30 mph, you need 4× the distance to stop.", physics: "v² = v₀² + 2aΔx → Δx = v₀²/(2|a|)" },
  { title: "Skydiving & Terminal Velocity", topic: "Free Fall + Air Resistance", description: "A skydiver initially accelerates at $g = 9.8$ m/s². As speed increases, air resistance grows until it equals weight — acceleration becomes zero and speed is constant (terminal velocity ~53 m/s).", physics: "Initially: $a = g$. At terminal velocity: $a = 0$." },
  { title: "Basketball Free Throws", topic: "Projectile Motion", description: "A free throw is a projectile problem. The ball must reach the hoop (3.05 m high, 4.19 m away) with the right combination of launch angle and speed. Optimal angle is about 45–55°.", physics: "x = v₀ cos(θ)·t, y = v₀ sin(θ)·t − ½gt²" },
  { title: "Roller Coasters", topic: "Acceleration & g-Forces", description: "Riders experience accelerations measured in 'g's. A 3g turn means you feel 3× your weight. Modern coasters design acceleration profiles to stay under ~5g for safety.", physics: "$a = v²/r$ for circular sections" },
  { title: "Sprinter's 100 m Dash", topic: "Constant Acceleration Phase", description: "Usain Bolt accelerated at ~3.1 m/s² for the first ~4 seconds, reaching ~12 m/s, then maintained near-constant speed. His 100 m splits show kinematics in action.", physics: "Phase 1: $x = ½at²$. Phase 2: $x = v·t$." },
  { title: "Rocket Launches", topic: "Multi-Stage Acceleration", description: "SpaceX Falcon 9 accelerates at ~1.2g initially, increasing as fuel burns (less mass). It's a real-world example of changing acceleration — each stage has different kinematics.", physics: "$F = ma$, and $m$ decreases as fuel burns → $a$ increases" },
];

export function RealWorldExamples() {
  return (
    <div className="space-y-4 max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Real-World Kinematics</CardTitle>
          <CardDescription>See how kinematics applies to everyday life</CardDescription>
        </CardHeader>
      </Card>
      {examples.map(ex => (
        <Card key={ex.title}>
          <CardHeader>
            <div className="flex items-center gap-2">
              <CardTitle className="text-base">{ex.title}</CardTitle>
              <Badge variant="secondary" className="text-[10px]">{ex.topic}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <PhysicsText display={false} className="text-sm text-muted-foreground">{ex.description}</PhysicsText>
            <PhysicsText display={false} className="text-xs text-primary/70">{ex.physics}</PhysicsText>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
