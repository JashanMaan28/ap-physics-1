"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface Formula {
  name: string;
  formula: string;
  variables: string;
  notes: string;
}

const formulas: Formula[] = [
  { name: "Work", formula: "W = Fd cos\u03b8", variables: "F = force (N), d = displacement (m), \u03b8 = angle between F and d", notes: "Positive when force aids motion, negative when opposing, zero when perpendicular." },
  { name: "Kinetic Energy", formula: "KE = \u00bdmv\u00b2", variables: "m = mass (kg), v = speed (m/s)", notes: "Always non-negative. Doubles mass = doubles KE. Doubles speed = quadruples KE." },
  { name: "Gravitational PE", formula: "PE = mgh", variables: "m = mass (kg), g = 9.8 m/s\u00b2, h = height (m)", notes: "Relative to chosen reference level. Can be negative if below reference." },
  { name: "Elastic PE", formula: "PE = \u00bdkx\u00b2", variables: "k = spring constant (N/m), x = displacement from equilibrium (m)", notes: "Always non-negative. Same for compression and extension of equal magnitude." },
  { name: "Work-Energy Theorem", formula: "W_net = \u0394KE = KE_f \u2212 KE_i", variables: "W_net = net work done on object", notes: "Connects forces (via work) to motion (via KE)." },
  { name: "Conservation of Energy", formula: "KE_i + PE_i = KE_f + PE_f", variables: "(when only conservative forces act)", notes: "Total mechanical energy is constant. Add W_nc term if non-conservative forces present." },
  { name: "Energy with Friction", formula: "KE_i + PE_i + W_nc = KE_f + PE_f", variables: "W_nc = work by non-conservative forces (negative for friction)", notes: "W_friction = \u2212\u03bc_k \u00b7 N \u00b7 d. Energy is lost to thermal energy." },
  { name: "Power (average)", formula: "P = W / t", variables: "W = work (J), t = time (s)", notes: "Average power over a time interval." },
  { name: "Power (instantaneous)", formula: "P = Fv", variables: "F = force (N), v = velocity (m/s)", notes: "When force is along the direction of velocity." },
  { name: "Hooke\u2019s Law", formula: "F = \u2212kx", variables: "k = spring constant (N/m), x = displacement (m)", notes: "Restoring force. Negative sign indicates force opposes displacement." },
];

const constants = [
  { symbol: "g", value: "9.8 m/s\u00b2", name: "Gravitational acceleration (Earth surface)" },
  { symbol: "1 hp", value: "746 W", name: "Horsepower" },
  { symbol: "1 kWh", value: "3.6 \u00d7 10\u2076 J", name: "Kilowatt-hour" },
  { symbol: "1 Cal", value: "4186 J", name: "Food calorie" },
];

export function FormulaSheet() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Formula Sheet: Work, Energy, and Power</CardTitle>
          <CardDescription>
            All key formulas and constants for Unit 3.
          </CardDescription>
        </CardHeader>
      </Card>

      {formulas.map((f, i) => (
        <Card key={i}>
          <CardContent className="pt-4">
            <div className="flex items-start justify-between">
              <div>
                <Badge variant="outline" className="mb-2">
                  {f.name}
                </Badge>
                <p className="text-2xl font-mono font-bold text-amber-700">
                  {f.formula}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {f.variables}
                </p>
                <p className="text-sm text-gray-600 mt-1 italic">{f.notes}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Useful Constants</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {constants.map((c, i) => (
              <div key={i} className="flex items-center gap-3 p-2 rounded bg-gray-50">
                <Badge variant="secondary" className="font-mono">
                  {c.symbol}
                </Badge>
                <div>
                  <p className="font-mono text-sm font-semibold">{c.value}</p>
                  <p className="text-xs text-muted-foreground">{c.name}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
