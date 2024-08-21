/** Names of supported runtimes. */
export type RuntimeName = "deno" | "node" | "bun";

export function getRuntimeName(): RuntimeName {
  switch (true) {
    case "Deno" in globalThis:
      return "deno";
    case "Bun" in globalThis:
      return "bun";
    case "process" in globalThis:
      return "node";
    default:
      throw new Error("unsupported runtime");
  }
}
