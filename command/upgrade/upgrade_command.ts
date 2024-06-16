import { bold, brightBlue } from "@std/fmt/colors";
import { ValidationError } from "../_errors.ts";
import { Command } from "../command.ts";
import { EnumType } from "../types/enum.ts";
import { createLogger } from "./logger.ts";
import type { Provider, Versions } from "./provider.ts";
import { Spinner } from "./spinner.ts";
import {
  type RuntimeOptions,
  type RuntimeOptionsMap,
  upgrade,
} from "./upgrade.ts";

export interface UpgradeCommandOptions<
  TProvider extends Provider = Provider,
> extends RuntimeOptions {
  provider: TProvider | Array<TProvider>;
  runtime?: RuntimeOptionsMap;
}

/**
 * The `UpgradeCommand` adds an upgrade functionality to the cli to be able to
 * seamlessly upgrade the cli to the latest or a specific version from any
 * supported registry.
 */
export class UpgradeCommand extends Command {
  private readonly providers: ReadonlyArray<Provider>;

  constructor(
    { provider, ...options }: UpgradeCommandOptions,
  ) {
    super();
    this.providers = Array.isArray(provider) ? provider : [provider];

    if (!this.providers.length) {
      throw new Error(`No upgrade provider defined!`);
    }

    this
      .description(() =>
        `Upgrade ${this.getMainCommand().getName()} executable to latest or given version.`
      )
      .noGlobals()
      .type("provider", new EnumType(this.getProviderNames()))
      .option(
        "-r, --registry <name:provider>",
        `The registry name from which to upgrade.`,
        {
          default: this.getProvider().name,
          hidden: this.providers.length < 2,
          value: (registry) => this.getProvider(registry),
        },
      )
      .option(
        "-l, --list-versions",
        "Show available versions.",
        {
          action: async ({ registry }) => {
            await registry.listVersions(
              this.getMainCommand().getName(),
              this.getVersion(),
            );
            Deno.exit(0);
          },
        },
      )
      .option(
        "--version <version:string:version>",
        "The version to upgrade to.",
        { default: "latest" },
      )
      .option(
        "-f, --force",
        "Replace current installation even if not out-of-date.",
      )
      .option(
        "-v, --verbose",
        "Log verbose output.",
      )
      .option("--no-spinner", "Disable spinner.")
      .complete("version", () => this.getAllVersions())
      .action(
        async (
          {
            registry: provider,
            version,
            force,
            verbose,
            spinner: spinnerEnabled,
          },
        ) => {
          const name: string = this.getMainCommand().getName();
          const currentVersion: string | undefined = this.getVersion();

          const spinner = spinnerEnabled
            ? new Spinner({
              message: brightBlue(
                `Upgrading ${bold(name)} from version ${
                  bold(currentVersion ?? "")
                } to ${bold(version)}...`,
              ),
            })
            : undefined;
          const logger = createLogger({ spinner, verbose });
          spinner?.start();
          provider.setLogger(logger);

          try {
            await upgrade({
              name,
              to: version,
              from: currentVersion,
              force,
              provider,
              verbose,
              logger,
              ...options,
            });
          } catch (error: unknown) {
            logger.error(
              !verbose && error instanceof Error ? error.message : error,
            );
            spinner?.stop();
            Deno.exit(1);
          } finally {
            spinner?.stop();
          }
        },
      );
  }

  public async getAllVersions(): Promise<Array<string>> {
    const { versions } = await this.getVersions();
    return versions;
  }

  public async getLatestVersion(): Promise<string> {
    const { latest } = await this.getVersions();
    return latest;
  }

  public getVersions(): Promise<Versions> {
    return this.getProvider().getVersions(
      this.getMainCommand().getName(),
    );
  }

  private getProvider(name?: string): Provider {
    const provider = name
      ? this.providers.find((provider) => provider.name === name)
      : this.providers[0];
    if (!provider) {
      throw new ValidationError(`Unknown provider "${name}"`);
    }
    return provider;
  }

  private getProviderNames(): Array<string> {
    return this.providers.map((provider) => provider.name);
  }
}
