"use client";

import { useCallback, useSyncExternalStore } from "react";

function subscribe(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

function readStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === "undefined") return defaultValue;
  try {
    const raw = window.localStorage.getItem(key);
    if (raw === null) return defaultValue;
    return JSON.parse(raw) as T;
  } catch {
    return defaultValue;
  }
}

/**
 * Persist state in localStorage with SSR-safe initialization and cross-tab sync.
 * Values are JSON-serialized. The server and first client render always produce
 * `defaultValue`; the stored value is adopted after hydration via useSyncExternalStore.
 */
export function useLocalStorage<T>(
  key: string,
  defaultValue: T,
): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  const value = useSyncExternalStore(
    subscribe,
    () => readStorage(key, defaultValue),
    () => defaultValue,
  );

  const setValue = useCallback(
    (next: T | ((prev: T) => T)) => {
      if (typeof window === "undefined") return;
      try {
        const current = readStorage<T>(key, defaultValue);
        const resolved =
          typeof next === "function" ? (next as (prev: T) => T)(current) : next;
        window.localStorage.setItem(key, JSON.stringify(resolved));
        // useSyncExternalStore doesn't auto-fire for same-tab writes, so nudge it.
        window.dispatchEvent(new StorageEvent("storage", { key }));
      } catch {
        // ignore
      }
    },
    [key, defaultValue],
  );

  const remove = useCallback(() => {
    if (typeof window === "undefined") return;
    window.localStorage.removeItem(key);
    window.dispatchEvent(new StorageEvent("storage", { key }));
  }, [key]);

  return [value, setValue, remove];
}
