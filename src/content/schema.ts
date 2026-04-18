import { z } from "zod";

// Flashcards. Decks vary in shape — some have id/topic, others just front/back,
// and a few group by "category". The schema keeps extras optional and ignores
// unknown string fields so every existing deck passes as-is.
export const flashcardSchema = z
  .object({
    id: z.union([z.string(), z.number()]).optional(),
    topic: z.string().optional(),
    category: z.string().optional(),
    front: z.string().min(1),
    back: z.string().min(1),
  })
  .catchall(z.unknown());

export const flashcardDeckSchema = z.array(flashcardSchema).min(1);

export type Flashcard = z.infer<typeof flashcardSchema>;
export type FlashcardDeck = z.infer<typeof flashcardDeckSchema>;

// Practice question banks (already centralized in src/content/practice/banks.ts).
export const practiceChoiceQuestionSchema = z.object({
  id: z.string().min(1),
  unitSlug: z.string().min(1),
  topicKey: z.string().min(1),
  prompt: z.string().min(1),
  choices: z.array(z.string().min(1)).min(2),
  answer: z.number().int().nonnegative(),
  explanation: z.string().min(1),
});

export const practiceFrqPartSchema = z.object({
  label: z.string().min(1),
  question: z.string().min(1),
  points: z.number().nonnegative(),
  rubric: z.array(z.string()).min(1),
  sampleResponse: z.string().min(1),
});

export const practiceFrqProblemSchema = z.object({
  id: z.string().min(1),
  unitSlug: z.string().min(1),
  topicKey: z.string().min(1),
  title: z.string().min(1),
  scenario: z.string().min(1),
  given: z.array(z.string()),
  parts: z.array(practiceFrqPartSchema).min(1),
});

export const unitPracticeBankSchema = z
  .object({
    unitSlug: z.string().min(1),
    quizQuestions: z.array(practiceChoiceQuestionSchema),
    frqProblems: z.array(practiceFrqProblemSchema),
  })
  .superRefine((bank, ctx) => {
    bank.quizQuestions.forEach((q, i) => {
      if (q.answer >= q.choices.length) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["quizQuestions", i, "answer"],
          message: `answer index ${q.answer} out of range for ${q.choices.length} choices`,
        });
      }
      if (q.unitSlug !== bank.unitSlug) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["quizQuestions", i, "unitSlug"],
          message: `quiz question unitSlug "${q.unitSlug}" does not match bank slug "${bank.unitSlug}"`,
        });
      }
    });
    bank.frqProblems.forEach((p, i) => {
      if (p.unitSlug !== bank.unitSlug) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["frqProblems", i, "unitSlug"],
          message: `FRQ unitSlug "${p.unitSlug}" does not match bank slug "${bank.unitSlug}"`,
        });
      }
    });
  });
