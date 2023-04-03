import { AssertionError } from "https://deno.land/std@0.170.0/testing/asserts.ts";
import { assertSnapshot } from "https://deno.land/std@0.170.0/testing/snapshot.ts";
import { eraseDown } from "../ansi/ansi_escapes.ts";
import { basename } from "./deps.ts";

export interface AssertPromptSnapshotOptions {
  /** Test name. */
  name: string;
  /** Import meta. Required to determine the import url of the test file. */
  meta: ImportMeta;
  /**
   * Object of test steps. Key is the test name and the value is an array of
   * input sequences/characters.
   */
  steps: Record<string, Array<string>>;
  /** Test function. */
  fn(): Promise<unknown>;
  /**
   * Operating system snapshot suffix. This is useful when your test produces
   * different output on different operating systems.
   */
  osSuffix?: Array<typeof Deno.build.os>;
  /**
   * Arguments passed to the `deno test` command when executing the snapshot
   * tests. `--allow-env=__CLIFFY_TEST_NAME__` is passed by default.
   */
  args?: Array<string>;
  /**
   * Enable/disable colors. Default is `false`.
   */
  colors?: boolean;
}

const encoder = new TextEncoder();

/**
 * Run prompt snapshot tests.
 *
 * ```ts
 * import { assertPromptSnapshot } from "./testing.ts";
 * import { Input } from "./input.ts";
 *
 * await assertPromptSnapshot({
 *   name: "test name",
 *   meta: import.meta,
 *   osSuffix: ["windows"],
 *   args: [],
 *   steps: {
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
 * @param options Test options
 */
export async function assertPromptSnapshot(
  options: AssertPromptSnapshotOptions,
): Promise<void> {
  if (options.meta.main) {
    const testName = Deno.env.get("__CLIFFY_TEST_NAME__");
    if (testName === options.name) {
      await options.fn();
    }
  } else {
    registerTest(options);
  }
}

function registerTest(options: AssertPromptSnapshotOptions) {
  const fileName = basename(options.meta.url);

  Deno.test({
    name: options.name,
    async fn(ctx) {
      const tests = Object.entries(options.steps ?? {});
      if (!tests.length) {
        throw new Error(`No tests defined for: ${options.meta.url}`);
      }

      for (const [name, inputs] of tests) {
        await ctx.step({
          name,
          async fn(stepCtx) {
            const output: string = await runPrompt(inputs, options);
            const suffix = options.osSuffix?.includes(Deno.build.os)
              ? `.${Deno.build.os}`
              : "";

            await assertSnapshot(stepCtx, output, {
              path: `__snapshots__/${fileName}${suffix}.snap`,
            });
          },
        });
      }
    },
  });
}

async function runPrompt(
  inputs: Array<string>,
  options: AssertPromptSnapshotOptions,
): Promise<string> {
  try {
    const cmd = new Deno.Command("deno", {
      stdin: "piped",
      stdout: "piped",
      stderr: "piped",
      args: [
        "run",
        "--allow-env=__CLIFFY_TEST_NAME__",
        ...options.args ?? [],
        options.meta.url,
      ],
      env: {
        __CLIFFY_TEST_NAME__: options.name ?? "",
        NO_COLOR: options.colors ? "false" : "true",
      },
    });
    const child: Deno.ChildProcess = cmd.spawn();
    const writer = child.stdin.getWriter();

    for (const input of inputs) {
      await writer.write(encoder.encode(input));
      // Ensure all inputs are processed and rendered separately.
      await new Promise((resolve) => setTimeout(resolve, 600));
    }

    const { success, stdout, stderr, code } = await child.output();
    writer.releaseLock();
    await child.stdin.close();

    if (!success) {
      throw new Error(
        `Test command failed with a none zero exit code: ${code}. ${stderr}`,
      );
    }

    // Add a line break after each test input.
    return "stdout:\n" + new TextDecoder().decode(stdout).replaceAll(
      eraseDown(),
      eraseDown() + "\n",
    ) + "\nstderr:\n" + new TextDecoder().decode(stderr).replaceAll(
      eraseDown(),
      eraseDown() + "\n",
    );
  } catch (error: unknown) {
    const assertionError = new AssertionError(
      `Test failed: ${options.meta.url}`,
    );
    assertionError.cause = error;
    throw error;
  }
}
