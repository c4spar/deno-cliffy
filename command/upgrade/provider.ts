import { bold, brightBlue, cyan, green, red, yellow } from "@std/fmt/colors";
import { ValidationError } from "../_errors.ts";
import { Table } from "@cliffy/table";
import type { Logger } from "./logger.ts";

export interface Versions {
  latest: string;
  versions: Array<string>;
}

export interface ProviderOptions {
  main?: string;
  logger?: Logger;
}

export abstract class Provider {
  abstract readonly name: string;
  protected readonly main?: string;
  protected readonly maxListSize: number = 25;
  protected logger: Logger;
  private maxCols = 8;

  protected constructor({ main, logger = console }: ProviderOptions = {}) {
    this.main = main;
    this.logger = logger;
  }

  abstract getVersions(name: string): Promise<Versions>;

  abstract getRepositoryUrl(name: string, version?: string): string;

  abstract getRegistryUrl(name: string, version: string): string;

  getSpecifier(name: string, version: string, defaultMain?: string): string {
    return `${this.getRegistryUrl(name, version)}${this.getMain(defaultMain)}`;
  }

  private getMain(defaultMain?: string): string {
    const main = this.main ?? defaultMain;
    return main ? `/${main}` : "";
  }

  public setLogger(logger: Logger): void {
    this.logger = logger;
  }

  async isOutdated(
    name: string,
    currentVersion: string,
    targetVersion: string,
  ): Promise<boolean> {
    const { latest, versions } = await this.getVersions(name);

    if (targetVersion === "latest") {
      targetVersion = latest;
    }

    // Check if requested version exists.
    if (targetVersion && !versions.includes(targetVersion)) {
      throw new ValidationError(
        `The provided version ${
          bold(red(targetVersion))
        } is not found.\n\n    ${
          cyan(
            `Visit ${
              brightBlue(this.getRepositoryUrl(name))
            } for available releases or run again with the ${(yellow(
              "-l",
            ))} or ${(yellow("--list-versions"))} command.`,
          )
        }`,
      );
    }

    // Check if requested version is already the latest available version.
    if (latest && latest === currentVersion && latest === targetVersion) {
      this.logger.warn(
        yellow(
          `You're already using the latest available version ${currentVersion} of ${name}.`,
        ),
      );
      return false;
    }

    // Check if requested version is already installed.
    if (targetVersion && currentVersion === targetVersion) {
      this.logger.warn(
        yellow(`You're already using version ${currentVersion} of ${name}.`),
      );
      return false;
    }

    return true;
  }

  public async listVersions(
    name: string,
    currentVersion?: string,
  ): Promise<void> {
    const { versions } = await this.getVersions(name);
    this.printVersions(versions, currentVersion);
  }

  protected printVersions(
    versions: Array<string>,
    currentVersion?: string,
    { maxCols = this.maxCols, indent = 0 }: {
      maxCols?: number;
      indent?: number;
    } = {},
  ): void {
    versions = versions.slice();
    if (versions?.length) {
      versions = versions.map((version: string) =>
        currentVersion && currentVersion === version
          ? green(`* ${version}`)
          : `  ${version}`
      );

      if (versions.length > this.maxListSize) {
        const table = new Table().indent(indent);
        const rowSize = Math.ceil(versions.length / maxCols);
        const colSize = Math.min(versions.length, maxCols);
        let versionIndex = 0;
        for (let colIndex = 0; colIndex < colSize; colIndex++) {
          for (let rowIndex = 0; rowIndex < rowSize; rowIndex++) {
            if (!table[rowIndex]) {
              table[rowIndex] = [];
            }
            table[rowIndex][colIndex] = versions[versionIndex++];
          }
        }
        console.log(table.toString());
      } else {
        console.log(
          versions.map((version) => " ".repeat(indent) + version).join("\n"),
        );
      }
    }
  }
}
