import { dim } from "@std/fmt/colors";
import type { Logger } from "../logger.ts";
import type { Runtime, UpgradePackageOptions } from "../runtime.ts";

export class NodeRuntime implements Runtime {
  upgrade(
    {
      provider,
      name,
      main,
      version,
      verbose,
      logger,
      args = [],
    }: UpgradePackageOptions,
  ): Promise<string | null> {
    const specifier = provider.getSpecifier(name, version, main)
      .replace(/^(npm|jsr):/, "");
    const isJsr = provider.name === "jsr";

    const cmdArgs = ["install", "--global", "--force"];

    if (!verbose) {
      cmdArgs.push("--silent");
    }

    if (args.length) {
      cmdArgs.push(...args);
    }

    cmdArgs.push(specifier);

    return this.execute(cmdArgs, isJsr, logger);
  }

  protected async execute(
    cmdArgs: string[],
    isJsr: boolean,
    logger?: Logger,
  ): Promise<string | null> {
    const { spawn } = await import("node:child_process");

    const [bin, args] = isJsr ? ["npx", ["jsr", ...cmdArgs]] : ["npm", cmdArgs];

    logger?.log(
      dim("$ %s %s %s"),
      Deno.execPath(),
      bin,
      args.join(" "),
    );

    const proc = spawn(bin, args, { stdio: [null, "pipe", "pipe"] });
    const stderr: Array<string> = [];

    proc.stderr?.on("data", (data: string) => stderr.push(data.toString()));

    const exitCode: number = await new Promise(
      (resolve) => proc.on("close", resolve),
    );

    if (exitCode) {
      return stderr.join("\n");
    }

    return null;
  }
}
