import type { UnitConfig } from "@/types/unit";
import { SHMBasics } from "./topics/shm-basics";
import { SpringMass } from "./topics/spring-mass";
import { Pendulum } from "./topics/pendulum";
import { EnergySHM } from "./topics/energy-shm";
import { SHMGraphs } from "./topics/shm-graphs";
import { ProblemGenerator } from "./practice/problem-generator";
import { FormulaSpeedRound } from "@/components/practice/formula-speed-round";
import {
  createUnitFrqPractice,
  createUnitPracticeQuiz,
  createUnitTimedTest,
} from "@/components/practice/unit-practice";
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
import { PendulumLabSim } from "./simulations/pendulum-lab-sim";
import { SpringsSim } from "./simulations/springs-sim";
import { PendulumSim } from "./simulations/pendulum-sim";

const PracticeQuiz = createUnitPracticeQuiz("oscillations");
const FRQPractice = createUnitFrqPractice("oscillations");
const TimedTest = createUnitTimedTest("oscillations");

export const oscillationsConfig: UnitConfig = {
  slug: "oscillations",
  number: 7,
  name: "Oscillations",
  shortName: "Oscillations",
  examWeight: "5–8%",
  color: "#06b6d4",
  description: "Simple harmonic motion, spring-mass systems, pendulums, and energy in SHM.",
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
