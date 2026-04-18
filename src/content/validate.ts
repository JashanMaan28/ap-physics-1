import {
  flashcardDeckSchema,
  unitPracticeBankSchema,
} from "./schema";
import { unitPracticeBanks } from "./practice/banks";
import { kinematicsFlashcards } from "./kinematics/flashcards";
import { dynamicsFlashcards } from "./dynamics/flashcards";
import { energyFlashcards } from "./energy/flashcards";
import { momentumFlashcards } from "./momentum/flashcards";
import { torqueFlashcards } from "./torque/flashcards";
import { rotatingSystemsFlashcards } from "./rotating-systems/flashcards";
import { oscillationsFlashcards } from "./oscillations/flashcards";
import { fluidsFlashcards } from "./fluids/flashcards";

interface Failure {
  name: string;
  message: string;
}

function check<T>(
  name: string,
  schema: { safeParse: (data: unknown) => { success: boolean; error?: { issues: unknown } } },
  value: T,
  failures: Failure[],
) {
  const result = schema.safeParse(value);
  if (!result.success) {
    failures.push({ name, message: JSON.stringify(result.error?.issues, null, 2) });
  }
}

export function validateAllContent(): { ok: boolean; failures: Failure[] } {
  const failures: Failure[] = [];

  check("flashcards/kinematics", flashcardDeckSchema, kinematicsFlashcards, failures);
  check("flashcards/dynamics", flashcardDeckSchema, dynamicsFlashcards, failures);
  check("flashcards/energy", flashcardDeckSchema, energyFlashcards, failures);
  check("flashcards/momentum", flashcardDeckSchema, momentumFlashcards, failures);
  check("flashcards/torque", flashcardDeckSchema, torqueFlashcards, failures);
  check("flashcards/rotating-systems", flashcardDeckSchema, rotatingSystemsFlashcards, failures);
  check("flashcards/oscillations", flashcardDeckSchema, oscillationsFlashcards, failures);
  check("flashcards/fluids", flashcardDeckSchema, fluidsFlashcards, failures);

  for (const [slug, bank] of Object.entries(unitPracticeBanks)) {
    check(`practice/${slug}`, unitPracticeBankSchema, bank, failures);
  }

  return { ok: failures.length === 0, failures };
}
