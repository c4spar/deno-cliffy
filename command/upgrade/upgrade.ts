import { bold, dim, green, red } from "@std/fmt/colors";
import { getRuntime } from "./get_runtime.ts";
import type {
  RuntimeUpgradeOptions,
  UpgradePackageOptions,
} from "./runtime.ts";
import type { DenoUpgradeOptions } from "./runtime/deno_runtime.ts";

type DenoRuntimeUpgradeOptions = RuntimeUpgradeOptions & DenoUpgradeOptions;
type NodeRuntimeUpgradeOptions = RuntimeUpgradeOptions;
type BunRuntimeUpgradeOptions = RuntimeUpgradeOptions;

/** Runtime options map for supported runtimes. */
export interface RuntimeOptionsMap {
  deno?: DenoRuntimeUpgradeOptions;
  node?: NodeRuntimeUpgradeOptions;
  bun?: BunRuntimeUpgradeOptions;
}

/** Options for upgrading a package from any supported runtime. */
export interface UpgradeOptions extends UpgradePackageOptions {
  runtime?: RuntimeOptionsMap;
  currentVersion?: string;
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
    version,
    currentVersion,
    force,
    logger,
    verbose,
  }: UpgradeOptions,
): Promise<void> {
  if (
    force ||
    !currentVersion ||
    await provider.isOutdated(name, currentVersion, version)
  ) {
    if (version === "latest") {
      logger?.log(dim("Upgrading %s to the %s version"), name, version);
      const { latest } = await provider.getVersions(name);
      version = latest;
    } else {
      logger?.log(dim("Upgrading %s to version %s"), name, version);
    }
    const { runtimeName, runtime } = await getRuntime();
    logger?.log(dim("Detected runtime: %s"), runtimeName);

    try {
      await runtime.upgrade({
        args,
        ...(runtimeOptions?.[runtimeName] ?? {}),
        name,
        version,
        main,
        provider,
        logger,
        verbose,
      });
    } catch (error: unknown) {
      logger?.error(
        red(
          `Failed to upgrade ${bold(name)} ${
            currentVersion ? `from version ${bold(currentVersion)} ` : ""
          }to ${bold(version)}.`,
        ),
      );
      throw error;
    }

    logger?.info(
      green(
        `Successfully upgraded ${bold(name)} from version ${
          bold(currentVersion ?? "")
        } to ${bold(version)}!`,
      ),
      dim(`(${provider.getRepositoryUrl(name, version)})`),
    );
  }
}
