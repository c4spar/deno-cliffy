import { Provider, type ProviderOptions, type Versions } from "../provider.ts";

export interface NestLandProviderOptions extends ProviderOptions {
  name?: string;
}

export class NestLandProvider extends Provider {
  name = "nest.land";
  private readonly repositoryUrl = "https://nest.land/package/";
  private readonly registryUrl = "https://x.nest.land/";
  private readonly moduleName?: string;

  constructor({ name, main }: NestLandProviderOptions = {}) {
    super({ main });
    this.moduleName = name;
  }

  async getVersions(
    name: string,
  ): Promise<Versions> {
    const response = await fetch(`https://nest.land/api/package-client`, {
      method: "post",
      body: JSON.stringify({ data: { name: this.moduleName ?? name } }),
      headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) {
      throw new Error(
        "couldn't fetch the latest version - try again after sometime",
      );
    }

    const { body: { latestVersion, packageUploadNames } } = await response
      .json();

    const stripPackageName = (version: string): string => {
      return version.replace(new RegExp(`^${this.moduleName ?? name}@`), "");
    };

    return {
      latest: stripPackageName(latestVersion),
      versions: packageUploadNames.map((version: string) =>
        stripPackageName(version)
      ).reverse(),
    };
  }

  getRepositoryUrl(name: string, version?: string): string {
    return new URL(
      `${this.moduleName ?? name}${version ? `@${version}` : ""}`,
      this.repositoryUrl,
    ).href;
  }

  getRegistryUrl(name: string, version: string): string {
    return new URL(`${this.moduleName ?? name}@${version}`, this.registryUrl)
      .href;
  }
}
