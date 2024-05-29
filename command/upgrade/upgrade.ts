import { bold, dim, green, red } from "@std/fmt/colors";
import { getRuntime } from "./get_runtime.ts";
import type { RuntimeOptions, RuntimeUpgradeOptions } from "./runtime.ts";
import type { DenoRuntimeOptions } from "./runtime/deno_runtime.ts";

/** Runtime options map for supported runtimes. */
export interface RuntimeOptionsMap {
  deno?: RuntimeOptions & DenoRuntimeOptions;
  node?: RuntimeOptions;
  bun?: RuntimeOptions;
}

/** Options for upgrading a package from any supported runtime. */
export interface UpgradeOptions extends RuntimeUpgradeOptions {
  runtime?: RuntimeOptionsMap;
  from?: string;
  force?: boolean;
}

/**
 * Upgrade a package from given registry.
 * Runtime is auto-detected. Currently supported runtimes are: `deno`, `node` and `bun`.
 */
export async function upgrade(
  {
    name,
    main,
    args,
    runtime: runtimeOptions,
    provider,
    to,
    from,
    force,
    logger,
    verbose,
  }: UpgradeOptions,
): Promise<void> {
  if (
    force ||
    !from ||
    await provider.isOutdated(name, from, to)
  ) {
    if (to === "latest") {
      logger?.log(dim("Upgrading %s to the %s version"), name, to);
      const { latest } = await provider.getVersions(name);
      to = latest;
    } else {
      logger?.log(dim("Upgrading %s to version %s"), name, to);
    }

    try {
      if (provider.upgrade) {
        await provider.upgrade({
          args,
          name,
          to,
          main,
          logger,
          verbose,
        });
      } else {
        const { runtimeName, runtime } = await getRuntime();
        logger?.log(dim("Detected runtime: %s"), runtimeName);

        await runtime.upgrade({
          args,
          ...(runtimeOptions?.[runtimeName] ?? {}),
          name,
          to,
          main,
          provider,
          logger,
          verbose,
        });
      }
    } catch (error: unknown) {
      logger?.error(
        red(
          `Failed to upgrade ${bold(name)} ${
            from ? `from version ${bold(from)} ` : ""
          }to ${bold(to)}.`,
        ),
      );
      throw error;
    }

    logger?.info(
      green(
        `Successfully upgraded ${bold(name)} from version ${
          bold(from ?? "")
        } to ${bold(to)}!`,
      ),
      dim(`(${provider.getRepositoryUrl(name, to)})`),
    );
  }
}
