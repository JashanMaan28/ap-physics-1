"use client";

import { PhETEmbed } from "@/components/simulations/phet-embed";

export function MovingManSim() {
  return (
    <PhETEmbed
      title="The Moving Man"
      simUrl="https://phet.colorado.edu/sims/html/the-moving-man/latest/the-moving-man_en.html"
      description="Drag the man back and forth and watch position, velocity, and acceleration graphs update in real time."
      tips={[
        "Try constant velocity — observe the flat v-t line and linear x-t graph",
        "Apply constant acceleration from rest — see the parabolic x-t curve",
        "Watch how the slopes of each graph relate to the next graph down",
        "Use the playback controls to replay and study the motion",
      ]}
    />
  );
}
