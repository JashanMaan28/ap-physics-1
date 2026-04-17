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

  render() {
    if (this.state.error) {
      return (
        <Card className="border-destructive/30 bg-destructive/5">
          <CardHeader>
            <CardTitle className="text-base text-destructive">
              {this.props.fallbackLabel ?? "Something went wrong loading this section"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p className="text-muted-foreground">
              The rest of the page should still work — only this part failed. If the error keeps
              happening, try refreshing the page.
            </p>
            <pre className="max-h-40 overflow-auto rounded-md bg-background/50 p-2 text-xs">
              {this.state.error.message}
            </pre>
            <Button size="sm" variant="outline" onClick={this.reset}>
              Retry this section
            </Button>
          </CardContent>
        </Card>
      );
    }
    return this.props.children;
  }
}
