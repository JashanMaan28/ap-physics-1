"use client";

import { useConvexAuth } from "convex/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useSyncExternalStore } from "react";
import { isGuestMode, setGuestMode } from "@/lib/guest";

function subscribeToGuestMode(cb: () => void) {
  window.addEventListener("storage", cb);
  return () => window.removeEventListener("storage", cb);
}

function getGuestSnapshot() {
  return isGuestMode();
}

function getGuestServerSnapshot() {
  return false;
}

export function AuthGate({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const pathname = usePathname();
  const router = useRouter();
  const guest = useSyncExternalStore(subscribeToGuestMode, getGuestSnapshot, getGuestServerSnapshot);

  // If user signs in for real, clear guest mode
  if (isAuthenticated && guest) {
    setGuestMode(false);
  }

  const allowed = isAuthenticated || guest;

  useEffect(() => {
    if (isLoading) return;
    if (!allowed && pathname !== "/signin") {
      router.replace("/signin");
    }
    if (allowed && pathname === "/signin") {
      router.replace("/");
    }
  }, [allowed, isLoading, pathname, router]);

  if (isLoading && !guest) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!allowed && pathname !== "/signin") {
    return null;
  }

  return <>{children}</>;
}
