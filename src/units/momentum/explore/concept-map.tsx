"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function ConceptMap() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Concept Map: Linear Momentum</CardTitle>
          <CardDescription>How all the momentum concepts connect</CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardContent className="pt-6 flex justify-center">
          <svg width="700" height="520" viewBox="0 0 700 520">
            {/* Central node */}
            <rect x="260" y="20" width="180" height="50" rx="12" fill="#8b5cf6" />
            <text x="350" y="50" textAnchor="middle" fill="white" fontSize="15" fontWeight="bold">
              Linear Momentum
            </text>
            <text x="350" y="65" textAnchor="middle" fill="white" fontSize="11">p = mv</text>

            {/* Impulse node */}
            <rect x="50" y="130" width="160" height="50" rx="12" fill="#3b82f6" />
            <text x="130" y="155" textAnchor="middle" fill="white" fontSize="13" fontWeight="bold">Impulse</text>
            <text x="130" y="170" textAnchor="middle" fill="white" fontSize="10">J = FΔt = Δp</text>

            {/* Conservation node */}
            <rect x="490" y="130" width="180" height="50" rx="12" fill="#3b82f6" />
            <text x="580" y="155" textAnchor="middle" fill="white" fontSize="13" fontWeight="bold">Conservation of p</text>
            <text x="580" y="170" textAnchor="middle" fill="white" fontSize="10">Σp_i = Σp_f</text>

            {/* Newton's 2nd Law */}
            <rect x="30" y="240" width="170" height="45" rx="10" fill="#22c55e" />
            <text x="115" y="262" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">Newton&apos;s 2nd Law</text>
            <text x="115" y="277" textAnchor="middle" fill="white" fontSize="10">F = dp/dt</text>

            {/* Elastic */}
            <rect x="370" y="240" width="150" height="50" rx="10" fill="#f59e0b" />
            <text x="445" y="262" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">Elastic Collision</text>
            <text x="445" y="277" textAnchor="middle" fill="white" fontSize="10">KE conserved</text>

            {/* Inelastic */}
            <rect x="550" y="240" width="140" height="50" rx="10" fill="#ef4444" />
            <text x="620" y="262" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">Inelastic</text>
            <text x="620" y="277" textAnchor="middle" fill="white" fontSize="10">KE NOT conserved</text>

            {/* Perfectly Inelastic */}
            <rect x="530" y="340" width="170" height="45" rx="10" fill="#dc2626" />
            <text x="615" y="362" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold">Perfectly Inelastic</text>
            <text x="615" y="377" textAnchor="middle" fill="white" fontSize="10">Objects stick: max KE loss</text>

            {/* Applications */}
            <rect x="50" y="340" width="150" height="45" rx="10" fill="#06b6d4" />
            <text x="125" y="362" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">Applications</text>
            <text x="125" y="377" textAnchor="middle" fill="white" fontSize="10">Airbags, padding</text>

            {/* Explosions */}
            <rect x="250" y="340" width="150" height="45" rx="10" fill="#a855f7" />
            <text x="325" y="362" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">Explosions/Recoil</text>
            <text x="325" y="377" textAnchor="middle" fill="white" fontSize="10">p_i = 0, Σp_f = 0</text>

            {/* Kinetic Energy */}
            <rect x="350" y="440" width="160" height="45" rx="10" fill="#f97316" />
            <text x="430" y="462" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">Kinetic Energy</text>
            <text x="430" y="477" textAnchor="middle" fill="white" fontSize="10">KE = ½mv²</text>

            {/* Connection lines */}
            {/* Momentum → Impulse */}
            <line x1="280" y1="70" x2="170" y2="130" stroke="#666" strokeWidth="2" />
            {/* Momentum → Conservation */}
            <line x1="420" y1="70" x2="540" y2="130" stroke="#666" strokeWidth="2" />
            {/* Impulse → Newton */}
            <line x1="115" y1="180" x2="115" y2="240" stroke="#666" strokeWidth="1.5" strokeDasharray="6" />
            {/* Conservation → Elastic */}
            <line x1="530" y1="180" x2="445" y2="240" stroke="#666" strokeWidth="2" />
            {/* Conservation → Inelastic */}
            <line x1="600" y1="180" x2="620" y2="240" stroke="#666" strokeWidth="2" />
            {/* Inelastic → Perfectly Inelastic */}
            <line x1="620" y1="290" x2="615" y2="340" stroke="#666" strokeWidth="1.5" />
            {/* Impulse → Applications */}
            <line x1="125" y1="180" x2="125" y2="340" stroke="#666" strokeWidth="1.5" strokeDasharray="6" />
            {/* Conservation → Explosions */}
            <line x1="520" y1="180" x2="325" y2="340" stroke="#666" strokeWidth="1.5" strokeDasharray="6" />
            {/* Elastic → KE */}
            <line x1="445" y1="290" x2="430" y2="440" stroke="#666" strokeWidth="1.5" strokeDasharray="6" />
            {/* Inelastic → KE */}
            <line x1="600" y1="290" x2="470" y2="440" stroke="#666" strokeWidth="1.5" strokeDasharray="6" />

            {/* Edge labels */}
            <text x="210" y="100" fill="#888" fontSize="10" textAnchor="middle">J = Δp</text>
            <text x="490" y="100" fill="#888" fontSize="10" textAnchor="middle">isolated system</text>
            <text x="475" y="215" fill="#888" fontSize="10" textAnchor="middle">bounce</text>
            <text x="620" y="215" fill="#888" fontSize="10" textAnchor="middle">stick/deform</text>
            <text x="630" y="320" fill="#888" fontSize="10" textAnchor="middle">stick together</text>
          </svg>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Key Connections</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex gap-2 items-start">
            <Badge className="bg-purple-500 shrink-0">p = mv</Badge>
            <p>Momentum is the central concept. Everything branches from it.</p>
          </div>
          <div className="flex gap-2 items-start">
            <Badge className="bg-blue-500 shrink-0">J = Δp</Badge>
            <p>Impulse connects force (Newton&apos;s Laws) to momentum change.</p>
          </div>
          <div className="flex gap-2 items-start">
            <Badge className="bg-blue-500 shrink-0">Conservation</Badge>
            <p>Isolated systems conserve momentum, leading to collision analysis.</p>
          </div>
          <div className="flex gap-2 items-start">
            <Badge className="bg-amber-500 shrink-0">Elastic</Badge>
            <p>Special case: both momentum and KE conserved.</p>
          </div>
          <div className="flex gap-2 items-start">
            <Badge className="bg-red-500 shrink-0">Inelastic</Badge>
            <p>General case: only momentum conserved. KE lost to heat/sound/deformation.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default ConceptMap;
