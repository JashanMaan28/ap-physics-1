import type { UnitConfig } from "@/types/unit";
import { MomentumImpulse } from "./topics/momentum-impulse";
import { ImpulseForce } from "./topics/impulse-force";
import { ConservationMomentum } from "./topics/conservation-momentum";
import { ElasticCollisions } from "./topics/elastic-collisions";
import { InelasticCollisions } from "./topics/inelastic-collisions";
import { PracticeQuiz } from "./practice/practice-quiz";
import { ProblemGenerator } from "./practice/problem-generator";
import { FRQPractice } from "./practice/frq-practice";
import { TimedTest } from "./practice/timed-test";
import { Flashcards } from "./review/flashcards";
import { WorkedExamples } from "./review/worked-examples";
import { FormulaSheet } from "./review/formula-sheet";
import { ConceptMap } from "./explore/concept-map";
import { RealWorld } from "./explore/real-world";
import { WhatIf } from "./explore/what-if";
import { EquationSolver } from "@/components/tools/equation-solver";
import { UnitConverter } from "@/components/tools/unit-converter";
import { FBDBuilder } from "@/components/tools/fbd-builder";
import { MistakeTracker } from "@/components/review/mistake-tracker";
import { CollisionLabSim } from "./simulations/collision-lab-sim";
import { CollisionSim } from "./simulations/collision-sim";

export const momentumConfig: UnitConfig = {
  slug: "momentum",
  number: 4,
  name: "Linear Momentum",
  shortName: "Momentum",
  examWeight: "10–15%",
  color: "#8b5cf6",
  description: "Momentum, impulse, conservation of momentum, and elastic/inelastic collisions.",
  learnTopicIds: ["momentum-impulse", "impulse-force", "conservation-momentum", "elastic-collisions", "inelastic-collisions"],
  sections: [
    {
      label: "Learn", icon: "learn",
      items: [
        { id: "momentum-impulse", name: "Momentum & Impulse", short: "p & J" },
        { id: "impulse-force", name: "Impulse–Force", short: "Impulse" },
        { id: "conservation-momentum", name: "Conservation of Momentum", short: "Conserv." },
        { id: "elastic-collisions", name: "Elastic Collisions", short: "Elastic" },
        { id: "inelastic-collisions", name: "Inelastic Collisions", short: "Inelastic" },
        { id: "concept-map", name: "Concept Map", short: "Map" },
        { id: "real-world", name: "Real-World Examples", short: "Examples" },
        { id: "what-if", name: "What If?", short: "What If" },
      ],
    },
    {
      label: "Practice", icon: "practice",
      items: [
        { id: "quiz", name: "Topic Quiz", short: "Quiz" },
        { id: "problem-gen", name: "Problem Generator", short: "Problems" },
        { id: "frq", name: "FRQ Practice", short: "FRQ" },
        { id: "timed-test", name: "Timed Mini-Test", short: "Timed" },
      ],
    },
    {
      label: "Tools", icon: "tools",
      items: [
        { id: "equation-solver", name: "Equation Solver", short: "Solver" },
        { id: "unit-converter", name: "Unit Converter", short: "Units" },
        { id: "fbd-builder", name: "FBD Builder", short: "FBD" },
      ],
    },
    {
      label: "Simulations", icon: "simulations",
      items: [
        { id: "sim-collision-lab", name: "Collision Lab (PhET)", short: "Collisions" },
        { id: "sim-collision", name: "Collision Simulator", short: "Custom Sim" },
      ],
    },
    {
      label: "Review", icon: "review",
      items: [
        { id: "flashcards", name: "Flashcards", short: "Flash" },
        { id: "worked-examples", name: "Worked Examples", short: "Worked" },
        { id: "formula-sheet", name: "Formula Sheet", short: "Formulas" },
        { id: "mistakes", name: "Mistake Tracker", short: "Mistakes" },
      ],
    },
  ],
  componentMap: {
    "momentum-impulse": MomentumImpulse,
    "impulse-force": ImpulseForce,
    "conservation-momentum": ConservationMomentum,
    "elastic-collisions": ElasticCollisions,
    "inelastic-collisions": InelasticCollisions,
    "concept-map": ConceptMap,
    "real-world": RealWorld,
    "what-if": WhatIf,
    "quiz": PracticeQuiz,
    "problem-gen": ProblemGenerator,
    "frq": FRQPractice,
    "timed-test": TimedTest,
    "equation-solver": EquationSolver,
    "unit-converter": UnitConverter,
    "fbd-builder": FBDBuilder,
    "flashcards": Flashcards,
    "worked-examples": WorkedExamples,
    "formula-sheet": FormulaSheet,
    "mistakes": MistakeTracker,
    "sim-collision-lab": CollisionLabSim,
    "sim-collision": CollisionSim,
  },
};
