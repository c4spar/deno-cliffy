import { AssertionError } from "https://deno.land/std@0.170.0/testing/asserts.ts";
import { assertSnapshot } from "https://deno.land/std@0.170.0/testing/snapshot.ts";
import { eraseDown } from "../ansi/ansi_escapes.ts";
import { basename, red } from "./deps.ts";

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
   * tests. `--allow-env=ASSERT_PROMPT_SNAPSHOT` is passed by default.
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
    await runTest(options);
  } else {
    registerTest(options);
  }
}

function registerTest(options: AssertPromptSnapshotOptions) {
  const fileName = basename(options.meta.url);

  Deno.test({
    name: options.name,
    async fn(ctx) {
      const steps = Object.entries(options.steps ?? {});
      if (!steps.length) {
        throw new Error(
          `No steps defined for test: ${options.meta.name} -> ${options.meta.url}`,
        );
      }

      for (const [name, inputs] of steps) {
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
  let output: Deno.CommandOutput | undefined;
  let stdout: string | undefined;
  let stderr: string | undefined;

  try {
    const cmd = new Deno.Command("deno", {
      stdin: "piped",
      stdout: "piped",
      stderr: "piped",
      args: [
        "run",
        ...options.args?.length
          ? options.args
          : ["--allow-env=ASSERT_PROMPT_SNAPSHOT"],
        options.meta.url,
      ],
      env: {
        ASSERT_PROMPT_SNAPSHOT: options.name,
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

    output = await child.output();
    stdout = new TextDecoder().decode(output.stdout);
    stderr = new TextDecoder().decode(output.stderr);
    writer.releaseLock();
    await child.stdin.close();
  } catch (error: unknown) {
    const assertionError = new AssertionError(
      `Prompt snapshot test failed: ${options.meta.url}.\n${red(stderr ?? "")}`,
    );
    assertionError.cause = error;
    throw assertionError;
  }

  if (!output.success) {
    throw new AssertionError(
      `Prompt snapshot test: ${options.meta.url}.` +
        `Test command failed with a none zero exit code: ${output.code}.\n${
          red(stderr ?? "")
        }`,
    );
  }

  // Add a line break after each test input.
  return "stdout:\n" + stdout.replaceAll(eraseDown(), eraseDown() + "\n") +
    "\nstderr:\n" + stderr.replaceAll(eraseDown(), eraseDown() + "\n");
}

async function runTest(options: AssertPromptSnapshotOptions) {
  const testName = Deno.env.get("ASSERT_PROMPT_SNAPSHOT");
  if (testName === options.name) {
    await options.fn();
  }
}
