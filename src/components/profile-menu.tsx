"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useQuery } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { useConvexAuth } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useToast } from "@/components/effects/toast";
import { isGuestMode, setGuestMode } from "@/lib/guest";

export function ProfileMenu({ className = "" }: { className?: string }) {
  const { isAuthenticated } = useConvexAuth();
  const { signOut } = useAuthActions();
  const { toast } = useToast();
  const user = useQuery(api.user.me, isAuthenticated ? {} : "skip");
  const guest = isGuestMode();

  const [open, setOpen] = useState(false);
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [resetLoading, setResetLoading] = useState(false);
  const [resetError, setResetError] = useState("");
  const menuRef = useRef<HTMLDivElement>(null);
  const { signIn } = useAuthActions();

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
        setShowPasswordReset(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        setShowPasswordReset(false);
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open]);

  if (!isAuthenticated && !guest) return null;

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((w: string) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : guest
      ? "G"
      : "?";

  const handleSignOut = async () => {
    if (guest) {
      setGuestMode(false);
      window.location.href = "/signin";
      return;
    }
    await signOut();
    window.location.href = "/signin";
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      setResetError("New password must be at least 8 characters");
      return;
    }
    setResetLoading(true);
    setResetError("");
    try {
      // Sign in with current password to verify, then update
      await signIn("password", {
        email: user?.email ?? "",
        password: currentPassword,
        flow: "signIn",
      });
      // Now sign in with new password using reset flow
      await signIn("password", {
        email: user?.email ?? "",
        password: newPassword,
        flow: "reset",
      });
      toast("Password updated successfully", "✅", 3000);
      setShowPasswordReset(false);
      setCurrentPassword("");
      setNewPassword("");
    } catch {
      setResetError("Current password is incorrect");
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div ref={menuRef} className={`relative ${className}`}>
      {/* Profile button */}
      <button
        onClick={() => setOpen(!open)}
        className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary hover:bg-primary/20 transition-colors cursor-pointer"
        aria-label="Profile menu"
        title={user?.name ?? (guest ? "Guest" : "Profile")}
      >
        {user?.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={user.image}
            alt=""
            className="h-8 w-8 rounded-full object-cover"
          />
        ) : (
          initials
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 top-10 z-50 w-72 rounded-xl border bg-card shadow-lg overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          {/* User info */}
          <div className="border-b px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                {user?.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={user.image}
                    alt=""
                    className="h-10 w-10 rounded-full object-cover"
                  />
                ) : (
                  initials
                )}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-foreground">
                  {user?.name ?? (guest ? "Guest User" : "Loading...")}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {user?.email ?? (guest ? "No account — local storage only" : "")}
                </p>
                {user?.provider && (
                  <span className="mt-1 inline-block rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground capitalize">
                    {user.provider}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="p-1.5">
            {/* Password reset — only for email/password users */}
            {user?.hasPassword && !showPasswordReset && (
              <button
                onClick={() => setShowPasswordReset(true)}
                className="w-full flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-foreground hover:bg-accent transition-colors cursor-pointer text-left"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0110 0v4" />
                </svg>
                Change Password
              </button>
            )}

            {/* Password reset form */}
            {showPasswordReset && (
              <form onSubmit={handlePasswordReset} className="px-3 py-2 space-y-2">
                <p className="text-xs font-medium text-foreground mb-2">Change Password</p>
                <input
                  type="password"
                  placeholder="Current password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                  className="w-full rounded-lg border border-border bg-background px-3 py-1.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <input
                  type="password"
                  placeholder="New password (min 8 chars)"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={8}
                  className="w-full rounded-lg border border-border bg-background px-3 py-1.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                {resetError && <p className="text-xs text-red-500">{resetError}</p>}
                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={resetLoading}
                    className="flex-1 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 cursor-pointer"
                  >
                    {resetLoading ? "..." : "Update"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowPasswordReset(false);
                      setResetError("");
                    }}
                    className="rounded-lg border px-3 py-1.5 text-xs text-muted-foreground hover:bg-accent cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {/* Guest: sign in prompt */}
            {guest && (
              <Link
                href="/signin"
                onClick={() => setGuestMode(false)}
                className="w-full flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-primary hover:bg-accent transition-colors cursor-pointer"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4M10 17l5-5-5-5M15 12H3" />
                </svg>
                Sign in to save progress
              </Link>
            )}

            {/* Reset study progress */}
            <button
              onClick={() => {
                if (typeof window === "undefined") return;
                const ok = window.confirm(
                  "Reset all local study progress? This clears flashcard mastery, quiz scores, arcade runs, mistakes, and insights. Theme and sign-in are kept.",
                );
                if (!ok) return;
                const KEEP = new Set([
                  "theme",
                  "ap-physics-theme",
                  "ap-physics-guest",
                ]);
                try {
                  const keys: string[] = [];
                  for (let i = 0; i < window.localStorage.length; i += 1) {
                    const k = window.localStorage.key(i);
                    if (k && !KEEP.has(k)) keys.push(k);
                  }
                  keys.forEach((k) => window.localStorage.removeItem(k));
                  toast("Progress reset — reloading", "🧹", 1500);
                  window.setTimeout(() => window.location.reload(), 400);
                } catch {
                  toast("Could not reset progress", "⚠️", 2000);
                }
              }}
              className="w-full flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-foreground hover:bg-accent transition-colors cursor-pointer text-left"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14z" />
              </svg>
              Reset Study Progress
            </button>

            {/* Sign out */}
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer text-left"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
              </svg>
              {guest ? "Exit Guest Mode" : "Sign Out"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
