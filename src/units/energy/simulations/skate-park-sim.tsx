"use client";

import { PhETEmbed } from "@/components/simulations/phet-embed";

export function SkateParkSim() {
  return (
    <PhETEmbed
      title="Energy Skate Park"
      simUrl="https://phet.colorado.edu/sims/html/energy-skate-park/latest/energy-skate-park_en.html"
      description="Watch kinetic and potential energy transform as a skater moves along a track. Build custom tracks and explore conservation of energy."
      tips={[
        "Enable the energy bar chart to see KE, PE, and thermal energy in real time",
        "Build a loop-the-loop and see if the skater has enough energy to complete it",
        "Toggle friction on/off to see energy dissipation as thermal energy",
        "Place the skater at different heights to verify PE = mgh",
      ]}
    />
  );
}
