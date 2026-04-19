"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type Shortcut = {
  key: string;
  label: string;
};

type Group = {
  heading: string;
  items: Shortcut[];
};

const GROUPS: Group[] = [
  {
    heading: "Global",
    items: [
      { key: "?", label: "Show this shortcut list" },
      { key: "Esc", label: "Close dialogs and overlays" },
    ],
  },
  {
    heading: "Practice quiz",
    items: [
      { key: "1 – 4", label: "Select an answer choice" },
      { key: "Enter", label: "Advance to the next question" },
    ],
  },
  {
    heading: "Timed test",
    items: [
      { key: "1 – 4", label: "Select an answer choice" },
      { key: "← / →", label: "Move between questions" },
      { key: "Enter", label: "Advance (Submit on last question)" },
    ],
  },
  {
    heading: "FRQ practice",
    items: [
      { key: "Ctrl/Cmd + Enter", label: "Submit the current part" },
    ],
  },
];

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  return tag === "INPUT" || tag === "TEXTAREA" || target.isContentEditable;
}

export function ShortcutsHelp() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "?") return;
      if (isTypingTarget(event.target)) return;
      if (event.ctrlKey || event.metaKey || event.altKey) return;
      event.preventDefault();
      setOpen((value) => !value);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Keyboard shortcuts</DialogTitle>
          <DialogDescription>
            Press <kbd className="rounded border bg-muted px-1 font-mono text-[10px]">?</kbd> any
            time to open this panel.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 pt-1 text-sm">
          {GROUPS.map((group) => (
            <div key={group.heading}>
              <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                {group.heading}
              </p>
              <ul className="space-y-1">
                {group.items.map((item) => (
                  <li
                    key={`${group.heading}-${item.key}`}
                    className="flex items-center justify-between gap-4"
                  >
                    <span className="text-foreground/80">{item.label}</span>
                    <kbd className="rounded border bg-muted px-1.5 py-0.5 font-mono text-[11px] text-foreground">
                      {item.key}
                    </kbd>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
