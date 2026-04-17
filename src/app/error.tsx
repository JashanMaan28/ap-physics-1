"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
     
    console.error("[GlobalError]", error);
  }, [error]);

  return (
    <div className="min-h-[60vh] mx-auto max-w-xl p-6 flex items-center">
      <Card className="w-full border-destructive/30 bg-destructive/5">
        <CardHeader>
          <CardTitle className="text-destructive">Something broke.</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <p className="text-muted-foreground">
            The page hit an unexpected error. You can try to recover without losing your progress.
          </p>
          <pre className="max-h-40 overflow-auto rounded-md bg-background/50 p-2 text-xs">
            {error.message}
            {error.digest ? `\n\ndigest: ${error.digest}` : ""}
          </pre>
          <div className="flex gap-2">
            <Button onClick={reset}>Try again</Button>
            <Button variant="outline" onClick={() => window.location.reload()}>
              Reload page
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
