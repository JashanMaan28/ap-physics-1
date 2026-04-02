"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const examples = [
  {
    title: "Playground Swings",
    description:
      "A playground swing is a simple pendulum. The period depends only on the chain length, not the rider's mass. Longer chains mean slower swings. Pumping changes amplitude but not frequency.",
    physics: "T = 2pi*sqrt(L/g). A typical swing with 3 m chains has T = 3.5 s.",
    connection: "pendulum",
  },
  {
    title: "Grandfather Clocks",
    description:
      "Pendulum clocks use a 1-meter pendulum for a 2-second period (1 second each way). Temperature changes length slightly, requiring compensation mechanisms for accuracy.",
    physics: "L = gT^2/(4pi^2). For T = 2 s: L = 9.81*4/39.48 = 0.994 m.",
    connection: "pendulum",
  },
  {
    title: "Car Suspensions",
    description:
      "Car suspension springs absorb road bumps. Each wheel has a spring-damper system. The natural frequency is chosen to avoid resonance with common road frequencies (~1-2 Hz). Heavier cars need stiffer springs.",
    physics: "f = (1/2pi)*sqrt(k/m). Damping prevents sustained oscillation after bumps.",
    connection: "spring-mass",
  },
  {
    title: "Earthquake-Resistant Buildings",
    description:
      "Tall buildings oscillate like inverted pendulums during earthquakes. Engineers design them so the natural frequency differs from typical earthquake frequencies (0.1-10 Hz) to avoid resonance.",
    physics: "If the building's natural frequency matches the earthquake frequency, oscillations amplify dramatically (resonance).",
    connection: "shm-basics",
  },
  {
    title: "Musical Instruments",
    description:
      "Guitar strings vibrate in SHM (and harmonics). Tightening a string increases the effective spring constant, raising the frequency and pitch. Thicker strings (more mass) vibrate at lower frequencies.",
    physics: "Frequency depends on tension (like k) and mass per unit length. f = (1/2L)*sqrt(T/mu).",
    connection: "spring-mass",
  },
  {
    title: "Bungee Jumping",
    description:
      "After the initial fall, a bungee jumper oscillates up and down on the elastic cord. The cord acts like a spring with the jumper as the mass. Damping gradually reduces the amplitude.",
    physics: "The cord only provides restoring force when stretched beyond natural length, making it asymmetric SHM.",
    connection: "energy-shm",
  },
  {
    title: "Heartbeat and Breathing",
    description:
      "The heart beats in a roughly periodic pattern (~1 Hz at rest). Breathing is also periodic (~0.25 Hz). While not perfect SHM, these biological rhythms share the concept of regular oscillation with characteristic frequencies.",
    physics: "Biological oscillators use feedback mechanisms analogous to restoring forces.",
    connection: "shm-basics",
  },
];

export function RealWorld({
  onComplete,
  isComplete,
}: {
  onComplete: () => void;
  isComplete: boolean;
}) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Real-World Oscillations</CardTitle>
            {isComplete && <Badge variant="secondary">Completed</Badge>}
          </div>
          <CardDescription>
            See how oscillation physics appears in everyday life.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Accordion>
            {examples.map((ex, i) => (
              <AccordionItem key={i} value={`rw-${i}`}>
                <AccordionTrigger>{ex.title}</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2">
                    <p className="text-sm">{ex.description}</p>
                    <Card className="bg-cyan-50 border-cyan-200">
                      <CardContent className="pt-3 pb-3">
                        <p className="text-sm font-mono text-cyan-800">
                          {ex.physics}
                        </p>
                      </CardContent>
                    </Card>
                    <Badge variant="outline">{ex.connection}</Badge>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
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
