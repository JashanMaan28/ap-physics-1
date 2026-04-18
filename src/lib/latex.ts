/**
 * Convert legacy Unicode physics notation (ρgh, v₀, ½kx², etc.) into
 * LaTeX that KaTeX can render nicely.
 *
 * This runs client-side at render time — cheap pure string work.
 */

// NOTE: Multi-char LaTeX commands include a trailing space so that an
// adjacent identifier (e.g. `Δx` → `\Delta x`) doesn't glue to the command.
const GREEK_MAP: Record<string, string> = {
  "α": "\\alpha ", "β": "\\beta ", "γ": "\\gamma ", "δ": "\\delta ",
  "ε": "\\varepsilon ", "ζ": "\\zeta ", "η": "\\eta ", "θ": "\\theta ",
  "ι": "\\iota ", "κ": "\\kappa ", "λ": "\\lambda ", "μ": "\\mu ",
  "ν": "\\nu ", "ξ": "\\xi ", "π": "\\pi ", "ρ": "\\rho ",
  "σ": "\\sigma ", "τ": "\\tau ", "υ": "\\upsilon ", "φ": "\\varphi ",
  "χ": "\\chi ", "ψ": "\\psi ", "ω": "\\omega ",
  "Α": "A", "Β": "B", "Γ": "\\Gamma ", "Δ": "\\Delta ",
  "Ε": "E", "Ζ": "Z", "Η": "H", "Θ": "\\Theta ",
  "Ι": "I", "Κ": "K", "Λ": "\\Lambda ", "Μ": "M",
  "Ν": "N", "Ξ": "\\Xi ", "Π": "\\Pi ", "Ρ": "P",
  "Σ": "\\Sigma ", "Τ": "T", "Υ": "\\Upsilon ", "Φ": "\\Phi ",
  "Χ": "X", "Ψ": "\\Psi ", "Ω": "\\Omega ",
};

const SUB_MAP: Record<string, string> = {
  "₀": "0", "₁": "1", "₂": "2", "₃": "3", "₄": "4",
  "₅": "5", "₆": "6", "₇": "7", "₈": "8", "₉": "9",
  "₊": "+", "₋": "-", "₌": "=", "₍": "(", "₎": ")",
  "ₐ": "a", "ₑ": "e", "ₒ": "o", "ₓ": "x", "ₕ": "h",
  "ₖ": "k", "ₗ": "l", "ₘ": "m", "ₙ": "n", "ₚ": "p",
  "ₛ": "s", "ₜ": "t",
  // Latin/Greek subscript letters used in physics notation.
  // ᵧ is Greek gamma but is conventionally used for y-component in kinematics.
  "ᵢ": "i", "ᵣ": "r", "ᵤ": "u", "ᵥ": "v", "ᵧ": "y",
  "ᵦ": "\\beta", "ᵨ": "\\rho", "ᵩ": "\\varphi", "ᵪ": "\\chi",
};

const SUP_MAP: Record<string, string> = {
  "⁰": "0", "¹": "1", "²": "2", "³": "3", "⁴": "4",
  "⁵": "5", "⁶": "6", "⁷": "7", "⁸": "8", "⁹": "9",
  "⁺": "+", "⁻": "-", "⁼": "=", "⁽": "(", "⁾": ")",
  "ⁿ": "n",
};

const SYMBOL_MAP: Record<string, string> = {
  "·": " \\cdot ",
  "×": " \\times ",
  "÷": " \\div ",
  "≈": " \\approx ",
  "≠": " \\neq ",
  "≤": " \\leq ",
  "≥": " \\geq ",
  "±": " \\pm ",
  "∓": " \\mp ",
  "∞": "\\infty ",
  "∝": " \\propto ",
  "→": " \\rightarrow ",
  "←": " \\leftarrow ",
  "↔": " \\leftrightarrow ",
  "⇒": " \\Rightarrow ",
  "°": "^{\\circ}",
  "∑": "\\sum ",
  "∫": "\\int ",
  "∂": "\\partial ",
  "∇": "\\nabla ",
  // Unicode √ is handled in toLatex step 6 (see below) rather than mapped
  // here, so `√(…)` doesn't get double-escaped into `\\sqrt …`.
  "½": "\\dfrac{1}{2}",
  "⅓": "\\dfrac{1}{3}",
  "⅔": "\\dfrac{2}{3}",
  "¼": "\\dfrac{1}{4}",
  "¾": "\\dfrac{3}{4}",
  "⅕": "\\dfrac{1}{5}",
  "⅛": "\\dfrac{1}{8}",
  "…": "\\ldots ",
  "−": "-",
};

function mapRun(s: string, map: Record<string, string>): string {
  let out = "";
  for (const ch of s) out += map[ch] ?? ch;
  return out;
}

/**
 * Convert a string of legacy physics notation into KaTeX-compatible LaTeX.
 * Handles: Greek letters, Unicode sub/superscripts, common symbols, and
 * ASCII patterns like `v_0`, `x^2`, `sqrt(...)`.
 */
export function toLatex(input: string): string {
  if (!input) return "";
  let s = input;

  // 1) Preserve any explicit backslashes/LaTeX commands already present.
  //    We run all transforms, which are idempotent on typical LaTeX.

  // 2) Map Greek letters to LaTeX commands, but ONLY when the letter
  //    is standalone (not inside an already-typed identifier). We just
  //    replace globally — KaTeX handles \rho g h just fine.
  s = mapRun(s, GREEK_MAP);

  // 3) Collapse runs of Unicode subscripts into _{…}.
  s = s.replace(/([₀₁₂₃₄₅₆₇₈₉₊₋₌₍₎ₐₑₒₓₕₖₗₘₙₚₛₜᵢᵣᵤᵥᵧᵦᵨᵩᵪ]+)/g, (m) => {
    const body = mapRun(m, SUB_MAP);
    return `_{${body}}`;
  });

  // 4) Collapse runs of Unicode superscripts into ^{…}.
  s = s.replace(/([⁰¹²³⁴⁵⁶⁷⁸⁹⁺⁻⁼⁽⁾ⁿ]+)/g, (m) => {
    const body = mapRun(m, SUP_MAP);
    return `^{${body}}`;
  });

  // 5) Other symbols (·, ×, fractions, …). Unicode √ is handled in step 6
  //    to avoid double-escaping when followed by parentheses.
  s = mapRun(s, SYMBOL_MAP);

  // 6) Sqrt handling — Unicode √ and ASCII sqrt, with or without parens.
  s = s.replace(/√\s*\(([^()]+)\)/g, (_m, body) => `\\sqrt{${body}}`);
  s = s.replace(/\bsqrt\s*\(([^()]+)\)/g, (_m, body) => `\\sqrt{${body}}`);
  // Bare √token such as √2 or √g.
  s = s.replace(/√\s*([A-Za-z0-9]+)/g, (_m, body) => `\\sqrt{${body}}`);
  // Any remaining stray √ — fall back to the command form.
  s = s.replace(/√/g, "\\sqrt");

  // 6b) Auto-subscript: a single letter followed immediately by digit(s)
  //     is treated as a subscript (`v0` → `v_{0}`, `H2O` → `H_{2}O`, `x10`
  //     → `x_{10}`). Runs before explicit-underscore handling so both paths
  //     land at the same normalized form.
  s = s.replace(/([A-Za-z])(\d+)(?=\D|$)/g, "$1_{$2}");

  // 7) Plain-text subscripts: x_0, v_f, P_atm → x_{0}, v_{f}, P_{atm}.
  //    Only when not already followed by a brace.
  s = s.replace(/_([A-Za-z0-9]{1,5})(?![{A-Za-z0-9])/g, (_m, body) => `_{${body}}`);

  // 8) Plain-text superscripts: x^2, v^max → x^{2}, v^{max}.
  s = s.replace(/\^([A-Za-z0-9]{1,5})(?![{A-Za-z0-9])/g, (_m, body) => `^{${body}}`);

  // 8b) Upgrade bare `sin(`, `cos(`, etc. to proper LaTeX operators so they
  //     render upright with standard spacing.
  s = s.replace(/\b(sin|cos|tan|sec|csc|cot|log|ln|exp)(\^|\()/g, "\\$1$2");

  // 9) Fold `a / b` into `\frac{a}{b}` so divisions stack vertically.
  //    Numerator/denominator extend from the `/` out to the nearest
  //    low-precedence boundary (`=`, `+`, `-`, `,`, `;`, `<`, `>`) or
  //    edge of string, respecting balanced `(…)` and `{…}` groups.
  s = slashToFrac(s);

  return s;
}

// A "unit atom" is a short letter sequence, optionally with a numeric
// superscript (e.g. `m`, `kg`, `s`, `m^{2}`, `m^{-3}`). Unit divisions like
// `m/s` or `kg/m^{3}` should stay as slashes, not be folded into fractions.
const UNIT_ATOM_RE = /^[A-Za-z]{1,4}(?:\^\{?-?\d+\}?)?$/;

function isUnitToken(s: string): boolean {
  return UNIT_ATOM_RE.test(s.trim());
}

function slashToFrac(input: string): string {
  // Walk left-to-right; each `/` we see gets replaced (unless we can't
  // identify both sides cleanly) so nested divisions like `a/b/c` become
  // `\frac{\frac{a}{b}}{c}` through repeated rewrites of the output buffer.
  const BOUNDARIES = new Set(["=", "+", "<", ">", ",", ";"]);
  let out = "";
  let i = 0;
  while (i < input.length) {
    if (input[i] !== "/") {
      out += input[i];
      i++;
      continue;
    }

    // Numerator: scan back through `out`, respecting balanced groups.
    const numStart = scanBack(out, out.length, BOUNDARIES);
    // Denominator: scan forward in `input` starting after the `/`.
    const denomEnd = scanForward(input, i + 1, BOUNDARIES);
    const num = out.slice(numStart).trim();
    const denom = input.slice(i + 1, denomEnd).trim();

    if (!num || !denom) {
      out += "/";
      i++;
      continue;
    }

    // Detect unit-style divisions. If either (a) the numerator is a bare
    // unit token on both sides, or (b) the numerator ends with a value-and-
    // unit combo like "6.0 m" where the unit is adjacent to the slash, keep
    // the slash so it renders as "m/s" rather than a stacked fraction.
    const trailingUnit = /(^|\s)([A-Za-z]{1,4}(?:\^\{?-?\d+\}?)?)\s*$/.exec(num);
    if (trailingUnit && isUnitToken(denom)) {
      // Keep the value portion, then emit "unit/denom" unchanged.
      const unit = trailingUnit[2];
      const valuePart = num.slice(0, num.length - unit.length).trimEnd();
      out = out.slice(0, numStart) + (valuePart ? valuePart + " " : "") + unit + "/" + denom;
      i = denomEnd;
      continue;
    }

    out = out.slice(0, numStart) + "\\dfrac{" + num + "}{" + denom + "}";
    i = denomEnd;
  }
  return out;
}

function scanBack(s: string, end: number, boundaries: Set<string>): number {
  // Returns the index where the numerator begins. Walks left from `end`.
  let j = end;
  let depthParen = 0;
  let depthBrace = 0;
  // Skip trailing whitespace.
  while (j > 0 && /\s/.test(s[j - 1])) j--;
  while (j > 0) {
    const ch = s[j - 1];
    if (ch === ")") depthParen++;
    else if (ch === "(") {
      if (depthParen === 0) break;
      depthParen--;
    } else if (ch === "}") depthBrace++;
    else if (ch === "{") {
      if (depthBrace === 0) break;
      depthBrace--;
    } else if (depthParen === 0 && depthBrace === 0) {
      // `-` is both a boundary and a unary sign. Only treat as boundary when
      // preceded by another operator or the start of the expression, otherwise
      // it's a subtraction and should end the numerator.
      if (ch === "-" || boundaries.has(ch)) break;
    }
    j--;
  }
  // Skip leading whitespace back into the numerator.
  while (j < end && /\s/.test(s[j])) j++;
  return j;
}

function scanForward(s: string, start: number, boundaries: Set<string>): number {
  let j = start;
  let depthParen = 0;
  let depthBrace = 0;
  while (j < s.length && /\s/.test(s[j])) j++;
  // Allow a leading unary `-` on the denominator.
  if (j < s.length && s[j] === "-") j++;
  const origJ = j;
  while (j < s.length) {
    const ch = s[j];
    if (ch === "(") depthParen++;
    else if (ch === ")") {
      if (depthParen === 0) break;
      depthParen--;
    } else if (ch === "{") depthBrace++;
    else if (ch === "}") {
      if (depthBrace === 0) break;
      depthBrace--;
    } else if (depthParen === 0 && depthBrace === 0) {
      if (ch === "/" || ch === "-" || boundaries.has(ch)) break;
      // If we've accumulated a pure number and the next token starts with a
      // letter, the denominator is just the number — stop. This prevents
      // `1/2 at²` from folding `2 at²` into the denominator.
      if (/\s/.test(ch)) {
        const accumulated = s.slice(origJ, j).trim();
        let ns = j;
        while (ns < s.length && /\s/.test(s[ns])) ns++;
        if (/^-?\d+(?:\.\d+)?$/.test(accumulated) && ns < s.length && /[A-Za-z\\]/.test(s[ns])) {
          break;
        }
      }
    }
    j++;
  }
  return j;
}

/**
 * Find equation-like spans inside a prose line and wrap them with `$…$` so
 * downstream rendering (PhysicsText.InlineMixed) can split prose from math.
 *
 * An equation span is anchored to a relational operator (`=`, `≈`, `<`, `>`,
 * `≤`, `≥`, `≠`). The span extends outward while remaining "math-compatible",
 * stopping at 3+ letter alphabetic words (treated as prose) or
 * sentence-ending punctuation (`.`, `!`, `?`, `;`, `,`). Decimal points
 * inside numbers are preserved.
 */
export function autoWrapMath(line: string): string {
  if (!line || line.indexOf("$") !== -1) return line;
  const RELOP = /[=<>≈≤≥≠]/;
  // 2-letter English fillers that shouldn't be included in a math span, but
  // that a pure-length check would keep. Physics units like kg, Hz, Pa remain.
  const SHORT_PROSE = new Set([
    "at", "to", "in", "on", "of", "by", "is", "or", "no", "an", "as",
    "if", "so", "be", "we", "do", "he", "me", "my", "up", "us", "it",
  ]);
  const isProse = (w: string) => {
    if (!/^[A-Za-z]+$/.test(w)) return false;
    if (w.length >= 3) return true;
    return SHORT_PROSE.has(w.toLowerCase());
  };

  const pieces: string[] = [];
  let i = 0;
  while (i < line.length) {
    const m = RELOP.exec(line.slice(i));
    if (!m) {
      pieces.push(line.slice(i));
      break;
    }
    const opIdx = i + m.index;

    // Walk left from opIdx to find span start.
    let left = opIdx;
    while (left > i) {
      const ch = line[left - 1];
      if (/\s/.test(ch)) {
        let we = left - 1;
        while (we > i && /\s/.test(line[we])) we--;
        let ws = we;
        while (ws > i && /\S/.test(line[ws - 1])) ws--;
        const raw = line.slice(ws, we + 1);
        const clean = raw.replace(/^[.!?;,:"'(]+|[.!?;,:"')]+$/g, "");
        if (isProse(clean)) break;
        left = ws;
      } else {
        left--;
      }
    }
    while (left < opIdx && /\s/.test(line[left])) left++;

    // Walk right from opIdx + 1 to find span end.
    let right = opIdx + 1;
    while (right < line.length) {
      const ch = line[right];
      if (ch === "." && right > 0 && /\d/.test(line[right - 1]) && right + 1 < line.length && /\d/.test(line[right + 1])) {
        right++;
        continue;
      }
      if (/[.!?;,:]/.test(ch)) break;
      if (/\s/.test(ch)) {
        let ns = right;
        while (ns < line.length && /\s/.test(line[ns])) ns++;
        let ne = ns;
        while (ne < line.length && /\S/.test(line[ne])) ne++;
        const raw = line.slice(ns, ne);
        const term = raw.match(/[.!?;,:]+$/);
        const clean = term ? raw.slice(0, -term[0].length) : raw;
        if (isProse(clean)) break;
        if (term) {
          right = ne - term[0].length;
          break;
        }
        right = ne;
        continue;
      }
      right++;
    }
    while (right > opIdx && /\s/.test(line[right - 1])) right--;

    if (right <= left) {
      // Couldn't form a valid span; emit char literally and advance.
      pieces.push(line.slice(i, opIdx + 1));
      i = opIdx + 1;
      continue;
    }

    pieces.push(line.slice(i, left));
    pieces.push("$" + line.slice(left, right) + "$");
    i = right;
  }
  return pieces.join("");
}

/**
 * Quick heuristic: does a line look like a physics equation?
 * Used by PhysicsText to decide whether to render a given line via KaTeX.
 */
export function looksLikeEquation(line: string): boolean {
  const trimmed = line.trim();
  if (!trimmed) return false;
  // An equation must contain a *strong* relational operator. Operators like
  // +, -, *, /, ×, · appear routinely in prose ("3× your weight", "m/s") and
  // shouldn't by themselves promote a sentence to math.
  const hasRelation = /[=<>≤≥≈≠]/.test(trimmed);
  if (!hasRelation) return false;
  // Reject if it's mostly words (4+ consecutive alphabetic chars dominate).
  const words = trimmed.split(/\s+/);
  const wordyRatio =
    words.filter((w) => /^[A-Za-z][A-Za-z]{3,}$/.test(w) && !/[₀-₉⁰-⁹]/.test(w)).length /
    Math.max(1, words.length);
  if (wordyRatio > 0.6) return false;
  return true;
}
