import type { UnitConfig } from "@/types/unit";
import { energyMeta } from "@/units/meta";
import { lazyNamed } from "@/units/_lazy";
import {
  createUnitFrqPractice,
  createUnitPracticeQuiz,
  createUnitTimedTest,
} from "@/components/practice/unit-practice";

const Work = lazyNamed(() => import("./topics/work"), "Work");
const KineticEnergy = lazyNamed(() => import("./topics/kinetic-energy"), "KineticEnergy");
const PotentialEnergy = lazyNamed(() => import("./topics/potential-energy"), "PotentialEnergy");
const ConservationEnergy = lazyNamed(() => import("./topics/conservation-energy"), "ConservationEnergy");
const Power = lazyNamed(() => import("./topics/power"), "Power");
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
const SkateParkSim = lazyNamed(() => import("./simulations/skate-park-sim"), "SkateParkSim");
const SpringsEnergySim = lazyNamed(() => import("./simulations/springs-energy-sim"), "SpringsEnergySim");

const PracticeQuiz = createUnitPracticeQuiz("energy");
const FRQPractice = createUnitFrqPractice("energy");
const TimedTest = createUnitTimedTest("energy");

export const energyConfig: UnitConfig = {
  ...energyMeta,
  learnTopicIds: ["work", "kinetic-energy", "potential-energy", "conservation-energy", "power"],
  sections: [
    {
      label: "Learn", icon: "learn",
      items: [
        { id: "work", name: "Work", short: "Work" },
        { id: "kinetic-energy", name: "Kinetic Energy", short: "KE" },
        { id: "potential-energy", name: "Potential Energy", short: "PE" },
        { id: "conservation-energy", name: "Conservation of Energy", short: "Conserv." },
        { id: "power", name: "Power", short: "Power" },
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
        { id: "sim-skatepark", name: "Energy Skate Park (PhET)", short: "Skate Park" },
        { id: "sim-springs-e", name: "Masses & Springs (PhET)", short: "Springs" },
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
    "work": Work,
    "kinetic-energy": KineticEnergy,
    "potential-energy": PotentialEnergy,
    "conservation-energy": ConservationEnergy,
    "power": Power,
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
    "sim-skatepark": SkateParkSim,
    "sim-springs-e": SpringsEnergySim,
  },
};
