"use client";

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";

export function ConceptMap() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Concept Map: Dynamics</CardTitle>
          <CardDescription>
            How the key concepts in force and translational dynamics connect to each other.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border bg-white p-2 overflow-x-auto">
            <svg viewBox="0 0 700 480" className="w-full min-w-[600px]">
              {/* Central node: Forces */}
              <rect x="280" y="20" width="140" height="50" rx="10" fill="#ef4444" />
              <text x="350" y="50" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold">Forces</text>

              {/* Newton's Laws */}
              <rect x="130" y="120" width="160" height="45" rx="8" fill="#3b82f6" />
              <text x="210" y="148" textAnchor="middle" fill="white" fontSize="13" fontWeight="bold">Newton&apos;s Laws</text>

              {/* F=ma */}
              <rect x="420" y="120" width="140" height="45" rx="8" fill="#3b82f6" />
              <text x="490" y="148" textAnchor="middle" fill="white" fontSize="13" fontWeight="bold">F = ma</text>

              {/* Friction */}
              <rect x="30" y="220" width="140" height="45" rx="8" fill="#f59e0b" />
              <text x="100" y="248" textAnchor="middle" fill="white" fontSize="13" fontWeight="bold">Friction</text>

              {/* Tension */}
              <rect x="220" y="220" width="140" height="45" rx="8" fill="#f59e0b" />
              <text x="290" y="248" textAnchor="middle" fill="white" fontSize="13" fontWeight="bold">Tension</text>

              {/* Normal Force */}
              <rect x="410" y="220" width="150" height="45" rx="8" fill="#f59e0b" />
              <text x="485" y="248" textAnchor="middle" fill="white" fontSize="13" fontWeight="bold">Normal Force</text>

              {/* Weight */}
              <rect x="590" y="220" width="100" height="45" rx="8" fill="#f59e0b" />
              <text x="640" y="248" textAnchor="middle" fill="white" fontSize="13" fontWeight="bold">Weight</text>

              {/* Inclined Planes */}
              <rect x="80" y="330" width="160" height="45" rx="8" fill="#22c55e" />
              <text x="160" y="358" textAnchor="middle" fill="white" fontSize="13" fontWeight="bold">Inclined Planes</text>

              {/* Atwood Machines */}
              <rect x="300" y="330" width="170" height="45" rx="8" fill="#22c55e" />
              <text x="385" y="358" textAnchor="middle" fill="white" fontSize="13" fontWeight="bold">Atwood Machines</text>

              {/* Equilibrium */}
              <rect x="530" y="330" width="140" height="45" rx="8" fill="#8b5cf6" />
              <text x="600" y="358" textAnchor="middle" fill="white" fontSize="13" fontWeight="bold">Equilibrium</text>

              {/* Free-Body Diagrams */}
              <rect x="250" y="430" width="200" height="45" rx="8" fill="#ec4899" />
              <text x="350" y="458" textAnchor="middle" fill="white" fontSize="13" fontWeight="bold">Free-Body Diagrams</text>

              {/* Connections */}
              {/* Forces → Newton's Laws */}
              <line x1="310" y1="70" x2="230" y2="120" stroke="#64748b" strokeWidth="2" markerEnd="url(#arrowMap)" />
              {/* Forces → F=ma */}
              <line x1="390" y1="70" x2="470" y2="120" stroke="#64748b" strokeWidth="2" markerEnd="url(#arrowMap)" />

              {/* Newton's Laws → Friction */}
              <line x1="180" y1="165" x2="120" y2="220" stroke="#64748b" strokeWidth="1.5" markerEnd="url(#arrowMap)" />
              {/* Newton's Laws → Tension */}
              <line x1="230" y1="165" x2="270" y2="220" stroke="#64748b" strokeWidth="1.5" markerEnd="url(#arrowMap)" />

              {/* F=ma → Normal Force */}
              <line x1="490" y1="165" x2="485" y2="220" stroke="#64748b" strokeWidth="1.5" markerEnd="url(#arrowMap)" />
              {/* F=ma → Weight */}
              <line x1="520" y1="165" x2="620" y2="220" stroke="#64748b" strokeWidth="1.5" markerEnd="url(#arrowMap)" />

              {/* Friction → Inclined Planes */}
              <line x1="100" y1="265" x2="140" y2="330" stroke="#64748b" strokeWidth="1.5" markerEnd="url(#arrowMap)" />
              {/* Normal → Inclined Planes */}
              <line x1="440" y1="265" x2="200" y2="330" stroke="#64748b" strokeWidth="1.5" strokeDasharray="4,3" markerEnd="url(#arrowMap)" />

              {/* Tension → Atwood */}
              <line x1="310" y1="265" x2="360" y2="330" stroke="#64748b" strokeWidth="1.5" markerEnd="url(#arrowMap)" />
              {/* Weight → Atwood */}
              <line x1="620" y1="265" x2="420" y2="330" stroke="#64748b" strokeWidth="1.5" strokeDasharray="4,3" markerEnd="url(#arrowMap)" />

              {/* Newton's Laws → Equilibrium */}
              <line x1="270" y1="165" x2="570" y2="330" stroke="#64748b" strokeWidth="1.5" strokeDasharray="4,3" markerEnd="url(#arrowMap)" />

              {/* All applications → FBD */}
              <line x1="160" y1="375" x2="300" y2="430" stroke="#94a3b8" strokeWidth="1" markerEnd="url(#arrowMap)" />
              <line x1="385" y1="375" x2="370" y2="430" stroke="#94a3b8" strokeWidth="1" markerEnd="url(#arrowMap)" />
              <line x1="600" y1="375" x2="420" y2="430" stroke="#94a3b8" strokeWidth="1" markerEnd="url(#arrowMap)" />

              <defs>
                <marker id="arrowMap" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
                  <path d="M0,0 L8,3 L0,6 Z" fill="#64748b" />
                </marker>
              </defs>
            </svg>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
