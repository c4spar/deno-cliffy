import { Provider, Versions } from "../provider.ts";

type Semver =
  | `${number}.${number}.${number}`
  | `${number}.${number}.${number}-${string}`;
type PackageName = `@${string}/${string}`;

type JsrApiPackageMetadata = {
  scope: string;
  name: string;
  latest: Semver;
  versions: {
    [version: Semver]: { yanked?: boolean };
  };
};

export interface JsrProviderOptions {
  name?: PackageName;
}

export class JsrProvider extends Provider {
  name = "jsr";
  private readonly repositoryUrl = "https://jsr.io/";
  private readonly packageName?: string;

  constructor({ name }: JsrProviderOptions = {}) {
    super();
    this.packageName = name;
  }

  async getVersions(
    name: PackageName,
  ): Promise<Versions> {
    const response = await fetch(
      `${this.repositoryUrl}/${this.packageName ?? name}/meta.json`,
    );
    if (!response.ok) {
      throw new Error(
        "couldn't fetch the latest version - try again after sometime",
      );
    }

    const { latest, versions } = await response.json() as JsrApiPackageMetadata;

    return {
      latest,
      versions: Object.keys(versions),
    };
  }

  getRepositoryUrl(name: PackageName): string {
    return new URL(`${this.packageName ?? name}`, this.repositoryUrl).href;
  }

  getRegistryUrl(name: PackageName, version: Semver): string {
    return new URL(`${this.packageName ?? name}@${version}`, this.repositoryUrl)
      .href;
  }
}
