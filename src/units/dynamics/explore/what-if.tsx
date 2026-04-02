"use client";

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const scenarios = [
  {
    title: "What if there were no friction?",
    tag: "Thought Experiment",
    summary: "A world without any friction would be fundamentally different from what we know.",
    details: [
      "You could not walk -- your feet would slip on the ground with zero traction (f = μN = 0).",
      "Cars could not accelerate, brake, or turn. Tires rely on static friction with the road.",
      "You could not hold anything. Objects would slide out of your hands.",
      "Screws, nails, and knots would not hold. Buildings and machines would fall apart.",
      "Once an object started moving, it would never stop on its own (Newton's First Law in its purest form).",
      "Sound would still propagate (it doesn't rely on surface friction), but musical instruments using bows (violin) would not work.",
    ],
  },
  {
    title: "What if gravity were twice as strong?",
    tag: "Altered Physics",
    summary: "Doubling g from 9.8 to 19.6 m/s² would transform life on Earth.",
    details: [
      "Your weight would double: a 70 kg person would weigh 1,372 N instead of 686 N.",
      "Walking, running, and jumping would be much harder. Maximum jump height would be halved.",
      "All structures would need to be much stronger. Skyscrapers as we know them could not exist.",
      "Friction forces would double (f = μ × mg), so stopping distances would actually be shorter.",
      "Incline problems: blocks would slide more easily since mg sin θ doubles, but friction (μ × mg cos θ) also doubles, so the critical angle stays the same!",
      "Atwood machines: acceleration a = (m₁-m₂)g/(m₁+m₂) would double. Everything falls faster.",
      "The atmosphere would be compressed closer to the surface, increasing sea-level air pressure.",
    ],
  },
  {
    title: "What if you could turn off Newton's Third Law?",
    tag: "Impossible Physics",
    summary: "Without action-reaction pairs, the universe would violate conservation of momentum.",
    details: [
      "If you pushed a wall and it didn't push back, you'd accelerate yourself through it.",
      "Rockets could not work -- they rely on pushing exhaust backward (Third Law reaction pushes rocket forward).",
      "Conservation of momentum would break down. Momentum could be created from nothing.",
      "Walking would still be impossible (just like without friction) -- you push Earth backward, and Earth pushes you forward via the Third Law.",
      "The entire framework of classical mechanics (and physics in general) would collapse. The Third Law is deeply connected to conservation of momentum via Noether's theorem.",
      "Even gravity would be one-sided: Earth pulls you down but you wouldn't pull Earth up.",
    ],
  },
];

export function WhatIfScenarios() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>What-If Scenarios</CardTitle>
          <CardDescription>
            Explore how the world would change if we altered the fundamental rules of dynamics.
            These thought experiments deepen understanding of why each concept matters.
          </CardDescription>
        </CardHeader>
      </Card>

      {scenarios.map((scenario, idx) => (
        <Card key={idx}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">{scenario.title}</CardTitle>
              <Badge>{scenario.tag}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-muted-foreground font-medium">{scenario.summary}</p>
            <Separator />
            <Accordion>
              <AccordionItem value="details">
                <AccordionTrigger>Explore the consequences</AccordionTrigger>
                <AccordionContent>
                  <ul className="space-y-2">
                    {scenario.details.map((detail, dIdx) => (
                      <li key={dIdx} className="flex gap-2 text-sm">
                        <span className="text-muted-foreground shrink-0">{dIdx + 1}.</span>
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
