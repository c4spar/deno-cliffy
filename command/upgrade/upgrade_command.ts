import { Command } from "../command.ts";
import { ValidationError } from "../../flags/_errors.ts";
import type { Provider } from "./provider.ts";
import { EnumType } from "../types/enum.ts";

export interface UpgradeCommandOptions<
  P extends Provider = Provider,
  V extends P | Array<P> = P | Array<P>,
> {
  provider: V;
  main?: string;
  args?: Array<string>;
}

export class UpgradeCommand extends Command<void> {
  private readonly providers: ReadonlyArray<Provider>;

  constructor(
    { provider, main, args }: UpgradeCommandOptions,
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
      .type("provider", new EnumType(this.getProviderNames()))
      .option<{ registry: Provider }>(
        "-r, --registry <name:provider>",
        `The registry name from which to upgrade.`,
        {
          default: this.getProvider().name,
          hidden: this.providers.length < 2,
          value: (registry) => this.getProvider(registry),
        },
      )
      .option<{ listVersions?: boolean }>(
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
      .option<{ version: string }>(
        "--version <version:string:version>",
        "The version to upgrade to.",
        { default: "latest" },
      )
      .option<{ force?: boolean }>(
        "-f, --force",
        "Replace current installation even if not out-of-date.",
      )
      .complete("version", () => this.getVersions())
      .action(async ({ registry, version: targetVersion, force }) => {
        const name: string = this.getMainCommand().getName();
        const currentVersion: string | undefined = this.getVersion();

        if (
          force || !currentVersion ||
          await registry.isOutdated(name, currentVersion, targetVersion)
        ) {
          await registry.upgrade({
            name,
            main,
            from: currentVersion,
            to: targetVersion,
            args,
          });
        }
      });
  }

  private async getVersions(): Promise<Array<string>> {
    const { versions } = await this.getProvider().getVersions(
      this.getMainCommand().getName(),
    );
    return versions;
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
