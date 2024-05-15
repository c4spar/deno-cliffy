import { NodeRuntime } from "./node_runtime.ts";

// deno-lint-ignore no-explicit-any
const Bun = (globalThis as any).Bun;
// deno-lint-ignore no-explicit-any
const process = (globalThis as any).process;

export class BunRuntime extends NodeRuntime {
  protected async execute(
    cmdArgs: string[],
    isJsr: boolean,
  ): Promise<string | null> {
    const proc = isJsr
      ? Bun.spawn([`${process.execPath}x`, "jsr", ...cmdArgs], {
        stdout: "piped",
        stderr: "piped",
      })
      : Bun.spawn([process.execPath, ...cmdArgs], {
        stdout: "piped",
        stderr: "piped",
      });

    await proc.exited;

    if (proc.exitCode) {
      return await new Response(proc.stderr).text();
    }

    return null;
  }
}
