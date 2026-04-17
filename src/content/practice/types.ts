export interface PracticeChoiceQuestion {
  id: string;
  unitSlug: string;
  topicKey: string;
  prompt: string;
  choices: string[];
  answer: number;
  explanation: string;
}

export interface PracticeFrqPart {
  label: string;
  question: string;
  points: number;
  rubric: string[];
  sampleResponse: string;
}

export type PracticeFrqDifficulty = "easy" | "medium" | "hard";

export interface PracticeFrqProblem {
  id: string;
  unitSlug: string;
  topicKey: string;
  title: string;
  scenario: string;
  given: string[];
  parts: PracticeFrqPart[];
  difficulty?: PracticeFrqDifficulty;
  estimatedMinutes?: number;
}

export interface UnitPracticeBank {
  unitSlug: string;
  quizQuestions: PracticeChoiceQuestion[];
  frqProblems: PracticeFrqProblem[];
}
