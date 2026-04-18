"use client";

import { useCallback, useState, useSyncExternalStore } from "react";
import { isGuestMode } from "@/lib/guest";

function subscribeGuest(cb: () => void) {
  window.addEventListener("storage", cb);
  return () => window.removeEventListener("storage", cb);
}
const getGuestSnapshot = () => isGuestMode();
const getGuestServer = () => false;

/**
 * Reactively tracks whether the app is in guest mode.
 * Subscribes to storage events so toggling from another tab propagates.
 */
export function useGuestMode(): boolean {
  return useSyncExternalStore(subscribeGuest, getGuestSnapshot, getGuestServer);
}

function loadFromStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function saveToStorage<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // storage quota / privacy mode — silently ignore
  }
}

/**
 * State that persists to localStorage while in guest mode.
 * Hydrates from localStorage on first render (only if the user is currently a
 * guest — otherwise the value stays at `fallback` and the Convex query should
 * be used instead).
 *
 * The returned setter behaves like React's setState but also writes the new
 * value to localStorage. Callers should only invoke it from the guest branch.
 */
export function useGuestStorage<T>(
  key: string,
  fallback: T,
): [T, (updater: T | ((prev: T) => T)) => void] {
  const [value, setValue] = useState<T>(() =>
    typeof window !== "undefined" && isGuestMode()
      ? loadFromStorage<T>(key, fallback)
      : fallback,
  );

  const update = useCallback(
    (updater: T | ((prev: T) => T)) => {
      setValue((prev) => {
        const next =
          typeof updater === "function"
            ? (updater as (prev: T) => T)(prev)
            : updater;
        saveToStorage(key, next);
        return next;
      });
    },
    [key],
  );

  return [value, update];
}
