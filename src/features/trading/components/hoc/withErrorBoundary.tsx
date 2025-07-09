// Minimal withErrorBoundary stub
import type { ComponentType, FC } from "react";

type WithErrorBoundaryProps = object;

export function withErrorBoundary<P extends WithErrorBoundaryProps>(
  Component: ComponentType<P>
): FC<P> {
  const Wrapped: FC<P> = (props: P) => <Component {...props} />;
  Wrapped.displayName = `withErrorBoundary(${Component.displayName || Component.name || "Component"})`;
  return Wrapped;
}
