import { Suspense } from "react";
import { ExamModeDashboard } from "@/components/exam/exam-mode-dashboard";

export default function ExamPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-6">
            <div className="h-10 w-1/3 rounded bg-muted/50" />
            <div className="h-4 w-2/3 rounded bg-muted/40" />
            <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="h-64 rounded-xl border bg-muted/20" />
              <div className="h-64 rounded-xl border bg-muted/20" />
            </div>
          </div>
        </div>
      }
    >
      <ExamModeDashboard />
    </Suspense>
  );
}
