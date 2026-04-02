"use client";

import { useMemo } from "react";
import katex from "katex";
import "katex/dist/katex.min.css";

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

  if (display) {
    return (
      <div
        className={`overflow-x-auto py-2 ${className}`}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }

  return (
    <span
      className={className}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
