"use client";

import { Fragment } from "react";
import { Tex } from "@/components/ui/math";
import { autoWrapMath, looksLikeEquation, toLatex } from "@/lib/latex";

interface PhysicsTextProps {
  /** Raw text that may contain equations mixed with prose, possibly with \n separators. */
  children: string;
  /** Render block-style (display math for equation lines). */
  display?: boolean;
  /** Class applied to the root wrapper. */
  className?: string;
}

/**
 * Renders a possibly-mixed physics string. Splits on newlines; any line that
 * looks like an equation is rendered through KaTeX (display math), while
 * prose lines render as plain text. Inline math enclosed in `$…$` is also
 * rendered regardless of the per-line heuristic.
 */
export function PhysicsText({ children, display = true, className }: PhysicsTextProps) {
  if (!children) return null;

  const lines = children.split(/\r?\n/);

  return (
    <div className={className}>
      {lines.map((line, i) => (
        <Fragment key={i}>
          <Line line={line} display={display} />
          {i < lines.length - 1 && <br />}
        </Fragment>
      ))}
    </div>
  );
}

function Line({ line, display }: { line: string; display: boolean }) {
  const trimmed = line.trim();
  if (!trimmed) return <span>&nbsp;</span>;

  // If the author included inline math via $…$, honor it.
  if (/\$[^$]+\$/.test(line)) {
    return <InlineMixed line={line} />;
  }

  // Try to detect equation spans embedded in prose and wrap them so
  // InlineMixed can render just those spans as math.
  const wrapped = autoWrapMath(line);
  if (wrapped !== line) {
    return <InlineMixed line={wrapped} />;
  }

  if (looksLikeEquation(line)) {
    return <Tex display={display}>{toLatex(line)}</Tex>;
  }

  return <span>{line}</span>;
}

function InlineMixed({ line }: { line: string }) {
  // Split on $…$ segments so we can interleave text and math.
  const parts = line.split(/(\$[^$]+\$)/g);
  return (
    <span>
      {parts.map((part, i) => {
        if (part.startsWith("$") && part.endsWith("$")) {
          return (
            <Tex key={i} display={false}>
              {toLatex(part.slice(1, -1))}
            </Tex>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </span>
  );
}
