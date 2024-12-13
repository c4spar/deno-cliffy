// deno-lint-ignore-file no-explicit-any

/**
 * Returns the width of the console window.
 *
 * @internal
 */
export function getColumns(): number | null {
  try {
    // dnt-shim-ignore
    const { Deno, process } = globalThis as any;

    // Catch error in none tty mode: Inappropriate ioctl for device (os error 25)
    if (Deno) {
      return Deno.consoleSize().columns ?? null;
    } else if (process) {
      return process.stdout.columns ?? null;
    }
  } catch (_error) {
    return null;
  }

  throw new Error("unsupported runtime");
}
