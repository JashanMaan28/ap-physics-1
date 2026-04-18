"use client";

import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { PhysicsText } from "@/components/ui/physics-text";

interface WorkedExample {
  id: number;
  title: string;
  topic: string;
  problem: string;
  steps: { title: string; content: string }[];
  answer: string;
}

const examples: WorkedExample[] = [
  {
    id: 1,
    title: "Pulling a Sled",
    topic: "Work",
    problem: "A child pulls a 15 kg sled with a 40 N force at 30 degrees above the horizontal for 20 m. How much work is done by the child?",
    steps: [
      { title: "Identify known values", content: "F = 40 N, d = 20 m, theta = 30 degrees" },
      { title: "Choose the formula", content: "W = Fd cos(theta)" },
      { title: "Substitute values", content: "W = 40 x 20 x cos(30) = 40 x 20 x 0.866" },
      { title: "Calculate", content: "W = 692.8 J" },
    ],
    answer: "The child does 692.8 J of work on the sled.",
  },
  {
    id: 2,
    title: "Stopping a Car",
    topic: "Kinetic Energy / Work-Energy Theorem",
    problem: "A 1200 kg car traveling at 25 m/s brakes to a stop. What is the work done by the brakes?",
    steps: [
      { title: "Find initial KE", content: "KE_i = 1/2 mv^2 = 0.5 x 1200 x 25^2 = 375,000 J" },
      { title: "Find final KE", content: "KE_f = 0 (car stops)" },
      { title: "Apply work-energy theorem", content: "W_net = KE_f - KE_i = 0 - 375,000 = -375,000 J" },
      { title: "Interpret", content: "The negative sign means the braking force opposed the motion." },
    ],
    answer: "The brakes do -375,000 J (375 kJ) of work, converting kinetic energy to thermal energy.",
  },
  {
    id: 3,
    title: "Ski Jump",
    topic: "Conservation of Energy",
    problem: "A 70 kg skier starts from rest at the top of a 50 m hill and skis down a frictionless slope. What is the skier's speed at the bottom?",
    steps: [
      { title: "Set reference level", content: "Let h = 0 at the bottom of the hill." },
      { title: "Write conservation equation", content: "KE_i + PE_i = KE_f + PE_f => 0 + mgh = 1/2 mv^2 + 0" },
      { title: "Mass cancels", content: "gh = 1/2 v^2 => v = sqrt(2gh)" },
      { title: "Substitute", content: "v = sqrt(2 x 9.8 x 50) = sqrt(980) = 31.3 m/s" },
    ],
    answer: "The skier reaches 31.3 m/s (~70 mph) at the bottom of the hill.",
  },
  {
    id: 4,
    title: "Spring-Launched Projectile",
    topic: "Elastic PE + Conservation",
    problem: "A spring (k = 800 N/m) compressed by 0.12 m launches a 0.05 kg ball vertically. How high does the ball go?",
    steps: [
      { title: "Calculate spring PE", content: "PE_spring = 1/2 kx^2 = 0.5 x 800 x 0.0144 = 5.76 J" },
      { title: "Set up conservation", content: "PE_spring = PE_grav at max height => 1/2 kx^2 = mgh" },
      { title: "Solve for h", content: "h = kx^2 / (2mg) = 5.76 / (0.05 x 9.8) = 5.76 / 0.49" },
      { title: "Calculate", content: "h = 11.76 m" },
    ],
    answer: "The ball reaches a maximum height of 11.76 m.",
  },
  {
    id: 5,
    title: "Climbing Stairs",
    topic: "Power",
    problem: "A 60 kg person climbs a 4 m staircase in 6 seconds. Calculate their average power output.",
    steps: [
      { title: "Calculate work against gravity", content: "W = mgh = 60 x 9.8 x 4 = 2352 J" },
      { title: "Apply power formula", content: "P = W/t = 2352 / 6" },
      { title: "Calculate", content: "P = 392 W" },
      { title: "Convert to horsepower", content: "P = 392 / 746 = 0.53 hp" },
    ],
    answer: "The person's average power output is 392 W (about 0.53 hp).",
  },
  {
    id: 6,
    title: "Bungee Jumper at Lowest Point",
    topic: "Energy Conservation with Springs",
    problem: "A 65 kg bungee jumper falls 30 m before the cord (k = 50 N/m, natural length 15 m) pulls taut. How far below the jump point is the lowest point?",
    steps: [
      { title: "Define variables", content: "Let total drop = d. The cord stretches by x = d - 15 m. At the lowest point, v = 0." },
      { title: "Conservation of energy", content: "mgd = 1/2 k(d - 15)^2. All gravitational PE converts to elastic PE." },
      { title: "Substitute", content: "65 x 9.8 x d = 0.5 x 50 x (d - 15)^2 => 637d = 25(d - 15)^2" },
      { title: "Expand and solve", content: "637d = 25d^2 - 750d + 5625 => 25d^2 - 1387d + 5625 = 0. Using quadratic formula: d = (1387 +/- sqrt(1387^2 - 4 x 25 x 5625)) / 50. d = 50.9 m or 4.4 m. Since d > 15, answer is 50.9 m." },
    ],
    answer: "The lowest point is approximately 50.9 m below the jump point.",
  },
];

export function WorkedExamples() {
  const [current, setCurrent] = useState(0);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Worked Examples</CardTitle>
          <CardDescription>
            Step-by-step solutions to {examples.length} energy problems.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {examples.map((ex, i) => (
              <Button
                key={ex.id}
                variant={current === i ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrent(i)}
              >
                {i + 1}. {ex.title}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <CardTitle>{examples[current].title}</CardTitle>
            <Badge>{examples[current].topic}</Badge>
          </div>
          <CardDescription className="text-base mt-2">
            {examples[current].problem}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Accordion>
            {examples[current].steps.map((step, i) => (
              <AccordionItem key={i} value={`step-${i}`}>
                <AccordionTrigger>
                  Step {i + 1}: {step.title}
                </AccordionTrigger>
                <AccordionContent>
                  <PhysicsText className="text-sm bg-gray-50 p-3 rounded dark:bg-gray-500/10">
                    {step.content}
                  </PhysicsText>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <Separator />

          <Card className="bg-green-50 border-green-200 dark:bg-green-500/10 dark:border-green-500/30">
            <CardContent className="pt-4">
              <p className="font-semibold text-green-800 dark:text-green-300">Final Answer</p>
              <p className="text-green-700 dark:text-green-300">{examples[current].answer}</p>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
}
