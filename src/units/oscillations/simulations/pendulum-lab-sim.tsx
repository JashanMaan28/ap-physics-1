"use client";

import { PhETEmbed } from "@/components/simulations/phet-embed";
import { getSimulationManifestBySimId } from "@/lib/simulation-manifests";

export function PendulumLabSim() {
  return (
    <PhETEmbed
      predictionManifest={getSimulationManifestBySimId("pendulum-lab-phet")}
      title="Pendulum Lab"
      simUrl="https://phet.colorado.edu/sims/html/pendulum-lab/latest/pendulum-lab_en.html"
      description="Adjust pendulum length, mass, and gravity to explore simple harmonic motion and period relationships."
      tips={[
        "Change length and observe: T = 2π√(L/g) — period depends on length, not mass",
        "Try different planets (Moon, Jupiter) to see how gravity affects the period",
        "Use small angles (<15°) to see true SHM — large angles deviate from the formula",
        "Enable the energy graph to watch KE ↔ PE conversion",
      ]}
    />
  );
}
