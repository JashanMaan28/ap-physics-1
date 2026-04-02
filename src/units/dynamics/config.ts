import type { UnitConfig } from "@/types/unit";
import { NewtonsLaws } from "./topics/newtons-laws";
import { Friction } from "./topics/friction";
import { TensionNormal } from "./topics/tension-normal";
import { InclinedPlanes } from "./topics/inclined-planes";
import { AtwoodMachines } from "./topics/atwood-machines";
import { PracticeQuiz } from "./practice/practice-quiz";
import { ProblemGenerator } from "./practice/problem-generator";
import { FRQPractice } from "./practice/frq-practice";
import { TimedTest } from "./practice/timed-test";
import { Flashcards } from "./review/flashcards";
import { WorkedExamples } from "./review/worked-examples";
import { FormulaSheet } from "./review/formula-sheet";
import { ConceptMap } from "./explore/concept-map";
import { RealWorldExamples } from "./explore/real-world";
import { WhatIfScenarios } from "./explore/what-if";
import { EquationSolver } from "@/components/tools/equation-solver";
import { UnitConverter } from "@/components/tools/unit-converter";
import { FBDBuilder } from "@/components/tools/fbd-builder";
import { MistakeTracker } from "@/components/review/mistake-tracker";

export const dynamicsConfig: UnitConfig = {
  slug: "dynamics",
  number: 2,
  name: "Force and Translational Dynamics",
  shortName: "Dynamics",
  examWeight: "18–23%",
  color: "#ef4444",
  description: "Newton's three laws, friction, tension, normal force, inclined planes, and Atwood machines.",
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
    "equation-solver": EquationSolver,
    "unit-converter": UnitConverter,
    "fbd-builder": FBDBuilder,
    "flashcards": Flashcards,
    "worked-examples": WorkedExamples,
    "formula-sheet": FormulaSheet,
    "mistakes": MistakeTracker,
  },
};
