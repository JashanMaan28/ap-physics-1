"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface FormulaEntry {
  formula: string;
  name: string;
  variables: string;
  notes?: string;
}

interface FormulaSection {
  title: string;
  color: string;
  formulas: FormulaEntry[];
}

const sections: FormulaSection[] = [
  {
    title: "Torque",
    color: "#ec4899",
    formulas: [
      { formula: "\u03C4 = rF sin\u03B8", name: "Torque", variables: "r = lever arm (m), F = force (N), \u03B8 = angle between r and F", notes: "Max when \u03B8 = 90\u00B0" },
      { formula: "\u03C4 = r\u22A5 F = r F\u22A5", name: "Torque (component form)", variables: "r\u22A5 = moment arm, F\u22A5 = perpendicular force component" },
    ],
  },
  {
    title: "Rotational Equilibrium",
    color: "#3b82f6",
    formulas: [
      { formula: "\u03A3\u03C4 = 0", name: "Rotational equilibrium", variables: "Sum of all torques about any point", notes: "CCW positive, CW negative" },
      { formula: "\u03A3F = 0 and \u03A3\u03C4 = 0", name: "Static equilibrium", variables: "Both conditions must hold simultaneously" },
    ],
  },
  {
    title: "Moment of Inertia",
    color: "#22c55e",
    formulas: [
      { formula: "I = \u03A3m\u1D62r\u1D62\u00B2", name: "Moment of inertia (discrete)", variables: "m\u1D62 = mass of particle i, r\u1D62 = distance from axis" },
      { formula: "I = (1/2)MR\u00B2", name: "Solid disk/cylinder", variables: "Axis through center, perpendicular to face" },
      { formula: "I = MR\u00B2", name: "Hoop/ring", variables: "Axis through center, perpendicular to plane" },
      { formula: "I = (2/5)MR\u00B2", name: "Solid sphere", variables: "Axis through center" },
      { formula: "I = (2/3)MR\u00B2", name: "Hollow sphere (thin shell)", variables: "Axis through center" },
      { formula: "I = (1/12)ML\u00B2", name: "Rod (center pivot)", variables: "Axis through center, perpendicular to length" },
      { formula: "I = (1/3)ML\u00B2", name: "Rod (end pivot)", variables: "Axis through one end, perpendicular to length" },
      { formula: "I = I_cm + Md\u00B2", name: "Parallel axis theorem", variables: "d = distance from CM to new axis" },
    ],
  },
  {
    title: "Newton's Second Law (Rotation)",
    color: "#f97316",
    formulas: [
      { formula: "\u03A3\u03C4 = I\u03B1", name: "Newton's 2nd for rotation", variables: "\u03C4 = net torque, I = moment of inertia, \u03B1 = angular acceleration" },
    ],
  },
  {
    title: "Angular Kinematics (constant \u03B1)",
    color: "#a855f7",
    formulas: [
      { formula: "\u03C9 = \u03C9\u2080 + \u03B1t", name: "Angular velocity", variables: "Analog of v = v\u2080 + at" },
      { formula: "\u03B8 = \u03C9\u2080t + (1/2)\u03B1t\u00B2", name: "Angular displacement", variables: "Analog of x = v\u2080t + (1/2)at\u00B2" },
      { formula: "\u03C9\u00B2 = \u03C9\u2080\u00B2 + 2\u03B1\u03B8", name: "Time-independent", variables: "Analog of v\u00B2 = v\u2080\u00B2 + 2ax" },
      { formula: "\u03B8 = (\u03C9\u2080 + \u03C9)/2 \u00D7 t", name: "Average angular velocity", variables: "Only valid for constant \u03B1" },
    ],
  },
  {
    title: "Linear-Angular Relationships",
    color: "#06b6d4",
    formulas: [
      { formula: "s = r\u03B8", name: "Arc length", variables: "\u03B8 in radians" },
      { formula: "v = r\u03C9", name: "Tangential velocity", variables: "Speed of point at distance r from axis" },
      { formula: "a_t = r\u03B1", name: "Tangential acceleration", variables: "Linear acceleration from angular acceleration" },
      { formula: "a_c = \u03C9\u00B2r = v\u00B2/r", name: "Centripetal acceleration", variables: "Points toward center of rotation" },
      { formula: "v_cm = R\u03C9", name: "Rolling without slipping", variables: "R = radius of rolling object" },
    ],
  },
];

export function FormulaSheet() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Formula Sheet: Torque & Rotational Dynamics</CardTitle>
          <CardDescription>
            All essential formulas for Unit 5 in one place. Print-friendly reference.
          </CardDescription>
        </CardHeader>
      </Card>

      {sections.map((section) => (
        <Card key={section.title}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: section.color }} />
              {section.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {section.formulas.map((f, i) => (
                <div key={i}>
                  {i > 0 && <Separator className="mb-4" />}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <p className="font-mono text-lg font-bold" style={{ color: section.color }}>
                        {f.formula}
                      </p>
                      <p className="text-sm font-medium mt-1">{f.name}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{f.variables}</p>
                    </div>
                    {f.notes && (
                      <Badge variant="outline" className="text-xs shrink-0">
                        {f.notes}
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
