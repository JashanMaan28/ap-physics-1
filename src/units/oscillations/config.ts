import type { UnitConfig } from "@/types/unit";
import { oscillationsMeta } from "@/units/meta";
import { lazyNamed } from "@/units/_lazy";
import {
  createUnitFrqPractice,
  createUnitPracticeQuiz,
  createUnitTimedTest,
} from "@/components/practice/unit-practice";

const SHMBasics = lazyNamed(() => import("./topics/shm-basics"), "SHMBasics");
const SpringMass = lazyNamed(() => import("./topics/spring-mass"), "SpringMass");
const Pendulum = lazyNamed(() => import("./topics/pendulum"), "Pendulum");
const EnergySHM = lazyNamed(() => import("./topics/energy-shm"), "EnergySHM");
const SHMGraphs = lazyNamed(() => import("./topics/shm-graphs"), "SHMGraphs");
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
const PendulumLabSim = lazyNamed(() => import("./simulations/pendulum-lab-sim"), "PendulumLabSim");
const SpringsSim = lazyNamed(() => import("./simulations/springs-sim"), "SpringsSim");
const PendulumSim = lazyNamed(() => import("./simulations/pendulum-sim"), "PendulumSim");

const PracticeQuiz = createUnitPracticeQuiz("oscillations");
const FRQPractice = createUnitFrqPractice("oscillations");
const TimedTest = createUnitTimedTest("oscillations");

export const oscillationsConfig: UnitConfig = {
  ...oscillationsMeta,
  learnTopicIds: ["shm-basics", "spring-mass", "pendulum", "energy-shm", "shm-graphs"],
  sections: [
    {
      label: "Learn", icon: "learn",
      items: [
        { id: "shm-basics", name: "SHM Basics", short: "SHM" },
        { id: "spring-mass", name: "Spring-Mass Systems", short: "Springs" },
        { id: "pendulum", name: "Pendulum", short: "Pendulum" },
        { id: "energy-shm", name: "Energy in SHM", short: "Energy" },
        { id: "shm-graphs", name: "SHM Graphs", short: "Graphs" },
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
        { id: "sim-pendulum-lab", name: "Pendulum Lab (PhET)", short: "Pendulum" },
        { id: "sim-springs", name: "Masses & Springs (PhET)", short: "Springs" },
        { id: "sim-pendulum", name: "Pendulum Simulator", short: "Custom Sim" },
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
    "shm-basics": SHMBasics,
    "spring-mass": SpringMass,
    "pendulum": Pendulum,
    "energy-shm": EnergySHM,
    "shm-graphs": SHMGraphs,
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
    "sim-pendulum-lab": PendulumLabSim,
    "sim-springs": SpringsSim,
    "sim-pendulum": PendulumSim,
  },
};
