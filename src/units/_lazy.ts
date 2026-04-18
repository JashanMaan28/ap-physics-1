import { lazy, type ComponentType } from "react";

/**
 * Wrap a dynamic import of a named export as a React.lazy component.
 * The unit config builds componentMap entries from calls like:
 *   lazyNamed(() => import("./topics/position-velocity"), "PositionVelocity")
 * so each topic/sim/tool is only fetched when the user navigates to it.
 */
export function lazyNamed<T extends Record<string, unknown>, K extends keyof T & string>(
  loader: () => Promise<T>,
  name: K,
): ComponentType<Record<string, unknown>> {
  return lazy(() =>
    loader().then((mod) => ({
      default: mod[name] as ComponentType<Record<string, unknown>>,
    })),
  );
}
