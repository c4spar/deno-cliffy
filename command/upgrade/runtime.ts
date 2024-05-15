import type { Provider } from "./provider.ts";

/** Runtime specific upgrade options. */
export interface RuntimeUpgradeOptions {
  args?: Array<string>;
  main?: string;
}

/** Options for upgrading a package. */
export interface UpgradePackageOptions extends RuntimeUpgradeOptions {
  name: string;
  version: string;
  provider: Provider;
}

/** Runtime handler. */
export abstract class Runtime {
  abstract upgrade(_options: UpgradePackageOptions): Promise<string | null>;
}
