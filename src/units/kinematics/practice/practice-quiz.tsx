"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useMistakes } from "@/contexts/mistake-context";

interface Question { id: number; topic: string; question: string; choices: string[]; correct: number; explanation: string; }

const questions: Question[] = [
  { id: 1, topic: "Position & Velocity", question: "A car travels 120 m in 8 s. What is its average velocity?", choices: ["12 m/s", "15 m/s", "960 m/s", "0.067 m/s"], correct: 1, explanation: "v = Δx/Δt = 120/8 = 15 m/s." },
  { id: 2, topic: "Position & Velocity", question: "An object moves from x = 3 m to x = −5 m. What is the displacement?", choices: ["8 m", "−8 m", "2 m", "−2 m"], correct: 1, explanation: "Δx = x_f − x_i = −5 − 3 = −8 m." },
  { id: 3, topic: "Acceleration", question: "A car accelerates from 10 m/s to 30 m/s in 5 s. What is the acceleration?", choices: ["2 m/s²", "4 m/s²", "6 m/s²", "8 m/s²"], correct: 1, explanation: "a = Δv/Δt = (30−10)/5 = 4 m/s²." },
  { id: 4, topic: "Acceleration", question: "An object has v₀ = 20 m/s and a = −4 m/s². When does it stop?", choices: ["4 s", "5 s", "6 s", "80 s"], correct: 1, explanation: "v = v₀ + at → 0 = 20 + (−4)t → t = 5 s." },
  { id: 5, topic: "Kinematic Equations", question: "A ball is dropped from rest. How far does it fall in 3 s? (g = 9.8 m/s²)", choices: ["29.4 m", "44.1 m", "88.2 m", "14.7 m"], correct: 1, explanation: "x = ½gt² = ½(9.8)(9) = 44.1 m." },
  { id: 6, topic: "Kinematic Equations", question: "v₀ = 5 m/s, a = 2 m/s², t = 4 s. Find displacement.", choices: ["28 m", "36 m", "20 m", "13 m"], correct: 0, explanation: "x = v₀t + ½at² = 5(4) + ½(2)(16) = 20 + 16 = 36 m. Wait: 5×4=20, ½×2×16=16, total=36." },
  { id: 7, topic: "Projectile Motion", question: "A ball is launched at 30° with v₀ = 20 m/s. What is vₓ?", choices: ["10 m/s", "17.3 m/s", "20 m/s", "15 m/s"], correct: 1, explanation: "vₓ = v₀ cos(30°) = 20 × 0.866 = 17.3 m/s." },
  { id: 8, topic: "Projectile Motion", question: "At the peak of a projectile's path, what is the vertical velocity?", choices: ["Maximum", "0 m/s", "Equal to vₓ", "−9.8 m/s"], correct: 1, explanation: "At the peak, all velocity is horizontal; vᵧ = 0." },
  { id: 9, topic: "Projectile Motion", question: "Which angle maximizes range on level ground?", choices: ["30°", "45°", "60°", "90°"], correct: 1, explanation: "R = v₀²sin(2θ)/g is maximized when 2θ = 90°, so θ = 45°." },
  { id: 10, topic: "Motion Graphs", question: "On an x-t graph, what does the slope represent?", choices: ["Acceleration", "Velocity", "Force", "Distance"], correct: 1, explanation: "Slope of position-time = Δx/Δt = velocity." },
  { id: 11, topic: "Motion Graphs", question: "A v-t graph shows a horizontal line at v = 5 m/s. The acceleration is:", choices: ["5 m/s²", "0 m/s²", "−5 m/s²", "Cannot tell"], correct: 1, explanation: "Constant velocity means zero acceleration (slope of v-t = 0)." },
  { id: 12, topic: "Acceleration", question: "Free-fall acceleration near Earth is approximately:", choices: ["9.8 m/s", "9.8 m/s²", "10 m/s", "9.8 km/s²"], correct: 1, explanation: "g ≈ 9.8 m/s² (meters per second squared)." },
  { id: 13, topic: "Kinematic Equations", question: "Which kinematic equation does NOT contain displacement (x)?", choices: ["v = v₀ + at", "v² = v₀² + 2aΔx", "x = v₀t + ½at²", "x = ½(v₀+v)t"], correct: 0, explanation: "v = v₀ + at relates velocity, acceleration, and time only." },
  { id: 14, topic: "Position & Velocity", question: "A runner jogs 200 m east, then 100 m west. Total distance and displacement?", choices: ["300 m, 100 m E", "100 m, 300 m E", "300 m, 300 m E", "100 m, 100 m E"], correct: 0, explanation: "Distance = 200+100 = 300 m. Displacement = 200−100 = 100 m east." },
  { id: 15, topic: "Projectile Motion", question: "Two balls are thrown: one horizontally, one dropped. Which hits the ground first?", choices: ["The dropped one", "The thrown one", "They hit at the same time", "Depends on speed"], correct: 2, explanation: "Both have the same vertical acceleration (g) and start with the same vertical velocity (0). Same fall time." },
  { id: 16, topic: "Motion Graphs", question: "The area under a v-t graph gives:", choices: ["Acceleration", "Displacement", "Speed", "Force"], correct: 1, explanation: "Area under velocity-time = ∫v dt = displacement." },
  { id: 17, topic: "Kinematic Equations", question: "A car brakes from 25 m/s to 0 in 50 m. What is the acceleration?", choices: ["−6.25 m/s²", "−12.5 m/s²", "−0.5 m/s²", "−2.5 m/s²"], correct: 0, explanation: "v² = v₀² + 2aΔx → 0 = 625 + 2a(50) → a = −6.25 m/s²." },
  { id: 18, topic: "Acceleration", question: "An object is thrown upward at 30 m/s. What is its velocity after 2 s?", choices: ["10.4 m/s up", "30 m/s up", "49.6 m/s down", "10.4 m/s down"], correct: 0, explanation: "v = 30 + (−9.8)(2) = 30 − 19.6 = 10.4 m/s (still going up)." },
  { id: 19, topic: "Motion Graphs", question: "A parabolic x-t graph indicates:", choices: ["Constant velocity", "Constant acceleration", "Zero acceleration", "Changing acceleration"], correct: 1, explanation: "x = x₀ + v₀t + ½at² is a parabola when a is constant and nonzero." },
  { id: 20, topic: "Projectile Motion", question: "In projectile motion, the horizontal acceleration is:", choices: ["g", "0", "−g", "Depends on angle"], correct: 1, explanation: "With no air resistance, there is no horizontal force, so aₓ = 0. Horizontal velocity is constant." },
];

export function PracticeQuiz() {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(0);
  const { addMistake } = useMistakes();

  const q = questions[current];
  const done = answered === questions.length;

  const handleAnswer = (idx: number) => {
    if (showAnswer) return;
    setSelected(idx);
    setShowAnswer(true);
    setAnswered(a => a + 1);
    if (idx === q.correct) {
      setScore(s => s + 1);
    } else {
      addMistake({ unit: "kinematics", topic: q.topic, question: q.question, yourAnswer: q.choices[idx], correctAnswer: q.choices[q.correct], timestamp: Date.now() });
    }
  };

  const next = () => {
    setSelected(null);
    setShowAnswer(false);
    setCurrent(c => c + 1);
  };

  if (done) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader><CardTitle>Quiz Complete!</CardTitle></CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-4xl font-bold font-mono">{score}/{questions.length}</p>
          <p className="text-muted-foreground">{score >= 18 ? "Excellent!" : score >= 14 ? "Good work!" : score >= 10 ? "Keep studying!" : "Review the topics and try again."}</p>
          <Progress value={(score / questions.length) * 100} className="h-3" />
          <Button onClick={() => { setCurrent(0); setScore(0); setAnswered(0); setSelected(null); setShowAnswer(false); }} className="cursor-pointer">Retry Quiz</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Question {current + 1} of {questions.length}</CardTitle>
          <Badge variant="secondary" className="font-mono">{score}/{answered}</Badge>
        </div>
        <Progress value={(current / questions.length) * 100} className="h-1.5" />
      </CardHeader>
      <CardContent className="space-y-4">
        <Badge variant="outline" className="text-xs">{q.topic}</Badge>
        <p className="text-base font-medium">{q.question}</p>
        <div className="grid gap-2">
          {q.choices.map((c, i) => (
            <button
              key={i}
              onClick={() => handleAnswer(i)}
              disabled={showAnswer}
              className={`w-full cursor-pointer rounded-lg border px-4 py-3 text-left text-sm transition-colors ${
                showAnswer
                  ? i === q.correct ? "border-green-500 bg-green-500/10" : i === selected ? "border-red-500 bg-red-500/10" : ""
                  : "hover:bg-muted"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
        {showAnswer && (
          <div className="rounded-lg bg-muted/50 border p-3">
            <p className="text-sm text-muted-foreground">{q.explanation}</p>
          </div>
        )}
        {showAnswer && current < questions.length - 1 && (
          <Button onClick={next} className="cursor-pointer">Next Question</Button>
        )}
        {showAnswer && current === questions.length - 1 && (
          <Button onClick={() => setAnswered(questions.length)} className="cursor-pointer">See Results</Button>
        )}
      </CardContent>
    </Card>
  );
}
