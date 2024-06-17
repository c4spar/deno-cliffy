export function getNoColor(): boolean {
  // deno-lint-ignore no-explicit-any
  return (globalThis as any)?.noColor ??
    // deno-lint-ignore no-explicit-any
    (globalThis as any).process?.env.NO_COLOR === "1";
}
