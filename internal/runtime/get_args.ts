// deno-lint-ignore-file no-explicit-any

/**
 * Get script arguments.
 *
 * @internal
 */
export function getArgs(): Array<string> {
  // dnt-shim-ignore
  const { Deno, process, Bun } = globalThis as any;

  return Deno?.args ?? Bun?.argv.slice(2) ?? process?.argv.slice(2) ?? [];
}
