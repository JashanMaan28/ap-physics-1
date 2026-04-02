"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface RealWorldExample {
  title: string;
  topic: string;
  description: string;
  physics: string;
  funFact: string;
}

const examples: RealWorldExample[] = [
  {
    title: "Billiards / Pool",
    topic: "elastic-collisions",
    description:
      "When a cue ball strikes another ball head-on, the cue ball can stop completely while the target ball moves off at the cue ball's original speed. This is a nearly elastic collision between equal masses.",
    physics:
      "For equal-mass elastic collisions with the target at rest, the objects exchange velocities: v₁f = 0 and v₂f = v₁ᵢ. Professional players use spin and off-center hits to control the angle and speed of both balls after the collision.",
    funFact:
      "Newton's cradle demonstrates the same principle — momentum and kinetic energy transfer through a chain of equal-mass balls.",
  },
  {
    title: "Car Crashes & Airbags",
    topic: "impulse-force",
    description:
      "In a car crash, the driver's momentum must change from mv to zero. Airbags, crumple zones, and seatbelts all work by extending the time of the collision, reducing the peak force on the occupant.",
    physics:
      "Since J = FΔt = Δp, and Δp is fixed (you go from moving to stopped), increasing Δt decreases F. An airbag increases stopping time from ~0.005 s (dashboard) to ~0.05 s, reducing force by a factor of 10.",
    funFact:
      "Modern cars are designed to crumple on purpose. The crumple zone absorbs energy and extends the collision time, while the rigid passenger cabin protects the occupants.",
  },
  {
    title: "Rocket Propulsion",
    topic: "conservation-momentum",
    description:
      "A rocket expels exhaust gas at high speed in one direction. By conservation of momentum, the rocket accelerates in the opposite direction. No external force is needed — it works in the vacuum of space.",
    physics:
      "The total momentum of the rocket + exhaust system remains constant. As exhaust (mass Δm) is ejected at velocity vₑ, the rocket (mass M) gains velocity: MΔv = vₑΔm. This is the basis of the Tsiolkovsky rocket equation.",
    funFact:
      "SpaceX's Falcon 9 first stage has a dry mass of ~22 tons but carries ~400 tons of propellant. Most of a rocket's mass is fuel!",
  },
  {
    title: "Football Tackles",
    topic: "inelastic-collisions",
    description:
      "When a linebacker tackles a running back and they move together after the hit, it's a perfectly inelastic collision. The combined players have less speed than the original runner.",
    physics:
      "If a 100 kg linebacker at rest tackles a 90 kg running back at 8 m/s: vf = (90)(8)/(190) ≈ 3.8 m/s. KE lost: about 53% → converted to sound, heat, and deformation (ouch).",
    funFact:
      "NFL players can generate over 1,600 pounds of tackling force. The impulse during a tackle lasts about 0.2–0.5 seconds.",
  },
  {
    title: "Firearms & Recoil",
    topic: "conservation-momentum",
    description:
      "When a gun fires a bullet, the gun recoils backward. The bullet and gun start at rest (total p = 0), so after firing, their momenta must be equal and opposite.",
    physics:
      "A 4 kg rifle fires a 0.01 kg bullet at 800 m/s. Recoil: v_rifle = −(0.01)(800)/4 = −2 m/s. The rifle moves much slower because it's 400× heavier, but the momentum magnitudes are equal (8 kg·m/s each).",
    funFact:
      "Astronauts could theoretically propel themselves in space by throwing objects — the same conservation of momentum principle as a gun, just much slower.",
  },
  {
    title: "Ice Skating Pairs",
    topic: "conservation-momentum",
    description:
      "When two ice skaters push off each other from rest on frictionless ice, they slide in opposite directions. The lighter skater moves faster.",
    physics:
      "Starting from rest (p = 0), after pushing: m₁v₁ + m₂v₂ = 0, so v₁/v₂ = −m₂/m₁. A 50 kg skater and 80 kg skater push apart: the lighter one moves 1.6× faster.",
    funFact:
      "Figure skaters use angular momentum conservation when spinning — pulling arms in reduces moment of inertia and increases spin rate. That's angular momentum, Unit 7!",
  },
];

export function RealWorld() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Real-World Applications</CardTitle>
          <CardDescription>See momentum in action in everyday life</CardDescription>
        </CardHeader>
      </Card>

      <Accordion className="space-y-2">
        {examples.map((ex, i) => (
          <AccordionItem key={i} value={`example-${i}`} className="border rounded-lg px-4">
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-3">
                <span className="font-semibold">{ex.title}</span>
                <Badge variant="secondary" className="text-xs">{ex.topic}</Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pb-4">
              <p>{ex.description}</p>
              <Separator />
              <div>
                <p className="font-semibold text-sm text-purple-500 mb-1">The Physics</p>
                <p className="text-sm">{ex.physics}</p>
              </div>
              <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded text-sm">
                <p className="font-semibold">Fun Fact</p>
                <p>{ex.funFact}</p>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}

export default RealWorld;
