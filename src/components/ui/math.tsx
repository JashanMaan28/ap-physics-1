"use client";

import { Fragment, useMemo, useState } from "react";
import katex from "katex";
import "katex/dist/katex.min.css";
import { autoWrapMath, looksLikeInlineMath, toLatex } from "@/lib/latex";

interface MathProps {
  children: string;
  display?: boolean;
  className?: string;
}

export function Tex({ children, display = false, className = "" }: MathProps) {
  const html = useMemo(() => {
    try {
      return katex.renderToString(children, {
        displayMode: display,
        throwOnError: false,
        strict: false,
      });
    } catch {
      return children;
    }
  }, [children, display]);

  const [copied, setCopied] = useState(false);

  const copySource = async () => {
    if (typeof navigator === "undefined" || !navigator.clipboard) return;
    try {
      await navigator.clipboard.writeText(children);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1200);
    } catch {
      /* noop */
    }
  };

  if (display) {
    return (
      <div className={`group relative ${className}`}>
        <div
          className="overflow-x-auto py-2 pr-10"
          dangerouslySetInnerHTML={{ __html: html }}
        />
        <button
          type="button"
          onClick={copySource}
          aria-label={copied ? "LaTeX copied" : "Copy LaTeX source"}
          title={copied ? "Copied!" : "Copy LaTeX"}
          className="absolute right-1 top-1 rounded-md border border-border/60 bg-background/80 p-1 text-muted-foreground opacity-0 shadow-sm transition-opacity hover:text-foreground focus-visible:opacity-100 group-hover:opacity-100"
        >
          {copied ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
            </svg>
          )}
        </button>
      </div>
    );
  }

  return (
    <span
      className={className}
      title={children}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

interface MathTextProps {
  children: string;
  className?: string;
  /**
   * When true, interpret newlines in the source and render them as line
   * breaks. Default false — single-line usage (choices, titles, labels).
   */
  multiline?: boolean;
}

/**
 * Inline-safe renderer for mixed prose + physics notation. Good for MC answer
 * choices, FRQ prompts, explanations, and other short strings where the
 * author may have used `$…$` inline math, relational-op equations ("F = ma"),
 * Unicode physics notation ("½ρv²"), or plain prose.
 *
 * Resolves to the cheapest representation that captures the content.
 */
export function MathText({ children, className = "", multiline = false }: MathTextProps) {
  if (!children) return null;
  if (!multiline) {
    return <InlineLine line={children} className={className} />;
  }
  const lines = children.split(/\r?\n/);
  return (
    <span className={className}>
      {lines.map((line, i) => (
        <Fragment key={i}>
          <InlineLine line={line} />
          {i < lines.length - 1 && <br />}
        </Fragment>
      ))}
    </span>
  );
}

function InlineLine({ line, className }: { line: string; className?: string }) {
  if (!line) return <span className={className}>&nbsp;</span>;

  // 1) Explicit `$…$` segments: honor them directly.
  if (/\$[^$]+\$/.test(line)) {
    return <InlineMixed line={line} className={className} />;
  }

  // 2) Embedded equation spans (e.g. "So F = ma here."): wrap and split.
  const wrapped = autoWrapMath(line);
  if (wrapped !== line) {
    return <InlineMixed line={wrapped} className={className} />;
  }

  // 3) The whole string reads like a math token ("2 m/s^2", "½kx²"): render
  //    it as inline math.
  if (looksLikeInlineMath(line)) {
    return (
      <Tex display={false} className={className}>
        {toLatex(line)}
      </Tex>
    );
  }

  return <span className={className}>{line}</span>;
}

function InlineMixed({ line, className }: { line: string; className?: string }) {
  const parts = line.split(/(\$[^$]+\$)/g);
  return (
    <span className={className}>
      {parts.map((part, i) => {
        if (part.startsWith("$") && part.endsWith("$")) {
          return (
            <Tex key={i} display={false}>
              {toLatex(part.slice(1, -1))}
            </Tex>
          );
        }
        return <Fragment key={i}>{part}</Fragment>;
      })}
    </span>
  );
}
