import { Provider, Versions } from "../provider.ts";

export interface NestLandProviderOptions {
  name?: string;
}

export class NestLandProvider extends Provider {
  name = "nest.land";
  private readonly repositoryUrl = "https://nest.land/package/";
  private readonly registryUrl = "https://x.nest.land/";
  private readonly apiUrl = "https://nest.land/api/";
  private readonly moduleName?: string;

  constructor({ name }: NestLandProviderOptions = {}) {
    super();
    this.moduleName = name;
  }

  async hasRequiredPermissions(): Promise<boolean> {
    const apiUrl = new URL(this.apiUrl);
    const permissionStatus = await Deno.permissions.query({
      name: "net",
      host: apiUrl.host,
    });
    return permissionStatus.state === "granted";
  }

  async getVersions(
    name: string,
  ): Promise<Versions> {
    const response = await fetch(`${this.apiUrl}package-client`, {
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

  getRepositoryUrl(name: string): string {
    return new URL(`${this.moduleName ?? name}`, this.repositoryUrl).href;
  }

  getRegistryUrl(name: string, version: string): string {
    return new URL(`${this.moduleName ?? name}@${version}`, this.registryUrl)
      .href;
  }
}
