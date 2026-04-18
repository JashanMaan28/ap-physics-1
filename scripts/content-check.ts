import { validateAllContent } from "../src/content/validate";

const { ok, failures } = validateAllContent();

if (ok) {
  console.log("✓ All content passes schema validation.");
  process.exit(0);
}

console.error(`✗ ${failures.length} content file(s) failed validation:\n`);
for (const { name, message } of failures) {
  console.error(`— ${name}:`);
  console.error(message);
  console.error("");
}
process.exit(1);
