// deno-lint-ignore-file no-explicit-any

/**
 * Set raw mode on stdin.
 *
 * @internal
 * @param mode    Enable/disable raw mode.
 * @param cbreak  Enable/disable cbreak mode.
 */
export function setRaw(
  mode: boolean,
  { cbreak }: { cbreak?: boolean } = {},
): void {
  // dnt-shim-ignore
  const { Deno, process } = globalThis as any;

  if (Deno) {
    Deno.stdin.setRaw(mode, { cbreak });
  } else if (process) {
    process.stdin.setRawMode(mode);
  } else {
    throw new Error("unsupported runtime");
  }
}
