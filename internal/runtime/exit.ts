// deno-lint-ignore-file no-explicit-any

/**
 * Exit the current process with optional exit code.
 *
 * @internal
 * @param code The exit code.
 */
export function exit(code: number): never {
  // dnt-shim-ignore
  const { Deno, process } = globalThis as any;
  const exit: (code: number) => never = Deno?.exit ?? process?.exit;

  if (exit) {
    exit(code);
  }

  throw new Error("unsupported runtime");
}
