// deno-lint-ignore-file no-explicit-any
import { isDirectory } from "./is_directory.ts";

/**
 * Get directory list.
 *
 * @internal
 * @param path Path to the directory.
 */
export async function readDir(path: string): Promise<Array<{ name: string }>> {
  // dnt-shim-ignore
  const { Deno } = globalThis as any;
  path ||= ".";

  if (Deno) {
    if (!(await isDirectory(path))) {
      return [];
    }
    const array = [];
    for await (const item of Deno.readDir(path)) {
      array.push(item);
    }
    return array;
  }

  const fs = await import("node:fs");

  return new Promise((resolve, reject) => {
    fs.readdir(
      path,
      (err: unknown, files: Array<string>) =>
        err ? reject(err) : resolve(files.map((name) => ({ name }))),
    );
  });
}
