"use client";

import { Component, type ReactNode, type ErrorInfo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Props {
  children: ReactNode;
  fallbackLabel?: string;
}

interface State {
  error: Error | null;
}

type ErrorKind = "network" | "chunk" | "runtime";

function classifyError(error: Error): ErrorKind {
  const message = `${error.name} ${error.message}`.toLowerCase();
  if (
    message.includes("loading chunk") ||
    message.includes("chunkloaderror") ||
    message.includes("failed to fetch dynamically imported") ||
    message.includes("importing a module script failed")
  ) {
    return "chunk";
  }
  if (
    message.includes("networkerror") ||
    message.includes("failed to fetch") ||
    message.includes("load failed") ||
    message.includes("err_network") ||
    message.includes("timeout") ||
    message.includes("offline")
  ) {
    return "network";
  }
  return "runtime";
}

function describeError(kind: ErrorKind): { headline: string; detail: string } {
  switch (kind) {
    case "network":
      return {
        headline: "Looks like a network hiccup",
        detail:
          "This section couldn't talk to the server. Check your connection, then retry. If it keeps failing, try again in a moment.",
      };
    case "chunk":
      return {
        headline: "New version available",
        detail:
          "A fresh build is live and this tab is running an older copy. Reload the page to pick up the latest code.",
      };
    default:
      return {
        headline: "Something went wrong rendering this section",
        detail:
          "The rest of the page should still work — only this part failed. Retry first; if it keeps happening, reload the page.",
      };
  }
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    if (typeof window !== "undefined") {

      console.error("[ErrorBoundary]", error, info.componentStack);
    }
  }

  reset = () => this.setState({ error: null });

  reload = () => {
    if (typeof window !== "undefined") {
      window.location.reload();
    }
  };

  render() {
    if (this.state.error) {
      const kind = classifyError(this.state.error);
      const { headline, detail } = describeError(kind);
      return (
        <Card className="border-destructive/30 bg-destructive/5">
          <CardHeader>
            <CardTitle className="text-base text-destructive">
              {this.props.fallbackLabel ?? headline}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p className="text-muted-foreground">{detail}</p>
            <pre className="max-h-40 overflow-auto rounded-md bg-background/50 p-2 text-xs">
              {this.state.error.message}
            </pre>
            <div className="flex flex-wrap gap-2">
              {kind !== "chunk" && (
                <Button size="sm" variant="outline" onClick={this.reset}>
                  Retry this section
                </Button>
              )}
              <Button
                size="sm"
                variant={kind === "chunk" ? "default" : "ghost"}
                onClick={this.reload}
              >
                {kind === "chunk" ? "Reload page" : "Reload page instead"}
              </Button>
            </div>
          </CardContent>
        </Card>
      );
    }
    return this.props.children;
  }
}
