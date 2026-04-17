/**
 * Convert legacy Unicode physics notation (ρgh, v₀, ½kx², etc.) into
 * LaTeX that KaTeX can render nicely.
 *
 * This runs client-side at render time — cheap pure string work.
 */

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
  "½": "\\tfrac{1}{2}",
  "⅓": "\\tfrac{1}{3}",
  "⅔": "\\tfrac{2}{3}",
  "¼": "\\tfrac{1}{4}",
  "¾": "\\tfrac{3}{4}",
  "⅕": "\\tfrac{1}{5}",
  "⅛": "\\tfrac{1}{8}",
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
  s = s.replace(/([₀₁₂₃₄₅₆₇₈₉₊₋₌₍₎ₐₑₒₓₕₖₗₘₙₚₛₜ]+)/g, (m) => {
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

  // 7) Plain-text subscripts: x_0, v_f, P_atm → x_{0}, v_{f}, P_{atm}.
  //    Only when not already followed by a brace.
  s = s.replace(/_([A-Za-z0-9]{1,5})(?![{A-Za-z0-9])/g, (_m, body) => `_{${body}}`);

  // 8) Plain-text superscripts: x^2, v^max → x^{2}, v^{max}.
  s = s.replace(/\^([A-Za-z0-9]{1,5})(?![{A-Za-z0-9])/g, (_m, body) => `^{${body}}`);

  // 9) ASCII fractions like (1/2) inside an expression are left alone —
  //    authors can opt in via \tfrac or \frac explicitly.

  return s;
}

/**
 * Quick heuristic: does a line look like a physics equation?
 * Used by PhysicsText to decide whether to render a given line via KaTeX.
 */
export function looksLikeEquation(line: string): boolean {
  const trimmed = line.trim();
  if (!trimmed) return false;
  // Needs at least one of: =, operator, greek, sub/superscript unicode.
  const hasEqualsOrOp = /[=<>≤≥≈≠]|\+|-|\*|\/|·|×/.test(trimmed);
  const hasMathToken =
    /[α-ωΑ-Ω]|[₀-₉]|[⁰-⁹]|[½⅓¼¾⅔⅕⅛]|\\[a-zA-Z]|\^|_/.test(trimmed);
  // Reject if it's mostly words (4+ consecutive alphabetic chars dominate).
  const words = trimmed.split(/\s+/);
  const wordyRatio =
    words.filter((w) => /^[A-Za-z][A-Za-z]{3,}$/.test(w) && !/[₀-₉⁰-⁹]/.test(w)).length /
    Math.max(1, words.length);
  if (wordyRatio > 0.6) return false;
  return hasEqualsOrOp || hasMathToken;
}
