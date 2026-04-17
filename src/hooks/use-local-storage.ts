"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// Module-level registry: hook instances sharing a key notify each other so
// sibling consumers on the same page stay in sync without round-tripping
// through a DOM event during React's render phase.
const subscribers = new Map<string, Set<() => void>>();

function subscribeKey(key: string, callback: () => void): () => void {
  let set = subscribers.get(key);
  if (!set) {
    set = new Set();
    subscribers.set(key, set);
  }
  set.add(callback);
  return () => {
    const current = subscribers.get(key);
    if (!current) return;
    current.delete(callback);
    if (current.size === 0) subscribers.delete(key);
  };
}

function notifyKey(key: string) {
  const set = subscribers.get(key);
  if (!set) return;
  set.forEach((cb) => cb());
}

function readRaw(key: string): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function parseOr<T>(raw: string | null, fallback: T): T {
  if (raw === null) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

/**
 * Persist state in localStorage with SSR-safe initialization and cross-tab
 * sync. The hook returns `defaultValue` on the server and during the first
 * client render; on mount it hydrates from storage and then behaves like
 * ordinary React state that is mirrored to localStorage.
 *
 * A module-level subscriber registry keeps multiple hook instances with
 * the same key in sync within a tab; the native `storage` event handles
 * cross-tab sync. A last-persisted guard prevents the effect-based
 * persistence from echoing back into an infinite loop.
 */
export function useLocalStorage<T>(
  key: string,
  defaultValue: T,
): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  // The default value is captured once on mount. Callers should pass a
  // stable reference (module-level constant) if they re-render.
  const defaultRef = useRef(defaultValue);

  const [value, setValueState] = useState<T>(defaultValue);
  const lastSerializedRef = useRef<string | null>(null);
  const hydratedRef = useRef(false);

  // Hydrate on mount (and when the key changes).
  useEffect(() => {
    const raw = readRaw(key);
    lastSerializedRef.current = raw;
    hydratedRef.current = true;
    setValueState(parseOr(raw, defaultRef.current));
  }, [key]);

  // Listen for same-tab (registry) and cross-tab (storage event) changes.
  useEffect(() => {
    const sync = () => {
      const raw = readRaw(key);
      lastSerializedRef.current = raw;
      setValueState(parseOr(raw, defaultRef.current));
    };
    const handleStorage = (event: StorageEvent) => {
      if (event.key !== null && event.key !== key) return;
      sync();
    };
    window.addEventListener("storage", handleStorage);
    const unsub = subscribeKey(key, sync);
    return () => {
      window.removeEventListener("storage", handleStorage);
      unsub();
    };
  }, [key]);

  // Persist whenever the in-memory value changes, but skip the echo when
  // the current value already matches what we last read from storage.
  useEffect(() => {
    if (!hydratedRef.current) return;
    if (typeof window === "undefined") return;
    try {
      const serialized = JSON.stringify(value);
      if (serialized === lastSerializedRef.current) return;
      window.localStorage.setItem(key, serialized);
      lastSerializedRef.current = serialized;
      notifyKey(key);
    } catch {
      // ignore
    }
  }, [value, key]);

  const setValue = useCallback((next: T | ((prev: T) => T)) => {
    setValueState((prev) =>
      typeof next === "function" ? (next as (p: T) => T)(prev) : next,
    );
  }, []);

  const remove = useCallback(() => {
    if (typeof window !== "undefined") {
      try {
        window.localStorage.removeItem(key);
        lastSerializedRef.current = null;
        notifyKey(key);
      } catch {
        // ignore
      }
    }
    setValueState(defaultRef.current);
  }, [key]);

  return [value, setValue, remove];
}
