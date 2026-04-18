/**
 * One-shot script: scan all .tsx files and add dark: variants for hardcoded
 * light-theme Tailwind classes (bg-X-50, text-X-900/800/700, border-X-200).
 *
 * Idempotent — if a dark: variant for the same kind/color is already present
 * anywhere in the class list, we skip that color to avoid duplication.
 */
import { readdir, readFile, stat, writeFile } from "node:fs/promises";
import { join } from "node:path";

const COLORS = [
  "amber", "blue", "green", "red", "purple", "yellow", "orange",
  "pink", "cyan", "teal", "indigo", "slate", "gray",
];

// Per-shade mapping from light-mode class to the dark-mode class to append.
const BG_SHADES: Record<string, string> = { "50": "500/10", "100": "500/20" };
const BORDER_SHADES: Record<string, string> = { "200": "500/30", "300": "500/40" };
const TEXT_SHADES: Record<string, string> = {
  "900": "200",
  "800": "300",
  "700": "300",
  "600": "400",
};

async function walk(dir: string): Promise<string[]> {
  const out: string[] = [];
  for (const name of await readdir(dir)) {
    const path = join(dir, name);
    const info = await stat(path);
    if (info.isDirectory()) {
      if (name === "node_modules" || name === ".next" || name.startsWith(".")) continue;
      out.push(...(await walk(path)));
    } else if (name.endsWith(".tsx") || name.endsWith(".ts")) {
      out.push(path);
    }
  }
  return out;
}

// Given a className string (without quotes), returns the transformed string.
function transform(classAttr: string): string {
  let result = classAttr;

  const tryAdd = (lightRe: RegExp, darkPrefix: string, shades: Record<string, string>) => {
    for (const color of COLORS) {
      for (const [lightShade, darkShade] of Object.entries(shades)) {
        const light = lightRe.source
          .replace("COLOR", color)
          .replace("SHADE", lightShade);
        const re = new RegExp(`\\b${light}\\b`);
        if (!re.test(result)) continue;
        const darkClass = `dark:${darkPrefix}-${color}-${darkShade}`;
        // Already present anywhere in this class list? Skip.
        if (result.includes(darkClass)) continue;
        result += ` ${darkClass}`;
      }
    }
  };

  tryAdd(/bg-COLOR-SHADE/, "bg", BG_SHADES);
  tryAdd(/border-COLOR-SHADE/, "border", BORDER_SHADES);
  tryAdd(/text-COLOR-SHADE/, "text", TEXT_SHADES);

  return result;
}

async function processFile(path: string): Promise<boolean> {
  const src = await readFile(path, "utf8");
  let changed = false;

  // Match either className="..." or className={`...`} or className={"..."}.
  // We handle the simple quoted forms; template literals are left alone to
  // avoid mangling interpolated expressions.
  const out = src.replace(
    /\bclassName\s*=\s*"([^"]+)"/g,
    (_match, body) => {
      const next = transform(body);
      if (next === body) return _match;
      changed = true;
      return `className="${next}"`;
    },
  );

  if (changed) {
    await writeFile(path, out, "utf8");
    return true;
  }
  return false;
}

const root = join(process.cwd(), "src");
const files = await walk(root);
let count = 0;
for (const f of files) {
  if (await processFile(f)) {
    count++;
    console.log("Updated:", f);
  }
}
console.log(`\nDone. ${count} files updated.`);
