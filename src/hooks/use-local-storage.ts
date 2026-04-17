"use client";

import { useCallback, useRef, useSyncExternalStore } from "react";

function subscribe(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

type Cache<T> = { raw: string | null; parsed: T };

function readStorage<T>(key: string, defaultValue: T, cache: Cache<T>): T {
  if (typeof window === "undefined") return defaultValue;
  try {
    const raw = window.localStorage.getItem(key);
    if (raw === null) {
      cache.raw = null;
      cache.parsed = defaultValue;
      return defaultValue;
    }
    if (raw === cache.raw) {
      return cache.parsed;
    }
    const parsed = JSON.parse(raw) as T;
    cache.raw = raw;
    cache.parsed = parsed;
    return parsed;
  } catch {
    return defaultValue;
  }
}

/**
 * Persist state in localStorage with SSR-safe initialization and cross-tab sync.
 * Values are JSON-serialized. The server and first client render always produce
 * `defaultValue`; the stored value is adopted after hydration via useSyncExternalStore.
 *
 * The parsed value is cached by the raw localStorage string so that repeated
 * getSnapshot calls return a stable reference — required to avoid infinite
 * re-render loops when T is an object.
 */
export function useLocalStorage<T>(
  key: string,
  defaultValue: T,
): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  const cacheRef = useRef<Cache<T>>({ raw: null, parsed: defaultValue });

  const getSnapshot = useCallback(
    () => readStorage(key, defaultValue, cacheRef.current),
    [key, defaultValue],
  );

  const value = useSyncExternalStore(subscribe, getSnapshot, () => defaultValue);

  const setValue = useCallback(
    (next: T | ((prev: T) => T)) => {
      if (typeof window === "undefined") return;
      try {
        const current = readStorage<T>(key, defaultValue, cacheRef.current);
        const resolved =
          typeof next === "function" ? (next as (prev: T) => T)(current) : next;
        const serialized = JSON.stringify(resolved);
        window.localStorage.setItem(key, serialized);
        cacheRef.current.raw = serialized;
        cacheRef.current.parsed = resolved;
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
    cacheRef.current.raw = null;
    cacheRef.current.parsed = defaultValue;
    window.dispatchEvent(new StorageEvent("storage", { key }));
  }, [key, defaultValue]);

  return [value, setValue, remove];
}
