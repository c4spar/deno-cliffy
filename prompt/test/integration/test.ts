import { eraseDown } from "../../../ansi/ansi_escapes.ts";
import {
  assertSnapshot,
  dirname,
  expandGlob,
  WalkEntry,
} from "../../../dev_deps.ts";

type TestModule = {
  tests?: Record<string, Array<string>>;
};

const baseDir = `${dirname(import.meta.url).replace("file://", "")}`;
const encoder = new TextEncoder();

for await (const file: WalkEntry of expandGlob(`${baseDir}/fixtures/*.ts`)) {
  if (file.isFile) {
    const name = file.name.replace(/_/g, " ").replace(".ts", "");

    Deno.test({
      name: `prompt - integration - ${name}`,
      async fn(ctx) {
        const testModule: TestModule = await import("file://" + file.path);
        const tests = Object.entries(testModule.tests ?? {});

        if (!tests.length) {
          throw new Error(`Now tests defined for: ${file.path}`);
        }

        for (const [name, inputs] of tests) {
          await ctx.step({
            name,
            async fn() {
              const output: string = await runPrompt(file, inputs);
              const os = Deno.build.os === "windows" ? ".windows" : "";
              await assertSnapshot(ctx, output, {
                path: `__snapshots__/test.ts${os}.snap`,
              });
            },
          });
        }
      },
    });
  }
}

function getCmdFlagsForFile(file: WalkEntry): string[] {
  if (file.name === "input_no_location_flag.ts") {
    return [
      "--allow-all",
    ];
  }
  return [
    "--allow-all",
    "--location",
    "https://cliffy.io",
  ];
}

async function runPrompt(
  file: WalkEntry,
  inputs: Array<string>,
): Promise<string> {
  const flags = getCmdFlagsForFile(file);
  const cmd = new Deno.Command("deno", {
    stdin: "piped",
    stdout: "piped",
    stderr: "piped",
    args: [
      "run",
      ...flags,
      file.path,
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
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  const { success, stdout, stderr } = await child.output();
  writer.releaseLock();
  await child.stdin.close();

  if (!success) {
    throw new Error(`test failed: ${file}`);
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
