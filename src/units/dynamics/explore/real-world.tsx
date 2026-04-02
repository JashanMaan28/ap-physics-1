"use client";

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const examples = [
  {
    title: "Car Crashes and Seatbelts",
    category: "Safety",
    description:
      "During a car crash, the car decelerates rapidly. By Newton's First Law, your body wants to continue forward at the original speed. The seatbelt applies a force (via Newton's Second Law) to decelerate you along with the car. Without it, you'd hit the windshield.",
    physics: "F = ma governs the force needed. Longer stopping time (crumple zones, airbags) reduces the deceleration and thus the force on your body.",
  },
  {
    title: "Elevator Rides",
    category: "Everyday Life",
    description:
      "When an elevator accelerates upward, you feel heavier because the floor must push you up harder than just supporting your weight. When it decelerates (or accelerates downward), you feel lighter.",
    physics: "Apparent weight: N = m(g + a) when accelerating up, N = m(g - a) when accelerating down. At a = g, you'd be weightless (free fall).",
  },
  {
    title: "Sports: Throwing a Ball",
    category: "Sports",
    description:
      "A pitcher accelerates a 0.145 kg baseball from rest to 40 m/s in about 0.15 seconds. The force required is surprisingly large, which is why proper form distributes the load across the body.",
    physics: "F = ma = 0.145 × (40/0.15) = 0.145 × 267 ≈ 38.7 N. This is almost 27 times the ball's weight.",
  },
  {
    title: "Tug-of-War",
    category: "Sports",
    description:
      "In tug-of-war, both teams pull the rope with equal and opposite forces (Newton's Third Law). The winning team is the one that generates more friction with the ground, giving them a greater net horizontal force.",
    physics: "The rope tension is the same on both sides (Third Law). Victory depends on f_s = μ_s × N -- heavier teams or those with better grip on the ground have an advantage.",
  },
  {
    title: "Driving on Icy Roads",
    category: "Safety",
    description:
      "Ice dramatically reduces the coefficient of friction between tires and road (μ drops from ~0.7 to ~0.1). This means less friction force is available for acceleration, braking, and turning.",
    physics: "Maximum friction: f = μ × N. With μ = 0.1 instead of 0.7, the maximum force before sliding is reduced by 86%, making it nearly impossible to stop quickly.",
  },
  {
    title: "Rock Climbing",
    category: "Recreation",
    description:
      "A rock climber hanging from a rope creates tension equal to their weight. When they climb (accelerate upward), the rope tension exceeds their weight. Ropes are rated by their maximum tension load.",
    physics: "Static: T = mg. Climbing up: T = m(g + a). A fall creates very large forces -- dynamic ropes stretch to increase the stopping time, reducing peak force (impulse principle).",
  },
  {
    title: "Airplane Takeoff",
    category: "Transportation",
    description:
      "During takeoff, jet engines produce thrust that accelerates the plane forward. Passengers feel pushed into their seats. A typical commercial jet accelerates at about 2.5 m/s² during takeoff.",
    physics: "The seat pushes you forward (Newton's Second Law). You feel heavier in the horizontal direction. For a 70 kg person: F = 70 × 2.5 = 175 N forward force from the seat.",
  },
];

export function RealWorldExamples() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Real-World Applications</CardTitle>
          <CardDescription>
            See how force and dynamics concepts apply to everyday situations.
          </CardDescription>
        </CardHeader>
      </Card>

      {examples.map((ex, idx) => (
        <Card key={idx}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">{ex.title}</CardTitle>
              <Badge variant="outline">{ex.category}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-muted-foreground">{ex.description}</p>
            <Separator />
            <div className="rounded-lg bg-blue-50 border border-blue-200 p-3">
              <p className="text-sm font-medium text-blue-900">The Physics:</p>
              <p className="text-sm text-blue-800">{ex.physics}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
