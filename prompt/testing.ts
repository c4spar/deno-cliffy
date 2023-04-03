import { eraseDown } from "../ansi/ansi_escapes.ts";
import { basename } from "./deps.ts";
import { assertSnapshot } from "https://deno.land/std@0.170.0/testing/snapshot.ts";

export interface AssertPromptSnapshotOptions {
  meta: ImportMeta;
  tests: Record<string, Array<string>>;
  osSuffix?: Array<typeof Deno.build.os>;
  fn(): Promise<unknown>;
}

const encoder = new TextEncoder();

/** Run prompt snapshot tests. */
export function assertPromptSnapshot(
  options: AssertPromptSnapshotOptions,
): Promise<void>;

/** Run prompt snapshot tests. */
export function assertPromptSnapshot(
  meta: ImportMeta,
  tests: Record<string, Array<string>>,
  fn: () => Promise<unknown>,
): Promise<void>;

/**
 * Run prompt snapshot tests.
 *
 * ```ts
 * import { assertPromptSnapshot } from "./testing.ts";
 * import { Input } from "./input.ts";
 *
 * await assertPromptSnapshot({
 *   meta: import.meta,
 *   tests: {
 *     "should enter som text": ["foo bar", "\n"],
 *   },
 *   async fn() {
 *     await Input.prompt({
 *       message: "Whats your name?",
 *       default: "foo",
 *     });
 *   },
 * });
 * ```
 *
 * @param optionsOrMeta import.meta
 * @param tests         Object of tests. Key is the test name and the value is
 *                      an array of input sequences/characters.
 * @param fn            Test function.
 */
export async function assertPromptSnapshot(
  optionsOrMeta: AssertPromptSnapshotOptions | ImportMeta,
  tests?: Record<string, Array<string>>,
  fn?: () => Promise<unknown>,
): Promise<void> {
  const options: AssertPromptSnapshotOptions = "meta" in optionsOrMeta
    ? optionsOrMeta
    : {
      meta: optionsOrMeta,
      tests: tests!,
      fn: fn!,
    };

  if (options.meta.main) {
    await options.fn();
  } else {
    registerTest(options);
  }
}

function registerTest(options: AssertPromptSnapshotOptions) {
  const fileName = basename(options.meta.url);

  Deno.test({
    name: `assert prompt snapshot - ${fileName}`,
    async fn(ctx) {
      const tests = Object.entries(options.tests ?? {});
      if (!tests.length) {
        throw new Error(`No tests defined for: ${options.meta.url}`);
      }

      for (const [name, inputs] of tests) {
        await ctx.step({
          name,
          async fn() {
            const output: string = await runPrompt(options.meta.url, inputs);
            const suffix = options.osSuffix?.includes(Deno.build.os)
              ? `.${Deno.build.os}`
              : "";

            await assertSnapshot(ctx, output, {
              path: `__snapshots__/${fileName}${suffix}.snap`,
            });
          },
        });
      }
    },
  });
}

async function runPrompt(
  url: string,
  inputs: Array<string>,
): Promise<string> {
  const cmd = new Deno.Command("deno", {
    stdin: "piped",
    stdout: "piped",
    stderr: "piped",
    args: [
      "run",
      "--allow-all",
      url,
    ],
    env: {
      NO_COLOR: "true",
    },
  });
  const child: Deno.ChildProcess = cmd.spawn();
  const writer = child.stdin.getWriter();

  for (const input of inputs) {
    await writer.write(encoder.encode(input));
    // Ensure all inputs are processed and rendered separately.
    await new Promise((resolve) => setTimeout(resolve, 600));
  }

  const { success, stdout, stderr } = await child.output();
  writer.releaseLock();
  await child.stdin.close();

  if (!success) {
    throw new Error(`test failed: ${url}`);
  }

  // Add a line break after each test input.
  return "stdout:\n" + new TextDecoder().decode(stdout).replaceAll(
    eraseDown(),
    eraseDown() + "\n",
  ) + "\nstderr:\n" + new TextDecoder().decode(stderr).replaceAll(
    eraseDown(),
    eraseDown() + "\n",
  );
}
