import {
  assert,
  assertEquals,
  dirname,
  expandGlob,
  WalkEntry,
} from "../../../dev_deps.ts";

const baseDir = `${dirname(import.meta.url).replace("file://", "")}`;

for await (const file: WalkEntry of expandGlob(`${baseDir}/fixtures/*.ts`)) {
  if (file.isFile) {
    const name = file.name.replace(/_/g, " ").replace(".ts", "");
    Deno.test({
      name: `prompt - integration - ${name}`,
      async fn() {
        const output: string = await runPrompt(file);
        const expectedOutput: string = await getExpectedOutput(file.path);
        assertEquals(
          output,
          expectedOutput
            .replace(/\\x1b/g, "\x1b")
            .replace(/\r\n/g, "\n"),
        );
      },
    });
  }
}

async function getExpectedOutput(path: string) {
  const osOutputPath = path.replace(/\.ts$/, `_${Deno.build.os}.out`);
  try {
    return await Deno.readTextFile(osOutputPath);
  } catch (e) {
    const outputPath = path.replace(/\.ts$/, ".out");
    return await Deno.readTextFile(outputPath);
  }
}

async function runPrompt(file: WalkEntry): Promise<string> {
  const inputPath: string = file.path.replace(/\.ts$/, ".in");
  const inputFile = await Deno.open(inputPath);
  const process = Deno.run({
    stdin: "piped",
    stdout: "piped",
    cmd: [
      "deno",
      "run",
      "--unstable",
      "--allow-all",
      file.path,
    ],
    env: {
      NO_COLOR: "true",
    },
  });

  const [output, bytesCopied] = await Promise.all([
    process.output(),
    Deno.copy(inputFile, process.stdin),
  ]);
  inputFile.close();
  process.stdin.close();
  process.close();

  assert(bytesCopied > 0, "No bytes copied");

  return new TextDecoder().decode(output);
}
