import type { Logger } from "./logger.ts";
import type { Provider } from "./provider.ts";

/** Runtime specific options. */
export interface RuntimeOptions {
  args?: Array<string>;
  main?: string;
}

/** Options for upgrading a package for a specific runtime. */
export interface RuntimeUpgradeOptions extends RuntimeOptions {
  name: string;
  to: string;
  provider: Provider;
  verbose?: boolean;
  logger?: Logger;
}

/** Runtime handler. */
export abstract class Runtime {
  abstract upgrade(_options: RuntimeUpgradeOptions): Promise<void>;
}
