// Minimal utils stub
export function cn(...args: unknown[]): string {
  return args.filter(Boolean).join(" ");
}
