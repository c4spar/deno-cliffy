import {
  assert,
  assertSnapshot,
  copy,
  dirname,
  expandGlob,
  lt,
  WalkEntry,
} from "../../../dev_deps.ts";

const baseDir = `${dirname(import.meta.url).replace("file://", "")}`;

for await (const file: WalkEntry of expandGlob(`${baseDir}/fixtures/*.ts`)) {
  if (file.isFile) {
    const name = file.name.replace(/_/g, " ").replace(".ts", "");
    Deno.test({
      name: `prompt - integration - ${name}`,
      ignore: lt(Deno.version.deno, "1.10.0"),
      async fn(t) {
        const output: string = await runPrompt(file);
        const os = Deno.build.os === "windows" ? ".windows" : "";
        await assertSnapshot(t, output, {
          path: `__snapshots__/test.ts${os}.snap`,
        });
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

async function runPrompt(file: WalkEntry): Promise<string> {
  const inputPath: string = file.path.replace(/\.ts$/, ".in");
  const inputFile = await Deno.open(inputPath);
  const flags = getCmdFlagsForFile(file);
  const process = Deno.run({
    stdin: "piped",
    stdout: "piped",
    cmd: [
      "deno",
      "run",
      ...flags,
      file.path,
    ],
    env: {
      NO_COLOR: "true",
    },
  });

  const [output, bytesCopied] = await Promise.all([
    process.output(),
    copy(inputFile, process.stdin),
  ]);
  inputFile.close();
  process.stdin.close();
  process.close();

  assert(bytesCopied > 0, "No bytes copied");

  return new TextDecoder().decode(output);
}
