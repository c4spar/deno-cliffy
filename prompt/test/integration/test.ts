import { eraseDown } from "../../../ansi/ansi_escapes.ts";
import {
  assertSnapshot,
  dirname,
  expandGlob,
  lt,
  WalkEntry,
} from "../../../dev_deps.ts";

type TestModule = {
  tests?: Record<string, Array<string>>;
};

const baseDir = `${dirname(import.meta.url).replace("file://", "")}`;

for await (const file: WalkEntry of expandGlob(`${baseDir}/fixtures/*.ts`)) {
  if (file.isFile) {
    const name = file.name.replace(/_/g, " ").replace(".ts", "");

    Deno.test({
      name: `prompt - integration - ${name}`,
      ignore: lt(Deno.version.deno, "1.10.0"),
      async fn(ctx) {
        const testModule: TestModule = await import(file.path);
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
      "--unstable",
      "--allow-all",
    ];
  }
  return [
    "--unstable",
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
    await writer.write(new TextEncoder().encode(input));
    await new Promise((resolve) => setTimeout(resolve, 200));
  }

  const { success, stdout } = await child.output();
  writer.releaseLock();
  child.stdin.close();

  if (!success) {
    throw new Error(`test failed: ${file}`);
  }

  // Add a line break after each test input.
  return new TextDecoder().decode(stdout).replaceAll(
    eraseDown(),
    eraseDown() + "\n",
  );
}
