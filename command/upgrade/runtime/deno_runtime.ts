import { dim } from "@std/fmt/colors";
import { Runtime, type UpgradePackageOptions } from "../runtime.ts";
import type { Logger } from "../logger.ts";

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
    { provider, name, main, version, importMap, verbose, logger, args = [] }:
      DenoUpgradePackageOptions,
  ): Promise<string | null> {
    const specifier: string = provider.getSpecifier(name, version, main);

    const cmdArgs = ["install", `--name=${name}`, "--global", "--force"];

    if (!verbose) {
      cmdArgs.push("--quiet");
    }

    if (args.length) {
      cmdArgs.push(...args);
    }

    if (importMap) {
      const importJson: string = new URL(importMap, specifier).href;
      cmdArgs.push(`--import-map=${importJson}`);
    }

    cmdArgs.push(specifier);

    return this.execute(cmdArgs, logger);
  }

  protected async execute(
    cmdArgs: string[],
    logger?: Logger,
  ): Promise<string | null> {
    logger?.log(
      dim("$ %s %s"),
      Deno.execPath(),
      cmdArgs.join(" "),
    );

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
