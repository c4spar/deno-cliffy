/**
 * Get file info.
 *
 * @internal
 * @param input Path to the file.
 */
export async function stat(input: string): Promise<{ isDirectory: boolean }> {
  // dnt-shim-ignore deno-lint-ignore no-explicit-any
  const { Deno } = globalThis as any;

  if (Deno) {
    return Deno.stat(input);
  }
  const { statSync } = await import("node:fs");
  const stats = statSync(input);

  return {
    get isDirectory() {
      return stats.isDirectory();
    },
  };
}
