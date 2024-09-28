import {
  createTestFunction,
  type GenericTestFunction,
} from "../create_test_function.ts";
import type { TestFn, TestOptions } from "../test_options.ts";

export function createDenoTestFunction(): GenericTestFunction<void> {
  return createTestFunction(({ name, fn, only, ignore }: TestOptions) =>
    Deno.test({
      name,
      fn: createDenoTestFn(fn),
      only,
      ignore: Array.isArray(ignore) ? ignore.includes("deno") : ignore,
    })
  );
}

function createDenoTestFn(fn: TestFn): Deno.TestDefinition["fn"] {
  return (ctx: Deno.TestContext) =>
    fn({
      ...ctx,
      step: createTestFunction(({ name, ignore, fn }) =>
        ctx.step({
          name,
          fn: createDenoTestFn(fn),
          ignore: Array.isArray(ignore) ? ignore.includes("deno") : ignore,
        })
      ),
    });
}
