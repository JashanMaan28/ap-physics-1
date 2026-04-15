"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useMistakes } from "@/contexts/mistake-context";

const questions = [
  {
    id: 1,
    question: "A 10 kg block is pushed with a force of 50 N on a frictionless surface. What is the acceleration?",
    options: ["2.5 m/s²", "5.0 m/s²", "10.0 m/s²", "0.5 m/s²"],
    correct: 1,
    explanation: "a = F/m = 50/10 = 5.0 m/s²",
    topic: "newtons-laws",
  },
  {
    id: 2,
    question: "Which of Newton's laws explains why you feel pushed back when a car accelerates forward?",
    options: ["First Law (Inertia)", "Second Law (F=ma)", "Third Law (Action-Reaction)", "Law of Gravity"],
    correct: 0,
    explanation: "Your body tends to remain at rest (inertia) while the car accelerates forward around you.",
    topic: "newtons-laws",
  },
  {
    id: 3,
    question: "A 5 kg block on a surface has μs = 0.4. What is the maximum static friction force?",
    options: ["2.0 N", "9.8 N", "19.6 N", "49.0 N"],
    correct: 2,
    explanation: "f_s(max) = μs × N = 0.4 × 5 × 9.8 = 19.6 N",
    topic: "friction",
  },
  {
    id: 4,
    question: "A block slides on a surface with μk = 0.3. If the normal force is 40 N, what is the kinetic friction?",
    options: ["12 N", "120 N", "0.3 N", "4 N"],
    correct: 0,
    explanation: "f_k = μk × N = 0.3 × 40 = 12 N",
    topic: "friction",
  },
  {
    id: 5,
    question: "A 2 kg mass hangs from a rope at rest. What is the tension in the rope?",
    options: ["2 N", "9.8 N", "19.6 N", "4.9 N"],
    correct: 2,
    explanation: "T = mg = 2 × 9.8 = 19.6 N",
    topic: "tension-normal",
  },
  {
    id: 6,
    question: "On a 30° frictionless incline, a 4 kg block has what acceleration down the ramp?",
    options: ["9.8 m/s²", "4.9 m/s²", "8.49 m/s²", "2.45 m/s²"],
    correct: 1,
    explanation: "a = g sin(30°) = 9.8 × 0.5 = 4.9 m/s²",
    topic: "inclined-planes",
  },
  {
    id: 7,
    question: "The normal force on an object on a 60° incline (mass 10 kg) is:",
    options: ["98 N", "84.9 N", "49.0 N", "0 N"],
    correct: 2,
    explanation: "N = mg cos(60°) = 10 × 9.8 × 0.5 = 49.0 N",
    topic: "inclined-planes",
  },
  {
    id: 8,
    question: "In an Atwood machine with masses 6 kg and 4 kg, the acceleration is:",
    options: ["1.96 m/s²", "9.8 m/s²", "4.9 m/s²", "0.98 m/s²"],
    correct: 0,
    explanation: "a = (6-4)×9.8/(6+4) = 2×9.8/10 = 1.96 m/s²",
    topic: "atwood-machines",
  },
  {
    id: 9,
    question: "Newton's Third Law states that action-reaction forces:",
    options: [
      "Act on the same object",
      "Cancel each other out",
      "Act on different objects and are equal in magnitude",
      "Are always gravitational",
    ],
    correct: 2,
    explanation: "Action-reaction forces are equal in magnitude, opposite in direction, and act on different objects.",
    topic: "newtons-laws",
  },
  {
    id: 10,
    question: "A 3 kg book rests on a table. The normal force from the table on the book is:",
    options: ["3 N", "29.4 N", "9.8 N", "0 N"],
    correct: 1,
    explanation: "N = mg = 3 × 9.8 = 29.4 N (upward, balancing gravity)",
    topic: "tension-normal",
  },
  {
    id: 11,
    question: "Kinetic friction is generally _____ maximum static friction.",
    options: ["equal to", "greater than", "less than", "unrelated to"],
    correct: 2,
    explanation: "Kinetic friction (μk × N) is typically less than maximum static friction (μs × N) because μk < μs.",
    topic: "friction",
  },
  {
    id: 12,
    question: "If you double both the mass and the net force on an object, the acceleration:",
    options: ["doubles", "stays the same", "halves", "quadruples"],
    correct: 1,
    explanation: "a = F/m. If both F and m double, a = 2F/2m = F/m, unchanged.",
    topic: "newtons-laws",
  },
  {
    id: 13,
    question: "On an incline, what component of gravity is parallel to the surface?",
    options: ["mg", "mg cos θ", "mg sin θ", "mg tan θ"],
    correct: 2,
    explanation: "The component of gravity along (parallel to) the incline is mg sin θ.",
    topic: "inclined-planes",
  },
  {
    id: 14,
    question: "In an Atwood machine with equal masses, the tension in the rope is:",
    options: ["0", "mg", "2mg", "mg/2"],
    correct: 1,
    explanation: "With equal masses, a=0 and T = mg. Each side just supports its weight.",
    topic: "atwood-machines",
  },
  {
    id: 15,
    question: "A 50 N force is applied to a 10 kg box. Friction is 20 N. The acceleration is:",
    options: ["3 m/s²", "5 m/s²", "7 m/s²", "2 m/s²"],
    correct: 0,
    explanation: "F_net = 50 - 20 = 30 N. a = 30/10 = 3 m/s²",
    topic: "friction",
  },
  {
    id: 16,
    question: "A rope pulls a box at 30° above horizontal with 100 N. The horizontal component is:",
    options: ["50.0 N", "86.6 N", "100 N", "70.7 N"],
    correct: 1,
    explanation: "F_x = F cos(30°) = 100 × 0.866 = 86.6 N",
    topic: "tension-normal",
  },
  {
    id: 17,
    question: "An object in free fall has a net force equal to:",
    options: ["0", "mg upward", "mg downward", "ma upward"],
    correct: 2,
    explanation: "In free fall (ignoring air resistance), the only force is gravity: F_net = mg downward.",
    topic: "newtons-laws",
  },
  {
    id: 18,
    question: "The minimum angle for a block to slide on an incline with μs = 0.577 is approximately:",
    options: ["30°", "45°", "60°", "90°"],
    correct: 0,
    explanation: "θ = arctan(μs) = arctan(0.577) ≈ 30°",
    topic: "inclined-planes",
  },
  {
    id: 19,
    question: "In an Atwood machine (m₁=10kg, m₂=6kg), the tension is approximately:",
    options: ["73.5 N", "49.0 N", "98.0 N", "58.8 N"],
    correct: 0,
    explanation: "T = 2m₁m₂g/(m₁+m₂) = 2×10×6×9.8/16 = 73.5 N",
    topic: "atwood-machines",
  },
  {
    id: 20,
    question: "An astronaut floating in space pushes a 2 kg tool with 10 N for 1 s. The tool's final speed is:",
    options: ["5 m/s", "10 m/s", "20 m/s", "2 m/s"],
    correct: 0,
    explanation: "a = F/m = 10/2 = 5 m/s². v = at = 5×1 = 5 m/s",
    topic: "newtons-laws",
  },
];

const getTimestamp = () => Date.now();

export function PracticeQuiz() {
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(0);
  const [finished, setFinished] = useState(false);
  const { addMistake } = useMistakes();

  const q = questions[currentQ];

  const handleAnswer = (idx: number) => {
    if (showExplanation) return;
    setSelected(idx);
    setShowExplanation(true);
    setAnswered((prev) => prev + 1);
    if (idx === q.correct) {
      setScore((prev) => prev + 1);
    } else {
      addMistake({
        unit: "dynamics",
        topic: q.topic,
        question: q.question,
        yourAnswer: q.options[idx],
        correctAnswer: q.options[q.correct],
        timestamp: getTimestamp(),
      });
    }
  };

  const handleNext = () => {
    if (currentQ < questions.length - 1) {
      setCurrentQ((prev) => prev + 1);
      setSelected(null);
      setShowExplanation(false);
    } else {
      setFinished(true);
    }
  };

  const handleRestart = () => {
    setCurrentQ(0);
    setSelected(null);
    setShowExplanation(false);
    setScore(0);
    setAnswered(0);
    setFinished(false);
  };

  if (finished) {
    const pct = Math.round((score / questions.length) * 100);
    return (
      <Card>
        <CardHeader>
          <CardTitle>Quiz Complete!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <p className="text-4xl font-bold">{score} / {questions.length}</p>
          <p className="text-lg text-muted-foreground">{pct}%</p>
          <Badge variant={pct >= 70 ? "default" : "destructive"}>
            {pct >= 90 ? "Excellent!" : pct >= 70 ? "Good job!" : "Keep studying!"}
          </Badge>
          <div>
            <Button onClick={handleRestart} className="mt-4">Retake Quiz</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Practice Quiz: Dynamics</CardTitle>
            <Badge variant="outline">
              {currentQ + 1} / {questions.length}
            </Badge>
          </div>
          <CardDescription>Score: {score} / {answered}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="font-medium text-lg">{q.question}</p>
          <div className="space-y-2">
            {q.options.map((opt, idx) => (
              <Button
                key={idx}
                variant={
                  showExplanation
                    ? idx === q.correct
                      ? "default"
                      : idx === selected
                      ? "destructive"
                      : "outline"
                    : "outline"
                }
                className="w-full justify-start text-left"
                onClick={() => handleAnswer(idx)}
                disabled={showExplanation}
              >
                {String.fromCharCode(65 + idx)}. {opt}
              </Button>
            ))}
          </div>

          {showExplanation && (
            <>
              <Separator />
              <div className="rounded-lg bg-blue-50 border border-blue-200 p-3">
                <p className="text-sm font-medium text-blue-900">Explanation:</p>
                <p className="text-sm text-blue-800">{q.explanation}</p>
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
