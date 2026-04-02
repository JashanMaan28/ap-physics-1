"use client";

import { PhETEmbed } from "@/components/simulations/phet-embed";

export function SpringsSim() {
  return (
    <PhETEmbed
      title="Masses and Springs"
      simUrl="https://phet.colorado.edu/sims/html/masses-and-springs/latest/masses-and-springs_en.html"
      description="Hang masses on springs to explore Hooke's law, period of oscillation, and spring-mass SHM."
      tips={[
        "Measure the period and verify T = 2π√(m/k)",
        "Double the mass — the period increases by √2, not 2",
        "Change spring constant to see stiffer springs oscillate faster",
        "Use the stopwatch to measure multiple periods for accuracy",
      ]}
    />
  );
}
