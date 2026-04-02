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

interface FRQ {
  id: number;
  title: string;
  scenario: string;
  parts: { label: string; prompt: string; rubric: string }[];
}

const frqs: FRQ[] = [
  {
    id: 1,
    title: "Block on a Ramp",
    scenario:
      "A 4 kg block starts from rest at the top of a frictionless ramp that is 3 m high and 5 m long.",
    parts: [
      { label: "a", prompt: "Calculate the gravitational potential energy of the block at the top of the ramp.", rubric: "PE = mgh = 4 x 9.8 x 3 = 117.6 J. (1 pt for formula, 1 pt for correct substitution, 1 pt for answer with units)" },
      { label: "b", prompt: "Determine the speed of the block at the bottom of the ramp using conservation of energy.", rubric: "mgh = 1/2 mv^2 => v = sqrt(2gh) = sqrt(2 x 9.8 x 3) = 7.67 m/s. (1 pt for conservation equation, 1 pt for solving, 1 pt for answer)" },
      { label: "c", prompt: "If friction is now present (mu_k = 0.2), find the work done by friction and the new speed at the bottom.", rubric: "W_friction = -mu_k * mg * cos(theta) * L. theta = arcsin(3/5), cos(theta) = 4/5. W_f = -0.2 x 4 x 9.8 x 0.8 x 5 = -31.36 J. KE = 117.6 - 31.36 = 86.24 J. v = sqrt(2 x 86.24 / 4) = 6.57 m/s. (2 pts friction work, 2 pts final speed)" },
    ],
  },
  {
    id: 2,
    title: "Spring Launcher",
    scenario:
      "A spring (k = 500 N/m) is compressed 0.15 m and used to launch a 0.3 kg ball vertically.",
    parts: [
      { label: "a", prompt: "Calculate the elastic potential energy stored in the compressed spring.", rubric: "PE = 1/2 kx^2 = 0.5 x 500 x 0.0225 = 5.625 J. (1 pt formula, 1 pt answer)" },
      { label: "b", prompt: "Determine the maximum height reached by the ball after launch.", rubric: "1/2 kx^2 = mgh => h = kx^2 / (2mg) = 5.625 / (0.3 x 9.8) = 1.91 m. (1 pt conservation setup, 1 pt solving, 1 pt answer)" },
      { label: "c", prompt: "Find the speed of the ball when it is at half the maximum height.", rubric: "At h/2: 5.625 = 1/2 mv^2 + mg(h/2). KE = 5.625 - 0.3 x 9.8 x 0.955 = 2.8125 J. v = sqrt(2 x 2.8125 / 0.3) = 4.33 m/s. (2 pts setup, 1 pt answer)" },
    ],
  },
  {
    id: 3,
    title: "Roller Coaster Design",
    scenario:
      "A 500 kg roller coaster car starts from rest at the top of a 40 m hill. The track is frictionless.",
    parts: [
      { label: "a", prompt: "What is the car's speed at the bottom of the first hill?", rubric: "v = sqrt(2gh) = sqrt(2 x 9.8 x 40) = 28.0 m/s. (1 pt formula, 1 pt answer)" },
      { label: "b", prompt: "The car then goes over a 25 m hill. What is its speed at the top?", rubric: "v = sqrt(2g(40-25)) = sqrt(2 x 9.8 x 15) = 17.1 m/s. (2 pts)" },
      { label: "c", prompt: "What is the maximum height of a second hill that the car can clear?", rubric: "Max height = 40 m (same as starting height, since total energy is conserved and car needs at least v=0 at top). (2 pts)" },
      { label: "d", prompt: "If friction does 50,000 J of work over the entire track, what is the car's speed at the bottom?", rubric: "KE = mgh - |W_f| = 500 x 9.8 x 40 - 50000 = 146000 J. v = sqrt(2 x 146000 / 500) = 24.2 m/s. (2 pts)" },
    ],
  },
];

export function FRQPractice() {
  const [currentFRQ, setCurrentFRQ] = useState(0);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Free-Response Practice</CardTitle>
          <CardDescription>
            AP-style FRQ problems on work, energy, and power. Practice showing
            your work step-by-step.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-4">
            {frqs.map((frq, i) => (
              <Button
                key={frq.id}
                variant={currentFRQ === i ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentFRQ(i)}
              >
                FRQ {i + 1}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <CardTitle>{frqs[currentFRQ].title}</CardTitle>
            <Badge variant="outline">
              {frqs[currentFRQ].parts.length} parts
            </Badge>
          </div>
          <CardDescription>{frqs[currentFRQ].scenario}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {frqs[currentFRQ].parts.map((part) => (
            <Card key={part.label}>
              <CardContent className="pt-4 space-y-2">
                <p className="font-medium">
                  ({part.label}) {part.prompt}
                </p>
                <Accordion>
                  <AccordionItem value={`rubric-${part.label}`}>
                    <AccordionTrigger>Show Scoring Rubric</AccordionTrigger>
                    <AccordionContent>
                      <p className="text-sm text-green-800 bg-green-50 p-3 rounded">
                        {part.rubric}
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
