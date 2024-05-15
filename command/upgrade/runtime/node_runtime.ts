import { Runtime, UpgradePackageOptions } from "../runtime.ts";

export class NodeRuntime implements Runtime {
  upgrade(
    { provider, name, main, version, args = [] }: UpgradePackageOptions,
  ): Promise<string | null> {
    const specifier = provider.getSpecifier(name, version, main)
      .replace(/^(npm|jsr):/, "");
    const isJsr = provider.name === "jsr";

    const cmdArgs = ["install", "--global"];

    if (args.length) {
      cmdArgs.push(...args, "--force", specifier);
    } else {
      cmdArgs.push("--silent", "--force", specifier);
    }

    return this.execute(cmdArgs, isJsr);
  }

  protected async execute(
    cmdArgs: string[],
    isJsr: boolean,
  ): Promise<string | null> {
    const { spawn } = await import("node:child_process");

    const stderr: Array<string> = [];
    const proc = isJsr
      ? spawn("npx", ["jsr", ...cmdArgs], { stdio: [null, "pipe", "pipe"] })
      : spawn("npm", cmdArgs, { stdio: [null, "pipe", "pipe"] });

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
