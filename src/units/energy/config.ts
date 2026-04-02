import type { UnitConfig } from "@/types/unit";
import { Work } from "./topics/work";
import { KineticEnergy } from "./topics/kinetic-energy";
import { PotentialEnergy } from "./topics/potential-energy";
import { ConservationEnergy } from "./topics/conservation-energy";
import { Power } from "./topics/power";
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
import { SkateParkSim } from "./simulations/skate-park-sim";
import { SpringsEnergySim } from "./simulations/springs-energy-sim";

export const energyConfig: UnitConfig = {
  slug: "energy",
  number: 3,
  name: "Work, Energy, and Power",
  shortName: "Energy",
  examWeight: "18–23%",
  color: "#f59e0b",
  description: "Work, kinetic energy, gravitational and spring PE, conservation of energy, and power.",
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
