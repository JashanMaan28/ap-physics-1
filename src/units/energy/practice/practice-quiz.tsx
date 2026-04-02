"use client";

import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useMistakes } from "@/contexts/mistake-context";

interface Question {
  id: number;
  question: string;
  choices: string[];
  correct: number;
  explanation: string;
}

const questions: Question[] = [
  { id: 1, question: "A 10 N force moves an object 5 m in the direction of the force. How much work is done?", choices: ["2 J", "15 J", "50 J", "500 J"], correct: 2, explanation: "W = Fd cos0 = 10 x 5 x 1 = 50 J." },
  { id: 2, question: "What are the SI units of work?", choices: ["Watts", "Joules", "Newtons", "Pascals"], correct: 1, explanation: "Work is measured in joules (J) = N*m = kg*m^2/s^2." },
  { id: 3, question: "A force is applied perpendicular to the displacement. The work done is:", choices: ["Positive", "Negative", "Zero", "Cannot be determined"], correct: 2, explanation: "W = Fd cos90 = 0. Perpendicular forces do no work." },
  { id: 4, question: "The kinetic energy of a 2 kg object moving at 3 m/s is:", choices: ["3 J", "6 J", "9 J", "18 J"], correct: 2, explanation: "KE = 1/2 mv^2 = 0.5 x 2 x 9 = 9 J." },
  { id: 5, question: "If you double the speed of an object, its kinetic energy:", choices: ["Doubles", "Triples", "Quadruples", "Stays the same"], correct: 2, explanation: "KE is proportional to v^2. Doubling v quadruples KE." },
  { id: 6, question: "A 5 kg object is 4 m above the ground. Its gravitational PE is (g=10 m/s^2):", choices: ["20 J", "50 J", "100 J", "200 J"], correct: 3, explanation: "PE = mgh = 5 x 10 x 4 = 200 J." },
  { id: 7, question: "A spring with k=100 N/m is compressed 0.2 m. The elastic PE is:", choices: ["1 J", "2 J", "10 J", "20 J"], correct: 1, explanation: "PE = 1/2 kx^2 = 0.5 x 100 x 0.04 = 2 J." },
  { id: 8, question: "A ball is dropped from rest. As it falls (no air resistance), its:", choices: ["KE increases, PE decreases", "KE decreases, PE increases", "Both increase", "Both decrease"], correct: 0, explanation: "Gravity converts PE to KE. Total mechanical energy is conserved." },
  { id: 9, question: "A 1000 W engine does how much work in 10 seconds?", choices: ["100 J", "1000 J", "10000 J", "100000 J"], correct: 2, explanation: "P = W/t, so W = Pt = 1000 x 10 = 10000 J." },
  { id: 10, question: "Power is measured in:", choices: ["Joules", "Newtons", "Watts", "Pascals"], correct: 2, explanation: "Power is measured in watts (W) = J/s." },
  { id: 11, question: "The work-energy theorem states that net work equals:", choices: ["Change in PE", "Change in KE", "Total energy", "Power times time"], correct: 1, explanation: "W_net = Delta KE. Net work equals the change in kinetic energy." },
  { id: 12, question: "A 50 kg person climbs 3 m stairs in 5 s. Their power output is (g=10):", choices: ["30 W", "150 W", "300 W", "1500 W"], correct: 2, explanation: "P = W/t = mgh/t = 50 x 10 x 3 / 5 = 300 W." },
  { id: 13, question: "Which is a non-conservative force?", choices: ["Gravity", "Spring force", "Friction", "Electrostatic force"], correct: 2, explanation: "Friction is non-conservative because the work done depends on the path taken." },
  { id: 14, question: "A roller coaster at the top of a hill has mostly:", choices: ["Kinetic energy", "Potential energy", "Thermal energy", "No energy"], correct: 1, explanation: "At the top, speed is minimum and height is maximum, so PE dominates." },
  { id: 15, question: "Negative work means the force:", choices: ["Is zero", "Is perpendicular", "Opposes displacement", "Aids displacement"], correct: 2, explanation: "Negative work occurs when the force has a component opposing displacement (angle > 90)." },
  { id: 16, question: "A car engine provides 5000 N of force at 20 m/s. The power is:", choices: ["250 W", "5020 W", "25000 W", "100000 W"], correct: 3, explanation: "P = Fv = 5000 x 20 = 100000 W = 100 kW." },
  { id: 17, question: "Conservation of energy applies when:", choices: ["Only gravity acts", "Only conservative forces do work", "Friction is present", "Velocity is constant"], correct: 1, explanation: "Mechanical energy is conserved when only conservative forces do work." },
  { id: 18, question: "A pendulum at its lowest point has:", choices: ["Max PE, zero KE", "Max KE, zero PE (if ref at lowest)", "Equal KE and PE", "Zero total energy"], correct: 1, explanation: "At the lowest point, all PE has been converted to KE (using lowest point as reference)." },
  { id: 19, question: "1 horsepower is approximately:", choices: ["100 W", "500 W", "746 W", "1000 W"], correct: 2, explanation: "1 hp = 746 watts." },
  { id: 20, question: "A 0.5 kg ball is thrown upward at 10 m/s. Its max height is (g=10):", choices: ["2 m", "5 m", "10 m", "20 m"], correct: 1, explanation: "Using conservation: 1/2 mv^2 = mgh, so h = v^2/(2g) = 100/20 = 5 m." },
];

export function PracticeQuiz() {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const { addMistake } = useMistakes();

  const handleSelect = (qId: number, choiceIdx: number) => {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [qId]: choiceIdx }));
  };

  const handleSubmit = () => {
    setSubmitted(true);
    questions.forEach((q) => {
      if (answers[q.id] !== undefined && answers[q.id] !== q.correct) {
        addMistake({
          unit: "energy",
          topic: "energy",
          question: q.question,
          yourAnswer: q.choices[answers[q.id]],
          correctAnswer: q.choices[q.correct],
          timestamp: Date.now(),
        });
      }
    });
  };

  const handleReset = () => {
    setAnswers({});
    setSubmitted(false);
  };

  const score = submitted
    ? questions.filter((q) => answers[q.id] === q.correct).length
    : null;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Practice Quiz: Work, Energy, and Power</CardTitle>
          <CardDescription>
            20 multiple-choice questions covering all topics in Unit 3.
          </CardDescription>
          {submitted && score !== null && (
            <Badge variant={score >= 16 ? "default" : "destructive"} className="w-fit">
              Score: {score}/20 ({Math.round((score / 20) * 100)}%)
            </Badge>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          {questions.map((q, qi) => (
            <Card key={q.id} className={submitted ? (answers[q.id] === q.correct ? "border-green-300 bg-green-50" : "border-red-300 bg-red-50") : ""}>
              <CardContent className="pt-4">
                <p className="font-medium mb-2">
                  {qi + 1}. {q.question}
                </p>
                <div className="space-y-1">
                  {q.choices.map((c, ci) => (
                    <button
                      key={ci}
                      onClick={() => handleSelect(q.id, ci)}
                      className={`block w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                        answers[q.id] === ci
                          ? submitted
                            ? ci === q.correct
                              ? "bg-green-200 font-semibold"
                              : "bg-red-200 font-semibold"
                            : "bg-amber-200 font-semibold"
                          : submitted && ci === q.correct
                            ? "bg-green-100"
                            : "hover:bg-gray-100"
                      }`}
                    >
                      {String.fromCharCode(65 + ci)}. {c}
                    </button>
                  ))}
                </div>
                {submitted && (
                  <p className="text-sm mt-2 text-gray-700">
                    <strong>Explanation:</strong> {q.explanation}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}

          <Separator />

          <div className="flex gap-3">
            {!submitted ? (
              <Button
                onClick={handleSubmit}
                disabled={Object.keys(answers).length < questions.length}
                className="flex-1"
              >
                Submit Quiz ({Object.keys(answers).length}/{questions.length} answered)
              </Button>
            ) : (
              <Button onClick={handleReset} variant="outline" className="flex-1">
                Retake Quiz
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
