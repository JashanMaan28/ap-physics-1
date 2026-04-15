import type { UnitConfig } from "@/types/unit";

import { PressureDepth } from "@/components/topics/pressure-depth";
import { PascalsLaw } from "@/components/topics/pascals-law";
import { Buoyancy } from "@/components/topics/buoyancy";
import { ContinuityEquation } from "@/components/topics/continuity";
import { BernoullisEquation } from "@/components/topics/bernoullis";
import { EquationSolver } from "@/components/tools/equation-solver";
import { UnitConverter } from "@/components/tools/unit-converter";
import { FBDBuilder } from "@/components/tools/fbd-builder";
import { Flashcards } from "@/components/review/flashcards";
import { WorkedExamples } from "@/components/review/worked-examples";
import { FormulaSheet } from "@/components/review/formula-sheet";
import { MistakeTracker } from "@/components/review/mistake-tracker";
import { UnderPressureSim } from "./simulations/under-pressure-sim";
import { FluidFlowSim } from "./simulations/fluid-flow-sim";
import { ProblemGenerator } from "@/components/practice/problem-generator";
import { FormulaSpeedRound } from "@/components/practice/formula-speed-round";
import { ConceptMap } from "@/components/explore/concept-map";
import { RealWorldExamples } from "@/components/explore/real-world";
import { WhatIfScenarios } from "@/components/explore/what-if";
import {
  createUnitFrqPractice,
  createUnitPracticeQuiz,
  createUnitTimedTest,
} from "@/components/practice/unit-practice";

const PracticeQuiz = createUnitPracticeQuiz("fluids");
const FRQPractice = createUnitFrqPractice("fluids");
const TimedTest = createUnitTimedTest("fluids");

export const fluidsConfig: UnitConfig = {
  slug: "fluids",
  number: 8,
  name: "Fluids",
  shortName: "Fluids",
  examWeight: "10–15%",
  color: "#0ea5e9",
  description: "Pressure, Pascal's law, buoyancy, continuity equation, and Bernoulli's equation.",
  learnTopicIds: ["pressure", "pascal", "buoyancy", "continuity", "bernoulli"],
  sections: [
    {
      label: "Learn",
      icon: "learn",
      items: [
        { id: "pressure", name: "Pressure & Depth", short: "Pressure" },
        { id: "pascal", name: "Pascal's Law", short: "Pascal" },
        { id: "buoyancy", name: "Buoyancy", short: "Buoyancy" },
        { id: "continuity", name: "Continuity Eq.", short: "Continuity" },
        { id: "bernoulli", name: "Bernoulli's Eq.", short: "Bernoulli" },
        { id: "concept-map", name: "Concept Map", short: "Map" },
        { id: "real-world", name: "Real-World Examples", short: "Examples" },
        { id: "what-if", name: "What If?", short: "What If" },
      ],
    },
    {
      label: "Practice",
      icon: "practice",
      items: [
        { id: "quiz", name: "Topic Quiz", short: "Quiz" },
        { id: "problem-gen", name: "Problem Generator", short: "Problems" },
        { id: "frq", name: "FRQ Practice", short: "FRQ" },
        { id: "timed-test", name: "Timed Mini-Test", short: "Timed" },
        { id: "formula-speed", name: "Formula Speed Round", short: "Speed" },
      ],
    },
    {
      label: "Tools",
      icon: "tools",
      items: [
        { id: "equation-solver", name: "Equation Solver", short: "Solver" },
        { id: "unit-converter", name: "Unit Converter", short: "Units" },
        { id: "fbd-builder", name: "FBD Builder", short: "FBD" },
      ],
    },
    {
      label: "Simulations",
      icon: "simulations",
      items: [
        { id: "sim-pressure", name: "Under Pressure (PhET)", short: "Pressure" },
        { id: "sim-flow", name: "Fluid Flow (PhET)", short: "Flow" },
      ],
    },
    {
      label: "Review",
      icon: "review",
      items: [
        { id: "flashcards", name: "Flashcards", short: "Flash" },
        { id: "worked-examples", name: "Worked Examples", short: "Worked" },
        { id: "formula-sheet", name: "Formula Sheet", short: "Formulas" },
        { id: "mistakes", name: "Mistake Tracker", short: "Mistakes" },
      ],
    },
  ],
  componentMap: {
    "pressure": PressureDepth,
    "pascal": PascalsLaw,
    "buoyancy": Buoyancy,
    "continuity": ContinuityEquation,
    "bernoulli": BernoullisEquation,
    "concept-map": ConceptMap,
    "real-world": RealWorldExamples,
    "what-if": WhatIfScenarios,
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
    "sim-pressure": UnderPressureSim,
    "sim-flow": FluidFlowSim,
  },
};
