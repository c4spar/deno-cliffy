import { getRuntime } from "./get_runtime.ts";
import type {
  RuntimeUpgradeOptions,
  UpgradePackageOptions,
} from "./runtime.ts";
import { DenoUpgradeOptions } from "./runtime/deno_runtime.ts";

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
  }: UpgradeOptions,
): Promise<void> {
  if (
    force ||
    !currentVersion ||
    await provider.isOutdated(name, currentVersion, version)
  ) {
    if (version === "latest") {
      const { latest } = await provider.getVersions(name);
      version = latest;
    }
    const { runtimeName, runtime } = await getRuntime();

    const errorMessage: string | null = await runtime.upgrade({
      args,
      ...(runtimeOptions?.[runtimeName] ?? {}),
      name,
      version,
      main,
      provider,
    });

    if (errorMessage) {
      console.error(errorMessage);
      console.error(
        `Failed to upgrade ${name} from ${currentVersion} to version ${version}!`,
      );
      Deno.exit(1);
    }

    console.info(
      `Successfully upgraded ${name} from ${currentVersion} to version ${version}! (${
        provider.getRegistryUrl(name, version)
      })`,
    );
  }
}
