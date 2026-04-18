import type { UnitConfig } from "@/types/unit";
import { dynamicsMeta } from "@/units/meta";
import { lazyNamed } from "@/units/_lazy";
import {
  createUnitFrqPractice,
  createUnitPracticeQuiz,
  createUnitTimedTest,
} from "@/components/practice/unit-practice";

const NewtonsLaws = lazyNamed(() => import("./topics/newtons-laws"), "NewtonsLaws");
const Friction = lazyNamed(() => import("./topics/friction"), "Friction");
const TensionNormal = lazyNamed(() => import("./topics/tension-normal"), "TensionNormal");
const InclinedPlanes = lazyNamed(() => import("./topics/inclined-planes"), "InclinedPlanes");
const AtwoodMachines = lazyNamed(() => import("./topics/atwood-machines"), "AtwoodMachines");
const ConceptMap = lazyNamed(() => import("./explore/concept-map"), "ConceptMap");
const RealWorldExamples = lazyNamed(() => import("./explore/real-world"), "RealWorldExamples");
const WhatIfScenarios = lazyNamed(() => import("./explore/what-if"), "WhatIfScenarios");
const ProblemGenerator = lazyNamed(() => import("./practice/problem-generator"), "ProblemGenerator");
const FormulaSpeedRound = lazyNamed(() => import("@/components/practice/formula-speed-round"), "FormulaSpeedRound");
const Flashcards = lazyNamed(() => import("./review/flashcards"), "Flashcards");
const WorkedExamples = lazyNamed(() => import("./review/worked-examples"), "WorkedExamples");
const FormulaSheet = lazyNamed(() => import("./review/formula-sheet"), "FormulaSheet");
const EquationSolver = lazyNamed(() => import("@/components/tools/equation-solver"), "EquationSolver");
const UnitConverter = lazyNamed(() => import("@/components/tools/unit-converter"), "UnitConverter");
const FBDBuilder = lazyNamed(() => import("@/components/tools/fbd-builder"), "FBDBuilder");
const MistakeTracker = lazyNamed(() => import("@/components/review/mistake-tracker"), "MistakeTracker");
const ForcesSim = lazyNamed(() => import("./simulations/forces-sim"), "ForcesSim");
const FrictionSim = lazyNamed(() => import("./simulations/friction-sim"), "FrictionSim");

const PracticeQuiz = createUnitPracticeQuiz("dynamics");
const FRQPractice = createUnitFrqPractice("dynamics");
const TimedTest = createUnitTimedTest("dynamics");

export const dynamicsConfig: UnitConfig = {
  ...dynamicsMeta,
  learnTopicIds: ["newtons-laws", "friction", "tension-normal", "inclined-planes", "atwood-machines"],
  sections: [
    {
      label: "Learn", icon: "learn",
      items: [
        { id: "newtons-laws", name: "Newton's Laws", short: "Newton" },
        { id: "friction", name: "Friction", short: "Friction" },
        { id: "tension-normal", name: "Tension & Normal", short: "T & N" },
        { id: "inclined-planes", name: "Inclined Planes", short: "Inclines" },
        { id: "atwood-machines", name: "Atwood Machines", short: "Atwood" },
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
        { id: "sim-forces", name: "Forces & Motion (PhET)", short: "Forces" },
        { id: "sim-friction", name: "Friction (PhET)", short: "Friction" },
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
    "newtons-laws": NewtonsLaws,
    "friction": Friction,
    "tension-normal": TensionNormal,
    "inclined-planes": InclinedPlanes,
    "atwood-machines": AtwoodMachines,
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
    "sim-forces": ForcesSim,
    "sim-friction": FrictionSim,
  },
};
