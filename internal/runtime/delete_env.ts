// deno-lint-ignore-file no-explicit-any

/**
 * Delete environment variable.
 *
 * @internal
 * @param name The name of the environment variable.
 */
export function deleteEnv(name: string): string | undefined {
  // dnt-shim-ignore
  const { Deno, process } = globalThis as any;

  if (Deno) {
    return Deno.env.delete(name);
  } else if (process) {
    delete process.env[name];
  } else {
    throw new Error("unsupported runtime");
  }
}
