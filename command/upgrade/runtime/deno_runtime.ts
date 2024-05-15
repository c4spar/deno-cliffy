import { Runtime, type UpgradePackageOptions } from "../runtime.ts";

/** Deno specific upgrade options. */
export interface DenoUpgradeOptions {
  importMap?: string;
}

/** Deno specific package upgrade options. */
export type DenoUpgradePackageOptions =
  & UpgradePackageOptions
  & DenoUpgradeOptions;

/** Deno runtime upgrade handler. */
export class DenoRuntime extends Runtime {
  upgrade(
    { provider, name, main, version, importMap, args = [] }:
      DenoUpgradePackageOptions,
  ): Promise<string | null> {
    const specifier: string = provider.getSpecifier(name, version, main);

    const cmdArgs = ["install", "--global"];

    if (importMap) {
      const importJson: string = new URL(importMap, specifier).href;
      cmdArgs.push("--import-map", importJson);
    }

    if (args.length) {
      cmdArgs.push(...args, "--force", "--name", name, specifier);
    } else {
      cmdArgs.push(
        "--no-check",
        "--quiet",
        "--force",
        "--name",
        name,
        specifier,
      );
    }

    return this.execute(cmdArgs);
  }

  protected async execute(cmdArgs: string[]): Promise<string | null> {
    const cmd = new Deno.Command(Deno.execPath(), {
      args: cmdArgs,
      stdout: "piped",
      stderr: "piped",
    });
    const { success, stderr } = await cmd.output();

    if (!success) {
      return new TextDecoder().decode(stderr);
    }

    return null;
  }
}
