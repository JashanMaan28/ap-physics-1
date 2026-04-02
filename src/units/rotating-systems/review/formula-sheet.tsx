"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface FormulaEntry {
  name: string;
  formula: string;
  units: string;
  notes: string;
}

const sections: { title: string; formulas: FormulaEntry[] }[] = [
  {
    title: "Rotational Kinetic Energy",
    formulas: [
      {
        name: "Rotational KE",
        formula: "KE_rot = (1/2)Iω²",
        units: "J",
        notes: "Analogous to (1/2)mv²",
      },
      {
        name: "KE from angular momentum",
        formula: "KE = L²/(2I)",
        units: "J",
        notes: "Useful when L is known/conserved",
      },
    ],
  },
  {
    title: "Moments of Inertia",
    formulas: [
      { name: "Solid cylinder/disk", formula: "I = (1/2)MR²", units: "kg·m²", notes: "Axis through center" },
      { name: "Solid sphere", formula: "I = (2/5)MR²", units: "kg·m²", notes: "Axis through center" },
      { name: "Thin hoop/ring", formula: "I = MR²", units: "kg·m²", notes: "Axis through center" },
      { name: "Hollow sphere", formula: "I = (2/3)MR²", units: "kg·m²", notes: "Thin shell" },
      { name: "Thin rod (center)", formula: "I = (1/12)ML²", units: "kg·m²", notes: "Axis through midpoint" },
      { name: "Thin rod (end)", formula: "I = (1/3)ML²", units: "kg·m²", notes: "Axis through one end" },
      { name: "Parallel axis theorem", formula: "I = I_cm + Md²", units: "kg·m²", notes: "d = distance from cm axis" },
      { name: "Point mass", formula: "I = mr²", units: "kg·m²", notes: "r = distance from axis" },
    ],
  },
  {
    title: "Angular Momentum",
    formulas: [
      { name: "Angular momentum", formula: "L = Iω", units: "kg·m²/s", notes: "Rotational analog of p = mv" },
      { name: "Angular impulse", formula: "τΔt = ΔL", units: "kg·m²/s", notes: "Rotational analog of FΔt = Δp" },
      { name: "Point particle", formula: "L = mvr sinθ", units: "kg·m²/s", notes: "r = distance to axis, θ = angle between v and r" },
    ],
  },
  {
    title: "Conservation Laws",
    formulas: [
      { name: "Conservation of L", formula: "I₁ω₁ = I₂ω₂", units: "—", notes: "When Σ τ_ext = 0" },
      { name: "Energy conservation (rolling)", formula: "mgh = (1/2)mv² + (1/2)Iω²", units: "J", notes: "PE converts to trans + rot KE" },
    ],
  },
  {
    title: "Rolling Motion",
    formulas: [
      { name: "Rolling constraint", formula: "v = Rω", units: "m/s", notes: "No slipping at contact" },
      { name: "Total KE (rolling)", formula: "KE = (1/2)mv² + (1/2)Iω²", units: "J", notes: "Translation + rotation" },
      { name: "Speed down incline", formula: "v = √(2gh/(1+c))", units: "m/s", notes: "I = cmR²; shape factor c" },
      { name: "Acceleration down incline", formula: "a = g sinθ/(1+c)", units: "m/s²", notes: "c = I/(mR²)" },
    ],
  },
  {
    title: "Combined Translation + Rotation",
    formulas: [
      { name: "Newton's 2nd (translation)", formula: "ΣF = ma", units: "N", notes: "For translating mass" },
      { name: "Newton's 2nd (rotation)", formula: "Στ = Iα", units: "N·m", notes: "For rotating object" },
      { name: "String constraint", formula: "a = Rα", units: "m/s²", notes: "String doesn't slip on pulley" },
      { name: "Atwood + pulley", formula: "a = (m₂-m₁)g/(m₁+m₂+M/2)", units: "m/s²", notes: "Solid disk pulley mass M" },
    ],
  },
];

export function FormulaSheet() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-teal-400">Formula Sheet</h2>
        <Badge className="bg-teal-900 text-teal-300">Unit 6</Badge>
      </div>

      <p className="text-gray-400 text-sm">
        All key formulas for Energy and Momentum of Rotating Systems. Print or
        bookmark this page for quick reference.
      </p>

      {sections.map((section) => (
        <Card key={section.title} className="bg-gray-900 border-gray-700">
          <CardHeader>
            <CardTitle className="text-teal-300 text-lg">
              {section.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left text-gray-400 py-2 pr-4">Name</th>
                    <th className="text-left text-gray-400 py-2 pr-4">Formula</th>
                    <th className="text-left text-gray-400 py-2 pr-4">Units</th>
                    <th className="text-left text-gray-400 py-2">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {section.formulas.map((f) => (
                    <tr key={f.name} className="border-b border-gray-800">
                      <td className="text-gray-300 py-2 pr-4">{f.name}</td>
                      <td className="text-teal-300 font-mono py-2 pr-4">
                        {f.formula}
                      </td>
                      <td className="text-gray-500 py-2 pr-4">{f.units}</td>
                      <td className="text-gray-500 py-2">{f.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
