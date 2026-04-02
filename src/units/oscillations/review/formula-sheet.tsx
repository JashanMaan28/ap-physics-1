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

const formulas = [
  {
    category: "SHM Kinematics",
    items: [
      { name: "Position", formula: "x(t) = A cos(omega*t + phi)", notes: "A = amplitude, phi = phase constant" },
      { name: "Velocity", formula: "v(t) = -A*omega*sin(omega*t + phi)", notes: "v_max = A*omega at x = 0" },
      { name: "Acceleration", formula: "a(t) = -A*omega^2*cos(omega*t + phi)", notes: "a_max = A*omega^2 at x = +/-A" },
      { name: "Acceleration-Position", formula: "a = -omega^2 * x", notes: "Defines SHM; a is always opposite to x" },
    ],
  },
  {
    category: "Period & Frequency",
    items: [
      { name: "Angular frequency", formula: "omega = 2*pi*f = 2*pi/T", notes: "Units: rad/s" },
      { name: "Spring-mass period", formula: "T = 2*pi*sqrt(m/k)", notes: "Independent of amplitude" },
      { name: "Pendulum period", formula: "T = 2*pi*sqrt(L/g)", notes: "Small angles only; independent of mass" },
      { name: "Frequency", formula: "f = 1/T", notes: "Units: Hz (cycles per second)" },
    ],
  },
  {
    category: "Energy",
    items: [
      { name: "Total energy", formula: "E = 1/2 * k * A^2", notes: "Constant for undamped SHM" },
      { name: "Potential energy (spring)", formula: "PE = 1/2 * k * x^2", notes: "Max at x = +/-A" },
      { name: "Kinetic energy", formula: "KE = 1/2 * m * v^2 = E - PE", notes: "Max at x = 0" },
      { name: "KE = PE condition", formula: "x = A / sqrt(2)", notes: "Approximately 0.707*A" },
    ],
  },
  {
    category: "Springs",
    items: [
      { name: "Hooke's Law", formula: "F = -kx", notes: "Restoring force; k in N/m" },
      { name: "Springs in parallel", formula: "k_eff = k1 + k2", notes: "Same displacement, forces add" },
      { name: "Springs in series", formula: "1/k_eff = 1/k1 + 1/k2", notes: "Same force, displacements add" },
    ],
  },
];

export function FormulaSheet({
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
            <CardTitle>Formula Sheet: Oscillations</CardTitle>
            {isComplete && <Badge variant="secondary">Completed</Badge>}
          </div>
          <CardDescription>
            All key oscillation formulas organized by topic.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {formulas.map((section) => (
            <div key={section.category}>
              <h3 className="font-bold text-lg mb-3 text-cyan-800">
                {section.category}
              </h3>
              <div className="space-y-2">
                {section.items.map((item) => (
                  <Card key={item.name} className="bg-slate-50">
                    <CardContent className="pt-3 pb-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">
                            {item.name}
                          </p>
                          <p className="text-lg font-mono font-semibold">
                            {item.formula}
                          </p>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {item.notes}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <Separator className="mt-4" />
            </div>
          ))}

          <Button onClick={onComplete} disabled={isComplete} className="w-full">
            {isComplete ? "Completed" : "Mark Complete"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
