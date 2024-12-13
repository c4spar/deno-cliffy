// deno-lint-ignore-file no-explicit-any

/**
 * Set environment variable.
 *
 * @internal
 * @param name  The name of the environment variable.
 * @param value The value of the environment variable.
 */
export function setEnv(name: string, value: string): void {
  // dnt-shim-ignore
  const { Deno, process } = globalThis as any;

  if (Deno) {
    Deno.env.set(name, value);
  } else if (process) {
    process.env[name] = value;
  } else {
    throw new Error("unsupported runtime");
  }
}
