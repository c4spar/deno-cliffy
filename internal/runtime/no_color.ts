// deno-lint-ignore-file no-explicit-any

/**
 * Checks if colors are enabled.
 *
 * @internal
 */
export function getNoColor(): boolean {
  // dnt-shim-ignore
  const { Deno, process } = globalThis as any;

  if (Deno) {
    return Deno.noColor;
  } else if (process) {
    return process?.env.NO_COLOR === "1" ||
      process?.env.NODE_DISABLE_COLORS === "1";
  }

  throw new Error("unsupported runtime");
}
