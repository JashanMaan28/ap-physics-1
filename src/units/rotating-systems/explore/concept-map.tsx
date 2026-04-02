"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ConceptMap() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-teal-400">Concept Map</h2>
      <p className="text-gray-400 text-sm">
        Visual overview of how rotating systems concepts connect to each other.
      </p>

      <Card className="bg-gray-900 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">
            Energy and Momentum of Rotating Systems
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center overflow-x-auto">
            <svg width="700" height="520" viewBox="0 0 700 520">
              {/* Central node */}
              <rect x="250" y="10" width="200" height="50" rx="10" fill="#0f766e" />
              <text x="350" y="40" textAnchor="middle" fill="white" fontSize="13" fontWeight="bold">
                Rotating Systems
              </text>

              {/* Branch: Rotational KE */}
              <line x1="300" y1="60" x2="120" y2="130" stroke="#14b8a6" strokeWidth="2" />
              <rect x="20" y="110" width="200" height="45" rx="8" fill="#115e59" />
              <text x="120" y="137" textAnchor="middle" fill="#5eead4" fontSize="12" fontWeight="bold">
                Rotational KE
              </text>
              {/* Sub-nodes */}
              <line x1="80" y1="155" x2="50" y2="195" stroke="#0d9488" strokeWidth="1" />
              <rect x="5" y="185" width="100" height="30" rx="5" fill="#1f2937" stroke="#0d9488" strokeWidth="1" />
              <text x="55" y="204" textAnchor="middle" fill="#99f6e4" fontSize="9">KE = (1/2)Iw²</text>

              <line x1="160" y1="155" x2="180" y2="195" stroke="#0d9488" strokeWidth="1" />
              <rect x="120" y="185" width="120" height="30" rx="5" fill="#1f2937" stroke="#0d9488" strokeWidth="1" />
              <text x="180" y="204" textAnchor="middle" fill="#99f6e4" fontSize="9">Moments of Inertia</text>

              {/* Branch: Angular Momentum */}
              <line x1="400" y1="60" x2="560" y2="130" stroke="#14b8a6" strokeWidth="2" />
              <rect x="460" y="110" width="200" height="45" rx="8" fill="#115e59" />
              <text x="560" y="137" textAnchor="middle" fill="#5eead4" fontSize="12" fontWeight="bold">
                Angular Momentum
              </text>
              <line x1="520" y1="155" x2="490" y2="195" stroke="#0d9488" strokeWidth="1" />
              <rect x="440" y="185" width="100" height="30" rx="5" fill="#1f2937" stroke="#0d9488" strokeWidth="1" />
              <text x="490" y="204" textAnchor="middle" fill="#99f6e4" fontSize="9">L = Iw</text>

              <line x1="600" y1="155" x2="620" y2="195" stroke="#0d9488" strokeWidth="1" />
              <rect x="565" y="185" width="110" height="30" rx="5" fill="#1f2937" stroke="#0d9488" strokeWidth="1" />
              <text x="620" y="204" textAnchor="middle" fill="#99f6e4" fontSize="9">tw = DL (impulse)</text>

              {/* Branch: Conservation */}
              <line x1="350" y1="60" x2="350" y2="270" stroke="#14b8a6" strokeWidth="2" />
              <rect x="250" y="270" width="200" height="45" rx="8" fill="#115e59" />
              <text x="350" y="297" textAnchor="middle" fill="#5eead4" fontSize="12" fontWeight="bold">
                Conservation of L
              </text>
              <line x1="300" y1="315" x2="220" y2="355" stroke="#0d9488" strokeWidth="1" />
              <rect x="140" y="345" width="160" height="30" rx="5" fill="#1f2937" stroke="#0d9488" strokeWidth="1" />
              <text x="220" y="364" textAnchor="middle" fill="#99f6e4" fontSize="9">I1w1 = I2w2 (no ext torque)</text>

              <line x1="400" y1="315" x2="480" y2="355" stroke="#0d9488" strokeWidth="1" />
              <rect x="420" y="345" width="130" height="30" rx="5" fill="#1f2937" stroke="#0d9488" strokeWidth="1" />
              <text x="485" y="364" textAnchor="middle" fill="#99f6e4" fontSize="9">Collisions (inelastic)</text>

              {/* Branch: Rolling Motion */}
              <line x1="120" y1="215" x2="120" y2="390" stroke="#14b8a6" strokeWidth="1" strokeDasharray="4" />
              <rect x="20" y="390" width="200" height="45" rx="8" fill="#115e59" />
              <text x="120" y="417" textAnchor="middle" fill="#5eead4" fontSize="12" fontWeight="bold">
                Rolling Motion
              </text>
              <line x1="80" y1="435" x2="60" y2="470" stroke="#0d9488" strokeWidth="1" />
              <rect x="5" y="462" width="110" height="30" rx="5" fill="#1f2937" stroke="#0d9488" strokeWidth="1" />
              <text x="60" y="481" textAnchor="middle" fill="#99f6e4" fontSize="9">v = Rw constraint</text>

              <line x1="160" y1="435" x2="185" y2="470" stroke="#0d9488" strokeWidth="1" />
              <rect x="125" y="462" width="120" height="30" rx="5" fill="#1f2937" stroke="#0d9488" strokeWidth="1" />
              <text x="185" y="481" textAnchor="middle" fill="#99f6e4" fontSize="9">KE = trans + rot</text>

              {/* Branch: Combined */}
              <line x1="560" y1="215" x2="560" y2="390" stroke="#14b8a6" strokeWidth="1" strokeDasharray="4" />
              <rect x="460" y="390" width="200" height="45" rx="8" fill="#115e59" />
              <text x="560" y="417" textAnchor="middle" fill="#5eead4" fontSize="12" fontWeight="bold">
                Combined Systems
              </text>
              <line x1="520" y1="435" x2="490" y2="470" stroke="#0d9488" strokeWidth="1" />
              <rect x="430" y="462" width="120" height="30" rx="5" fill="#1f2937" stroke="#0d9488" strokeWidth="1" />
              <text x="490" y="481" textAnchor="middle" fill="#99f6e4" fontSize="9">Pulleys / Atwood</text>

              <line x1="600" y1="435" x2="630" y2="470" stroke="#0d9488" strokeWidth="1" />
              <rect x="580" y="462" width="100" height="30" rx="5" fill="#1f2937" stroke="#0d9488" strokeWidth="1" />
              <text x="630" y="481" textAnchor="middle" fill="#99f6e4" fontSize="9">Yo-Yo / Spool</text>

              {/* Cross-links */}
              <line x1="220" y1="135" x2="460" y2="135" stroke="#f59e0b" strokeWidth="1" strokeDasharray="6 3" opacity="0.4" />
              <text x="340" y="128" textAnchor="middle" fill="#f59e0b" fontSize="8" opacity="0.6">
                KE = L²/(2I)
              </text>
            </svg>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gray-900 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white text-base">Key Connections</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-gray-300 text-sm">
          <p><strong className="text-teal-300">KE and L:</strong> KE = L²/(2I) links energy and momentum. When L is conserved and I changes, KE must change.</p>
          <p><strong className="text-teal-300">Rolling = KE + Constraint:</strong> Rolling motion combines translational and rotational KE with the v = Rw constraint.</p>
          <p><strong className="text-teal-300">Combined Systems:</strong> Pulleys and yo-yos use both SF = ma and St = Ia, linked by a = Ra.</p>
          <p><strong className="text-teal-300">Conservation:</strong> Angular momentum conservation applies whenever there is no net external torque, analogous to linear momentum conservation with no net external force.</p>
        </CardContent>
      </Card>
    </div>
  );
}
