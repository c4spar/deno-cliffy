// deno-lint-ignore-file no-explicit-any

/**
 * Inspect values.
 *
 * @internal
 */
export function inspect(value: unknown, colors: boolean): string {
  // dnt-shim-ignore
  const { Deno } = globalThis as any;

  return Deno?.inspect(
    value,
    { depth: 1, colors, trailingComma: false },
  ) ?? JSON.stringify(value, null, 2);
}
