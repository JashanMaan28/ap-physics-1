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
import { PhysicsText } from "@/components/ui/physics-text";

const examples = [
  {
    title: "Finding Period of a Spring-Mass System",
    problem: "A 3.0 kg block attached to a spring with k = 75 N/m oscillates on a frictionless surface. Find the period, frequency, and angular frequency.",
    steps: [
      "Identify: m = 3.0 kg, k = 75 N/m",
      "Period: T = 2pi*sqrt(m/k) = 2pi*sqrt(3.0/75) = 2pi*sqrt(0.04) = 2pi*0.2 = 1.257 s",
      "Frequency: f = 1/T = 1/1.257 = 0.796 Hz",
      "Angular frequency: omega = 2pi*f = 2pi*0.796 = 5.0 rad/s (or omega = sqrt(k/m) = sqrt(75/3) = 5.0 rad/s)",
    ],
    answer: "T = 1.26 s, f = 0.80 Hz, omega = 5.0 rad/s",
  },
  {
    title: "Energy Conservation in SHM",
    problem: "A 0.5 kg mass on a spring (k = 200 N/m) has amplitude 0.08 m. Find the speed when x = 0.05 m.",
    steps: [
      "Total energy: E = 1/2 * k * A^2 = 0.5 * 200 * 0.0064 = 0.64 J",
      "PE at x = 0.05 m: PE = 1/2 * k * x^2 = 0.5 * 200 * 0.0025 = 0.25 J",
      "KE = E - PE = 0.64 - 0.25 = 0.39 J",
      "KE = 1/2 * m * v^2 => v = sqrt(2*KE/m) = sqrt(2*0.39/0.5) = sqrt(1.56) = 1.25 m/s",
    ],
    answer: "v = 1.25 m/s at x = 0.05 m",
  },
  {
    title: "Simple Pendulum Period",
    problem: "A grandfather clock uses a pendulum with T = 2.0 s. What length should the pendulum be?",
    steps: [
      "T = 2pi*sqrt(L/g)",
      "Solve for L: L = g*T^2 / (4*pi^2)",
      "L = 9.81 * (2.0)^2 / (4 * 9.8696)",
      "L = 9.81 * 4.0 / 39.478 = 39.24 / 39.478 = 0.994 m",
    ],
    answer: "L = 0.994 m (approximately 1.0 m)",
  },
  {
    title: "Maximum Velocity and Acceleration",
    problem: "An object oscillates with f = 2.0 Hz and A = 0.10 m. Find the maximum velocity and maximum acceleration.",
    steps: [
      "omega = 2pi*f = 2pi*2.0 = 12.57 rad/s",
      "v_max = A*omega = 0.10 * 12.57 = 1.257 m/s",
      "a_max = A*omega^2 = 0.10 * (12.57)^2 = 0.10 * 158.0 = 15.8 m/s^2",
    ],
    answer: "v_max = 1.26 m/s, a_max = 15.8 m/s^2",
  },
  {
    title: "Comparing Two Springs",
    problem: "Spring A (k = 100 N/m) has a 2 kg mass. Spring B (k = 400 N/m) has an 8 kg mass. Which has the longer period?",
    steps: [
      "T_A = 2pi*sqrt(m_A/k_A) = 2pi*sqrt(2/100) = 2pi*sqrt(0.02) = 2pi*0.1414 = 0.889 s",
      "T_B = 2pi*sqrt(m_B/k_B) = 2pi*sqrt(8/400) = 2pi*sqrt(0.02) = 2pi*0.1414 = 0.889 s",
      "Both have the same period! The ratio m/k is the same for both.",
    ],
    answer: "Both periods are equal: T_A = T_B = 0.889 s. The m/k ratio determines the period.",
  },
];

export function WorkedExamples({
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
            <CardTitle>Worked Examples: Oscillations</CardTitle>
            {isComplete && <Badge variant="secondary">Completed</Badge>}
          </div>
          <CardDescription>
            Step-by-step solutions to common oscillation problems.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Accordion>
            {examples.map((ex, i) => (
              <AccordionItem key={i} value={`ex-${i}`}>
                <AccordionTrigger>
                  <span className="text-left">
                    <span className="font-bold">Example {i + 1}:</span> {ex.title}
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3">
                    <Card className="bg-slate-50 dark:bg-slate-900/40">
                      <CardContent className="pt-4">
                        <p className="font-medium">Problem</p>
                        <p className="text-sm mt-1">{ex.problem}</p>
                      </CardContent>
                    </Card>
                    <div>
                      <p className="font-medium text-sm mb-2">Solution Steps</p>
                      {ex.steps.map((step, j) => (
                        <div key={j} className="ml-2 mb-1 flex gap-1">
                          <span className="text-sm">{j + 1}.</span>
                          <PhysicsText className="text-sm">{step}</PhysicsText>
                        </div>
                      ))}
                    </div>
                    <Separator />
                    <p className="font-bold text-green-700">{ex.answer}</p>
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
