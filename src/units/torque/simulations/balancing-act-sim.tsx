"use client";

import { PhETEmbed } from "@/components/simulations/phet-embed";
import { getSimulationManifestBySimId } from "@/lib/simulation-manifests";

export function BalancingActSim() {
  return (
    <PhETEmbed
      predictionManifest={getSimulationManifestBySimId("balancing-act-phet")}
      title="Balancing Act"
      simUrl="https://phet.colorado.edu/sims/html/balancing-act/latest/balancing-act_en.html"
      description="Place masses on a seesaw and find the balance point. Explore torque, rotational equilibrium, and the lever principle."
      tips={[
        "Place a heavy mass close to the pivot and a light mass far away to balance",
        "Use the 'Balance Lab' tab to experiment freely with different masses",
        "Try the 'Game' tab to test your torque intuition",
        "Remember: τ = r × F — distance from pivot matters as much as weight",
      ]}
    />
  );
}
