export function TopicSkeleton() {
  return (
    <div className="mx-auto max-w-3xl animate-pulse space-y-6">
      <div className="space-y-3">
        <div className="h-8 w-2/3 rounded bg-muted/60" />
        <div className="h-4 w-1/2 rounded bg-muted/40" />
        <div className="flex gap-2">
          <div className="h-5 w-16 rounded-full bg-muted/50" />
          <div className="h-5 w-20 rounded-full bg-muted/40" />
        </div>
      </div>

      <div className="space-y-2.5">
        <div className="h-4 w-full rounded bg-muted/30" />
        <div className="h-4 w-[95%] rounded bg-muted/30" />
        <div className="h-4 w-[90%] rounded bg-muted/30" />
        <div className="h-4 w-3/4 rounded bg-muted/30" />
      </div>

      <div className="h-56 w-full rounded-lg border border-border/40 bg-muted/25" />

      <div className="space-y-2.5">
        <div className="h-4 w-full rounded bg-muted/30" />
        <div className="h-4 w-[92%] rounded bg-muted/30" />
        <div className="h-4 w-4/5 rounded bg-muted/30" />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="h-24 rounded-lg border border-border/40 bg-muted/20" />
        <div className="h-24 rounded-lg border border-border/40 bg-muted/20" />
      </div>

      <div className="space-y-2.5">
        <div className="h-4 w-[88%] rounded bg-muted/30" />
        <div className="h-4 w-2/3 rounded bg-muted/30" />
      </div>
    </div>
  );
}
