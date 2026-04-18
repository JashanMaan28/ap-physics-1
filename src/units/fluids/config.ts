import type { UnitConfig } from "@/types/unit";
import { fluidsMeta } from "@/units/meta";
import { lazyNamed } from "@/units/_lazy";
import {
  createUnitFrqPractice,
  createUnitPracticeQuiz,
  createUnitTimedTest,
} from "@/components/practice/unit-practice";

const PressureDepth = lazyNamed(() => import("@/components/topics/pressure-depth"), "PressureDepth");
const PascalsLaw = lazyNamed(() => import("@/components/topics/pascals-law"), "PascalsLaw");
const Buoyancy = lazyNamed(() => import("@/components/topics/buoyancy"), "Buoyancy");
const ContinuityEquation = lazyNamed(() => import("@/components/topics/continuity"), "ContinuityEquation");
const BernoullisEquation = lazyNamed(() => import("@/components/topics/bernoullis"), "BernoullisEquation");
const ConceptMap = lazyNamed(() => import("@/components/explore/concept-map"), "ConceptMap");
const RealWorldExamples = lazyNamed(() => import("@/components/explore/real-world"), "RealWorldExamples");
const WhatIfScenarios = lazyNamed(() => import("@/components/explore/what-if"), "WhatIfScenarios");
const ProblemGenerator = lazyNamed(() => import("@/components/practice/problem-generator"), "ProblemGenerator");
const FormulaSpeedRound = lazyNamed(() => import("@/components/practice/formula-speed-round"), "FormulaSpeedRound");
const Flashcards = lazyNamed(() => import("@/components/review/flashcards"), "Flashcards");
const WorkedExamples = lazyNamed(() => import("@/components/review/worked-examples"), "WorkedExamples");
const FormulaSheet = lazyNamed(() => import("@/components/review/formula-sheet"), "FormulaSheet");
const MistakeTracker = lazyNamed(() => import("@/components/review/mistake-tracker"), "MistakeTracker");
const EquationSolver = lazyNamed(() => import("@/components/tools/equation-solver"), "EquationSolver");
const UnitConverter = lazyNamed(() => import("@/components/tools/unit-converter"), "UnitConverter");
const FBDBuilder = lazyNamed(() => import("@/components/tools/fbd-builder"), "FBDBuilder");
const UnderPressureSim = lazyNamed(() => import("./simulations/under-pressure-sim"), "UnderPressureSim");
const FluidFlowSim = lazyNamed(() => import("./simulations/fluid-flow-sim"), "FluidFlowSim");

const PracticeQuiz = createUnitPracticeQuiz("fluids");
const FRQPractice = createUnitFrqPractice("fluids");
const TimedTest = createUnitTimedTest("fluids");

export const fluidsConfig: UnitConfig = {
  ...fluidsMeta,
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
