const GUEST_KEY = "ap-physics-guest-mode";

export function isGuestMode(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(GUEST_KEY) === "true";
}

export function setGuestMode(value: boolean) {
  if (typeof window === "undefined") return;
  if (value) {
    localStorage.setItem(GUEST_KEY, "true");
  } else {
    localStorage.removeItem(GUEST_KEY);
  }
}
