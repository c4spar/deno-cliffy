import { dim } from "@std/fmt/colors";
import type { Logger } from "../logger.ts";
import { NodeRuntime } from "./node_runtime.ts";

export class BunRuntime extends NodeRuntime {
  protected async execute(
    cmdArgs: string[],
    isJsr: boolean,
    logger?: Logger,
  ): Promise<string | null> {
    // deno-lint-ignore no-explicit-any
    const Bun = (globalThis as any).Bun;
    // deno-lint-ignore no-explicit-any
    const process = (globalThis as any).process;

    cmdArgs = isJsr
      ? [`${process.execPath}x`, "jsr", ...cmdArgs]
      : [process.execPath, ...cmdArgs];

    logger?.log(
      dim("$ %s %s"),
      Deno.execPath(),
      cmdArgs.join(" "),
    );

    const proc = Bun.spawn(cmdArgs, { stdout: "piped", stderr: "piped" });
    await proc.exited;

    if (proc.exitCode) {
      return await new Response(proc.stderr).text();
    }

    return null;
  }
}
