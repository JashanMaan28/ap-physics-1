"use client";

import { PhETEmbed } from "@/components/simulations/phet-embed";

export function CollisionLabSim() {
  return (
    <PhETEmbed
      title="Collision Lab"
      simUrl="https://phet.colorado.edu/sims/html/collision-lab/latest/collision-lab_en.html"
      description="Set up 1D and 2D collisions between objects. Adjust masses and velocities to explore conservation of momentum and energy."
      tips={[
        "Start with 1D collisions to verify p₁ + p₂ = p₁' + p₂'",
        "Toggle 'Elastic' vs 'Inelastic' to see KE conservation differences",
        "Enable the momentum arrows to visualize momentum vectors",
        "Try equal masses with one at rest — the moving ball stops completely (elastic)",
      ]}
    />
  );
}
