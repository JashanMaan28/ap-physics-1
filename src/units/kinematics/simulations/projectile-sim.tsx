"use client";

import { PhETEmbed } from "@/components/simulations/phet-embed";

export function ProjectileSim() {
  return (
    <PhETEmbed
      title="Projectile Motion"
      simUrl="https://phet.colorado.edu/sims/html/projectile-motion/latest/projectile-motion_en.html"
      description="Launch objects at different angles and speeds. Observe how range, max height, and flight time depend on launch parameters."
      tips={[
        "Try 45° for maximum range on level ground",
        "Toggle air resistance to see real-world effects",
        "Use the measuring tape to verify your calculations",
        "Compare complementary angles (e.g., 30° and 60°) — same range, different heights",
      ]}
    />
  );
}
