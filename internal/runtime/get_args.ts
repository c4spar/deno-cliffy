// deno-lint-ignore-file no-explicit-any

/**
 * Get script arguments.
 *
 * @internal
 */
export function getArgs(): Array<string> {
  // dnt-shim-ignore
  const { Deno, process } = globalThis as any;

  return Deno?.args ?? process?.argv.slice(2) ?? [];
}
