import { yellow } from "@std/fmt/colors";
import type { TestFn, TestOptions } from "./test_options.ts";

export interface GenericTestFunction<T> {
  (testOptions: TestOptions): T;
  (name: string, fn: TestFn): T;
}

export function createTestFunction<T>(
  runTest: (options: TestOptions) => T,
): GenericTestFunction<T> {
  return (nameOrOptions: string | TestOptions, fn?: TestFn): T => {
    if (typeof nameOrOptions === "string") {
      return runTest({ name: nameOrOptions, fn: fn as TestFn });
    }

    if (nameOrOptions.ignore) {
      console.warn(yellow("skip: %s"), nameOrOptions.name);
    }

    return runTest(nameOrOptions);
  };
}
