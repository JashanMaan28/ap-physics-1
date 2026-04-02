"use client";

import { PhETEmbed } from "@/components/simulations/phet-embed";

export function SpringsEnergySim() {
  return (
    <PhETEmbed
      title="Masses and Springs"
      simUrl="https://phet.colorado.edu/sims/html/masses-and-springs/latest/masses-and-springs_en.html"
      description="Hang masses on springs and explore Hooke's law, spring PE, and oscillation energy."
      tips={[
        "Use the 'Energy' view to see KE and PE bars as the mass oscillates",
        "Change spring constant to see how stiffness affects period",
        "Compare two springs side-by-side with different masses",
        "At equilibrium, spring PE is minimum and KE is maximum",
      ]}
    />
  );
}
