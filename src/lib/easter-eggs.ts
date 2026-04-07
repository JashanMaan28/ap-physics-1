/**
 * Easter egg state & utilities — all localStorage-backed.
 */

const EGG_KEY = "ap-physics-eggs";

interface EggState {
  konamiUnlocked?: boolean;
  chalkboardUnlocked?: boolean;
  darkMatterUnlocked?: boolean;
  newtonApple?: boolean;
  speedOfLight?: number; // count
  streakRecord?: number;
}

function load(): EggState {
  try {
    return JSON.parse(localStorage.getItem(EGG_KEY) || "{}");
  } catch {
    return {};
  }
}

function save(state: EggState) {
  try {
    localStorage.setItem(EGG_KEY, JSON.stringify(state));
  } catch {}
}

export function getEggState(): EggState {
  if (typeof window === "undefined") return {};
  return load();
}

export function setEgg<K extends keyof EggState>(key: K, value: EggState[K]) {
  const state = load();
  state[key] = value;
  save(state);
}
