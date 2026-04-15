"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useMistakes } from "@/contexts/mistake-context";

interface QuizQuestion {
  id: number;
  question: string;
  choices: string[];
  correctIndex: number;
  explanation: string;
  topic: string;
}

const getTimestamp = () => Date.now();

const questions: QuizQuestion[] = [
  {
    id: 1,
    question:
      "A solid disk and a hoop of equal mass and radius roll down the same incline from rest. Which reaches the bottom first?",
    choices: [
      "The hoop",
      "The solid disk",
      "They arrive at the same time",
      "It depends on the angle of the incline",
    ],
    correctIndex: 1,
    explanation:
      "The solid disk has c = 1/2 while the hoop has c = 1. Less rotational inertia fraction means more translational speed. The disk wins regardless of mass, radius, or incline angle.",
    topic: "rolling-motion",
  },
  {
    id: 2,
    question:
      "A figure skater pulls her arms in during a spin. What happens to her angular momentum and rotational kinetic energy?",
    choices: [
      "Both increase",
      "L stays the same, KE increases",
      "L increases, KE stays the same",
      "Both stay the same",
    ],
    correctIndex: 1,
    explanation:
      "No external torque acts, so L is conserved. Since I decreases and L = Iω, ω increases. KE = L²/(2I), so with smaller I, KE increases. The skater does work by pulling her arms in.",
    topic: "conservation-angular",
  },
  {
    id: 3,
    question:
      "What is the rotational kinetic energy of a 4 kg solid sphere (radius 0.2 m) spinning at 10 rad/s?",
    choices: ["1.6 J", "3.2 J", "4.0 J", "8.0 J"],
    correctIndex: 1,
    explanation:
      "I = (2/5)MR² = (2/5)(4)(0.04) = 0.064 kg·m². KE = (1/2)(0.064)(100) = 3.2 J.",
    topic: "rotational-ke",
  },
  {
    id: 4,
    question:
      "A merry-go-round (I = 200 kg·m²) spins at 3 rad/s. A 50 kg child jumps on at 2 m from center. What is the new angular velocity?",
    choices: ["2.0 rad/s", "1.5 rad/s", "1.0 rad/s", "2.5 rad/s"],
    correctIndex: 1,
    explanation:
      "L = Iω = 200 × 3 = 600 kg·m²/s. After: I_total = 200 + 50(4) = 400 kg·m². ω = 600/400 = 1.5 rad/s.",
    topic: "conservation-angular",
  },
  {
    id: 5,
    question:
      "For a mass hanging from a string wrapped around a solid disk pulley, the acceleration is:",
    choices: [
      "g",
      "mg / (m + M)",
      "mg / (m + M/2)",
      "2g/3",
    ],
    correctIndex: 2,
    explanation:
      "Using Newton's 2nd law for the mass (mg - T = ma) and torque on pulley (TR = Iα = (MR²/2)(a/R)), solving gives a = mg/(m + M/2).",
    topic: "combined-rotation",
  },
  {
    id: 6,
    question:
      "The moment of inertia of a thin hoop of mass M and radius R about its central axis is:",
    choices: ["(1/2)MR²", "MR²", "(2/5)MR²", "(1/12)ML²"],
    correctIndex: 1,
    explanation:
      "All mass in a hoop is at distance R from the axis, so I = MR². This is the largest I for a given M and R among common shapes.",
    topic: "rotational-ke",
  },
  {
    id: 7,
    question:
      "Angular momentum is measured in units of:",
    choices: ["kg·m/s", "kg·m²/s", "N·m", "J/s"],
    correctIndex: 1,
    explanation:
      "L = Iω has units of (kg·m²)(rad/s) = kg·m²/s. This is also equivalent to J·s or N·m·s.",
    topic: "angular-momentum",
  },
  {
    id: 8,
    question:
      "A ball rolls without slipping. The velocity of the contact point with the ground is:",
    choices: ["v (center velocity)", "2v", "v/2", "Zero"],
    correctIndex: 3,
    explanation:
      "Rolling without slipping means the contact point is instantaneously at rest. The velocity from translation (v forward) cancels with the velocity from rotation (Rω backward at the bottom).",
    topic: "rolling-motion",
  },
  {
    id: 9,
    question:
      "Two disks of the same mass and radius rotate in opposite directions at the same speed. They are pressed together and reach a common angular velocity. What is it?",
    choices: ["ω", "ω/2", "0", "2ω"],
    correctIndex: 2,
    explanation:
      "L_total = Iω + I(-ω) = 0. By conservation of angular momentum, the final ω must be 0. All kinetic energy is lost to friction.",
    topic: "conservation-angular",
  },
  {
    id: 10,
    question:
      "A yo-yo (solid disk, mass m) unwinds from a string. Its downward acceleration is approximately:",
    choices: ["g", "g/2", "2g/3", "g/3"],
    correctIndex: 2,
    explanation:
      "For a solid disk (I = mR²/2) unwinding: a = g/(1 + I/(mR²)) = g/(1 + 1/2) = 2g/3 ≈ 6.53 m/s².",
    topic: "combined-rotation",
  },
  {
    id: 11,
    question:
      "Doubling the angular velocity of a spinning object changes its rotational KE by a factor of:",
    choices: ["2", "4", "1/2", "√2"],
    correctIndex: 1,
    explanation:
      "KE = (1/2)Iω². If ω doubles, KE increases by 2² = 4. Kinetic energy depends on the square of angular velocity.",
    topic: "rotational-ke",
  },
  {
    id: 12,
    question:
      "Earth's angular momentum about its rotation axis is approximately constant because:",
    choices: [
      "Earth has constant mass",
      "No significant external torques act about that axis",
      "Earth is a perfect sphere",
      "Gravity provides the centripetal force",
    ],
    correctIndex: 1,
    explanation:
      "Conservation of angular momentum requires zero net external torque. The gravitational force from the Sun acts through Earth's center and creates negligible torque about Earth's spin axis.",
    topic: "conservation-angular",
  },
  {
    id: 13,
    question:
      "A solid sphere rolling at speed v has total kinetic energy:",
    choices: [
      "(1/2)mv²",
      "(7/10)mv²",
      "(1/2)mv² + (1/5)mv²",
      "Both B and C (they are equal)",
    ],
    correctIndex: 3,
    explanation:
      "KE = (1/2)mv² + (1/2)(2/5 mR²)(v/R)² = (1/2)mv² + (1/5)mv² = (7/10)mv². B and C give the same answer.",
    topic: "rolling-motion",
  },
  {
    id: 14,
    question:
      "In an Atwood machine with a massive pulley, the tensions on the two sides of the string are:",
    choices: [
      "Equal",
      "Unequal; the heavier side has more tension",
      "Unequal; the lighter side has more tension",
      "Zero",
    ],
    correctIndex: 1,
    explanation:
      "With a massive pulley, there must be a net torque to angularly accelerate it. This requires T₁ ≠ T₂. The side with the heavier mass has greater tension.",
    topic: "combined-rotation",
  },
  {
    id: 15,
    question:
      "The parallel axis theorem states I = I_cm + Md². This is needed when:",
    choices: [
      "The object is hollow",
      "The rotation axis does not pass through the center of mass",
      "The object is rolling",
      "Angular momentum is conserved",
    ],
    correctIndex: 1,
    explanation:
      "The parallel axis theorem shifts the rotation axis away from the center of mass. I about any parallel axis equals I_cm plus Md², where d is the distance between the axes.",
    topic: "rotational-ke",
  },
  {
    id: 16,
    question:
      "A planet moves in an elliptical orbit. At the closest approach (perihelion), its speed is greatest because:",
    choices: [
      "Gravitational PE is lowest",
      "Angular momentum is conserved and r is smallest",
      "Centripetal acceleration is greatest",
      "Gravitational force is strongest",
    ],
    correctIndex: 1,
    explanation:
      "L = mvr (for circular-like motion). With L conserved and r smallest at perihelion, v must be largest. This is Kepler's second law.",
    topic: "angular-momentum",
  },
  {
    id: 17,
    question:
      "Static friction on a rolling object on a flat surface does:",
    choices: [
      "Positive work",
      "Negative work",
      "No work",
      "Work equal to (1/2)Iω²",
    ],
    correctIndex: 2,
    explanation:
      "Static friction acts at the contact point, which has zero velocity (for rolling without slipping). Since the displacement at the point of application is zero, no work is done.",
    topic: "rolling-motion",
  },
  {
    id: 18,
    question:
      "Two identical stars orbit each other. If one star expands (increasing its I) while total L is conserved, the orbital angular velocity:",
    choices: [
      "Increases",
      "Decreases",
      "Stays the same",
      "Cannot be determined",
    ],
    correctIndex: 1,
    explanation:
      "The expanding star's spin may change, but if total I of the system increases while total L is conserved, ω must decrease.",
    topic: "conservation-angular",
  },
  {
    id: 19,
    question:
      "A cylinder rolls up an incline. At the top, where it momentarily stops, its energy is:",
    choices: [
      "All gravitational PE",
      "All rotational KE",
      "A mix of KE and PE",
      "Zero",
    ],
    correctIndex: 0,
    explanation:
      "When it momentarily stops, v = 0 and ω = 0 (since v = Rω). All energy has been converted to gravitational potential energy mgh.",
    topic: "rolling-motion",
  },
  {
    id: 20,
    question:
      "The torque required to change angular momentum from 10 kg·m²/s to 30 kg·m²/s in 4 seconds is:",
    choices: ["5 N·m", "7.5 N·m", "10 N·m", "20 N·m"],
    correctIndex: 0,
    explanation:
      "τ = ΔL/Δt = (30 - 10)/4 = 20/4 = 5 N·m. This is the rotational analog of F = Δp/Δt.",
    topic: "angular-momentum",
  },
];

export function PracticeQuiz() {
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(0);
  const [quizComplete, setQuizComplete] = useState(false);

  const { addMistake } = useMistakes();

  const q = questions[currentQ];

  const handleSelect = (idx: number) => {
    if (showExplanation) return;
    setSelected(idx);
    setShowExplanation(true);
    setAnswered((a) => a + 1);
    if (idx === q.correctIndex) {
      setScore((s) => s + 1);
    } else {
      addMistake({
        unit: "rotating-systems",
        topic: q.topic,
        question: q.question,
        yourAnswer: q.choices[idx],
        correctAnswer: q.choices[q.correctIndex],
        timestamp: getTimestamp(),
      });
    }
  };

  const handleNext = () => {
    if (currentQ + 1 >= questions.length) {
      setQuizComplete(true);
    } else {
      setCurrentQ((c) => c + 1);
      setSelected(null);
      setShowExplanation(false);
    }
  };

  if (quizComplete) {
    const pct = Math.round((score / questions.length) * 100);
    return (
      <div className="space-y-6">
        <Card className="bg-gray-900 border-gray-700">
          <CardHeader>
            <CardTitle className="text-teal-400 text-center text-2xl">
              Quiz Complete!
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-6xl font-bold text-white">{pct}%</p>
            <p className="text-gray-400">
              {score} / {questions.length} correct
            </p>
            <Badge
              className={
                pct >= 80
                  ? "bg-green-600"
                  : pct >= 60
                  ? "bg-yellow-600"
                  : "bg-red-600"
              }
            >
              {pct >= 80 ? "Excellent" : pct >= 60 ? "Good" : "Needs Review"}
            </Badge>
            <div>
              <Button
                onClick={() => {
                  setCurrentQ(0);
                  setSelected(null);
                  setShowExplanation(false);
                  setScore(0);
                  setAnswered(0);
                  setQuizComplete(false);
                }}
                className="bg-teal-600 hover:bg-teal-700"
              >
                Retake Quiz
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-teal-400">Practice Quiz</h2>
        <Badge className="bg-gray-700">
          {currentQ + 1} / {questions.length}
        </Badge>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-gray-800 rounded-full h-2">
        <div
          className="bg-teal-500 h-2 rounded-full transition-all"
          style={{ width: `${((currentQ + 1) / questions.length) * 100}%` }}
        />
      </div>

      <Card className="bg-gray-900 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white text-lg">{q.question}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {q.choices.map((choice, idx) => {
            let borderColor = "border-gray-700";
            if (showExplanation) {
              if (idx === q.correctIndex) borderColor = "border-green-500";
              else if (idx === selected) borderColor = "border-red-500";
            }
            return (
              <button
                key={idx}
                onClick={() => handleSelect(idx)}
                disabled={showExplanation}
                className={`w-full text-left p-3 rounded-lg border ${borderColor} bg-gray-800 text-gray-300 hover:bg-gray-750 transition-colors disabled:cursor-default`}
              >
                <span className="font-bold mr-2">
                  {String.fromCharCode(65 + idx)}.
                </span>
                {choice}
              </button>
            );
          })}

          {showExplanation && (
            <div className="mt-4 p-4 bg-teal-900/20 border border-teal-800 rounded-lg">
              <p className="text-teal-300 font-bold mb-1">Explanation:</p>
              <p className="text-gray-300 text-sm">{q.explanation}</p>
            </div>
          )}

          {showExplanation && (
            <div className="flex justify-between items-center mt-4">
              <p className="text-gray-500 text-sm">
                Score: {score}/{answered}
              </p>
              <Button
                onClick={handleNext}
                className="bg-teal-600 hover:bg-teal-700"
              >
                {currentQ + 1 >= questions.length ? "See Results" : "Next"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
