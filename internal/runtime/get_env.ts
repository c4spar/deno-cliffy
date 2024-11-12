// deno-lint-ignore-file no-explicit-any

/**
 * Get environment variable.
 *
 * @internal
 * @param name The name of the environment variable.
 */
export function getEnv(name: string): string | undefined {
  // dnt-shim-ignore
  const { Deno, process } = globalThis as any;

  if (Deno) {
    return Deno.env.get(name);
  } else if (process) {
    return process.env[name];
  }

  throw new Error("unsupported runtime");
}
