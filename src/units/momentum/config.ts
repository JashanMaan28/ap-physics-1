import type { UnitConfig } from "@/types/unit";
import { momentumMeta } from "@/units/meta";
import { lazyNamed } from "@/units/_lazy";
import {
  createUnitFrqPractice,
  createUnitPracticeQuiz,
  createUnitTimedTest,
} from "@/components/practice/unit-practice";

const MomentumImpulse = lazyNamed(() => import("./topics/momentum-impulse"), "MomentumImpulse");
const ImpulseForce = lazyNamed(() => import("./topics/impulse-force"), "ImpulseForce");
const ConservationMomentum = lazyNamed(() => import("./topics/conservation-momentum"), "ConservationMomentum");
const ElasticCollisions = lazyNamed(() => import("./topics/elastic-collisions"), "ElasticCollisions");
const InelasticCollisions = lazyNamed(() => import("./topics/inelastic-collisions"), "InelasticCollisions");
const ConceptMap = lazyNamed(() => import("./explore/concept-map"), "ConceptMap");
const RealWorld = lazyNamed(() => import("./explore/real-world"), "RealWorld");
const WhatIf = lazyNamed(() => import("./explore/what-if"), "WhatIf");
const ProblemGenerator = lazyNamed(() => import("./practice/problem-generator"), "ProblemGenerator");
const FormulaSpeedRound = lazyNamed(() => import("@/components/practice/formula-speed-round"), "FormulaSpeedRound");
const Flashcards = lazyNamed(() => import("./review/flashcards"), "Flashcards");
const WorkedExamples = lazyNamed(() => import("./review/worked-examples"), "WorkedExamples");
const FormulaSheet = lazyNamed(() => import("./review/formula-sheet"), "FormulaSheet");
const EquationSolver = lazyNamed(() => import("@/components/tools/equation-solver"), "EquationSolver");
const UnitConverter = lazyNamed(() => import("@/components/tools/unit-converter"), "UnitConverter");
const FBDBuilder = lazyNamed(() => import("@/components/tools/fbd-builder"), "FBDBuilder");
const MistakeTracker = lazyNamed(() => import("@/components/review/mistake-tracker"), "MistakeTracker");
const CollisionLabSim = lazyNamed(() => import("./simulations/collision-lab-sim"), "CollisionLabSim");
const CollisionSim = lazyNamed(() => import("./simulations/collision-sim"), "CollisionSim");

const PracticeQuiz = createUnitPracticeQuiz("momentum");
const FRQPractice = createUnitFrqPractice("momentum");
const TimedTest = createUnitTimedTest("momentum");

export const momentumConfig: UnitConfig = {
  ...momentumMeta,
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
        { id: "formula-speed", name: "Formula Speed Round", short: "Speed" },
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
    "formula-speed": FormulaSpeedRound,
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
