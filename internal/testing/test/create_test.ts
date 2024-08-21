import type { TestFn, TestOptions } from "./test_options.ts";

export interface TestFunction {
  (testOptions: TestOptions): void;
  (name: string, fn: TestFn): void;
}

export async function createTest(): Promise<TestFunction> {
  if ("Deno" in globalThis) {
    const { createDenoTestFunction } = await import("./runtime/deno.ts");
    return createDenoTestFunction();
  } else if ("Bun" in globalThis) {
    const { createBunTestFunction } = await import("./runtime/bun.ts");
    return createBunTestFunction();
  } else if ("process" in globalThis) {
    const { createNodeTestFunction } = await import("./runtime/node.ts");
    return createNodeTestFunction();
  } else {
    throw new Error("unsupported runtime");
  }
}
