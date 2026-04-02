"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useMistakes } from "@/contexts/mistake-context";

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

const questions: QuizQuestion[] = [
  {
    id: 1,
    question: "A wrench applies a force of 40 N at 0.25 m from the bolt, perpendicular to the handle. What is the torque?",
    options: ["5 N\u00B7m", "10 N\u00B7m", "16 N\u00B7m", "100 N\u00B7m"],
    correct: 1,
    explanation: "\u03C4 = rF sin\u03B8 = 0.25 \u00D7 40 \u00D7 sin(90\u00B0) = 10 N\u00B7m.",
  },
  {
    id: 2,
    question: "What angle between force and lever arm produces maximum torque?",
    options: ["0\u00B0", "45\u00B0", "90\u00B0", "180\u00B0"],
    correct: 2,
    explanation: "sin(90\u00B0) = 1, which maximizes \u03C4 = rF sin\u03B8.",
  },
  {
    id: 3,
    question: "A seesaw has a 4 kg mass at 3 m from the pivot on the left. What mass at 2 m on the right balances it?",
    options: ["2 kg", "4 kg", "6 kg", "8 kg"],
    correct: 2,
    explanation: "m\u2081g d\u2081 = m\u2082g d\u2082 \u2192 4(3) = m\u2082(2) \u2192 m\u2082 = 6 kg.",
  },
  {
    id: 4,
    question: "Which has the largest moment of inertia for the same mass and radius?",
    options: ["Solid disk", "Solid sphere", "Hoop (ring)", "Point mass at R/2"],
    correct: 2,
    explanation: "Hoop: I = MR\u00B2. All mass is at maximum distance from the axis.",
  },
  {
    id: 5,
    question: "A net torque of 12 N\u00B7m acts on an object with I = 4 kg\u00B7m\u00B2. What is the angular acceleration?",
    options: ["0.33 rad/s\u00B2", "3 rad/s\u00B2", "8 rad/s\u00B2", "48 rad/s\u00B2"],
    correct: 1,
    explanation: "\u03C4 = I\u03B1 \u2192 \u03B1 = \u03C4/I = 12/4 = 3 rad/s\u00B2.",
  },
  {
    id: 6,
    question: "An object has \u03C9\u2080 = 5 rad/s and \u03B1 = 2 rad/s\u00B2. What is \u03C9 after 3 s?",
    options: ["6 rad/s", "8 rad/s", "11 rad/s", "15 rad/s"],
    correct: 2,
    explanation: "\u03C9 = \u03C9\u2080 + \u03B1t = 5 + 2(3) = 11 rad/s.",
  },
  {
    id: 7,
    question: "The moment arm is defined as:",
    options: [
      "The total length of the lever",
      "The perpendicular distance from the axis to the line of action of the force",
      "The distance from the force to the center of mass",
      "The radius of the rotating object",
    ],
    correct: 1,
    explanation: "The moment arm (lever arm) is the perpendicular distance from the rotation axis to the line of action of the force.",
  },
  {
    id: 8,
    question: "Two forces of equal magnitude act on a door: one at the hinge, one at the handle. Which produces more torque?",
    options: ["Force at the hinge", "Force at the handle", "They produce equal torque", "Cannot determine"],
    correct: 1,
    explanation: "Torque = rF sin\u03B8. At the hinge, r = 0, so torque = 0. The handle force has larger r and thus larger torque.",
  },
  {
    id: 9,
    question: "What is the SI unit of moment of inertia?",
    options: ["N\u00B7m", "kg\u00B7m", "kg\u00B7m\u00B2", "kg\u00B7m/s"],
    correct: 2,
    explanation: "I = \u03A3mr\u00B2, so the units are kg \u00D7 m\u00B2 = kg\u00B7m\u00B2.",
  },
  {
    id: 10,
    question: "A wheel starts from rest and reaches 10 rad/s in 5 s with constant \u03B1. How many radians does it turn?",
    options: ["10 rad", "25 rad", "50 rad", "100 rad"],
    correct: 1,
    explanation: "\u03B1 = (10 - 0)/5 = 2 rad/s\u00B2. \u03B8 = \u03C9\u2080t + \u00BD\u03B1t\u00B2 = 0 + 0.5(2)(25) = 25 rad.",
  },
  {
    id: 11,
    question: "For a solid disk, I = (1/2)MR\u00B2. If R is doubled (same M), how does I change?",
    options: ["Doubles", "Triples", "Quadruples", "Stays the same"],
    correct: 2,
    explanation: "I \u221D R\u00B2. If R \u2192 2R, then I \u2192 (1/2)M(2R)\u00B2 = 4 \u00D7 (1/2)MR\u00B2. It quadruples.",
  },
  {
    id: 12,
    question: "A uniform rod of length L is pivoted at one end. Its moment of inertia is:",
    options: ["(1/12)ML\u00B2", "(1/6)ML\u00B2", "(1/3)ML\u00B2", "ML\u00B2"],
    correct: 2,
    explanation: "A rod pivoted at one end has I = (1/3)ML\u00B2. Pivoted at the center it would be (1/12)ML\u00B2.",
  },
  {
    id: 13,
    question: "If the net torque on an object is zero, the object:",
    options: [
      "Must be stationary",
      "Must have zero angular velocity",
      "Has zero angular acceleration",
      "Has zero moment of inertia",
    ],
    correct: 2,
    explanation: "\u03A3\u03C4 = I\u03B1 = 0 means \u03B1 = 0. The object could still be spinning at constant \u03C9.",
  },
  {
    id: 14,
    question: "A 2 kg point mass orbits at r = 3 m. What is its moment of inertia?",
    options: ["6 kg\u00B7m\u00B2", "12 kg\u00B7m\u00B2", "18 kg\u00B7m\u00B2", "36 kg\u00B7m\u00B2"],
    correct: 2,
    explanation: "I = mr\u00B2 = 2 \u00D7 3\u00B2 = 18 kg\u00B7m\u00B2.",
  },
  {
    id: 15,
    question: "The right-hand rule for torque: curl fingers from r to F. Your thumb points in the direction of:",
    options: ["Force", "Angular velocity", "Torque vector", "Linear momentum"],
    correct: 2,
    explanation: "\u03C4 = r \u00D7 F. The right-hand rule gives the direction of the cross product, which is the torque vector.",
  },
  {
    id: 16,
    question: "A spinning figure skater pulls in their arms. What happens to their angular velocity?",
    options: ["Increases", "Decreases", "Stays the same", "Becomes zero"],
    correct: 0,
    explanation: "Angular momentum L = I\u03C9 is conserved. Reducing I (arms in) causes \u03C9 to increase.",
  },
  {
    id: 17,
    question: "What is 3 revolutions in radians?",
    options: ["3 rad", "3\u03C0 rad", "6\u03C0 rad", "9\u03C0 rad"],
    correct: 2,
    explanation: "1 revolution = 2\u03C0 rad. So 3 rev = 3 \u00D7 2\u03C0 = 6\u03C0 rad.",
  },
  {
    id: 18,
    question: "A torque of 20 N\u00B7m decelerates a wheel from 15 rad/s to rest in 3 s. What is I?",
    options: ["1 kg\u00B7m\u00B2", "3 kg\u00B7m\u00B2", "4 kg\u00B7m\u00B2", "5 kg\u00B7m\u00B2"],
    correct: 2,
    explanation: "\u03B1 = (0 - 15)/3 = -5 rad/s\u00B2. |\u03C4| = I|\u03B1| \u2192 20 = I(5) \u2192 I = 4 kg\u00B7m\u00B2.",
  },
  {
    id: 19,
    question: "Two children sit on a seesaw. Child A (30 kg) is 2 m from pivot. Where must Child B (20 kg) sit for balance?",
    options: ["1.5 m", "2 m", "2.5 m", "3 m"],
    correct: 3,
    explanation: "30 \u00D7 2 = 20 \u00D7 d \u2192 d = 60/20 = 3 m from the pivot.",
  },
  {
    id: 20,
    question: "For a rolling object, the relationship between linear acceleration a and angular acceleration \u03B1 is:",
    options: ["a = \u03B1/R", "a = R\u03B1", "a = R\u00B2\u03B1", "a = \u03B1"],
    correct: 1,
    explanation: "For rolling without slipping, the tangential acceleration a = R\u03B1, linking linear and angular motion.",
  },
];

export function PracticeQuiz() {
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(0);
  const [finished, setFinished] = useState(false);
  const { addMistake } = useMistakes();

  const q = questions[currentQ];

  function handleSelect(idx: number) {
    if (showExplanation) return;
    setSelected(idx);
    setShowExplanation(true);
    setAnswered((a) => a + 1);
    if (idx === q.correct) {
      setScore((s) => s + 1);
    } else {
      addMistake({
        unit: "torque",
        topic: q.question.includes("torque") ? "Torque Basics" : "General",
        question: q.question,
        yourAnswer: q.options[idx],
        correctAnswer: q.options[q.correct],
        timestamp: Date.now(),
      });
    }
  }

  function handleNext() {
    if (currentQ < questions.length - 1) {
      setCurrentQ((c) => c + 1);
      setSelected(null);
      setShowExplanation(false);
    } else {
      setFinished(true);
    }
  }

  function handleRestart() {
    setCurrentQ(0);
    setSelected(null);
    setShowExplanation(false);
    setScore(0);
    setAnswered(0);
    setFinished(false);
  }

  if (finished) {
    const pct = Math.round((score / questions.length) * 100);
    return (
      <Card>
        <CardHeader>
          <CardTitle>Quiz Complete!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <p className="text-4xl font-bold">{score}/{questions.length}</p>
          <p className="text-lg text-muted-foreground">{pct}% correct</p>
          <Badge variant={pct >= 80 ? "default" : pct >= 60 ? "secondary" : "destructive"}>
            {pct >= 80 ? "Excellent" : pct >= 60 ? "Good" : "Keep Practicing"}
          </Badge>
          <Button onClick={handleRestart} className="w-full mt-4">Retake Quiz</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Practice Quiz: Torque & Rotation</CardTitle>
            <Badge variant="outline">
              {currentQ + 1}/{questions.length}
            </Badge>
          </div>
          <CardDescription>Score: {score}/{answered}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="font-medium">{q.question}</p>
          <div className="space-y-2">
            {q.options.map((opt, idx) => {
              let variant: "outline" | "default" | "destructive" | "secondary" = "outline";
              if (showExplanation) {
                if (idx === q.correct) variant = "default";
                else if (idx === selected) variant = "destructive";
              }
              return (
                <Button
                  key={idx}
                  variant={variant}
                  className="w-full justify-start text-left"
                  onClick={() => handleSelect(idx)}
                  disabled={showExplanation}
                >
                  {String.fromCharCode(65 + idx)}. {opt}
                </Button>
              );
            })}
          </div>

          {showExplanation && (
            <>
              <Separator />
              <div className="rounded-lg bg-muted/50 p-3 text-sm">
                <strong>{selected === q.correct ? "Correct!" : "Incorrect."}</strong>{" "}
                {q.explanation}
              </div>
              <Button onClick={handleNext} className="w-full">
                {currentQ < questions.length - 1 ? "Next Question" : "See Results"}
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
