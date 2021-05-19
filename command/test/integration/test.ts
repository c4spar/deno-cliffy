import { assertEquals, dirname, expandGlob } from "../../../dev_deps.ts";

const baseDir = `${dirname(import.meta.url).replace("file://", "")}`;

for await (const file of expandGlob(`${baseDir}/fixtures/*.in`)) {
  if (file.isFile) {
    const name = file.name.replace(/_/g, " ").replace(".in", "");
    const outPath = file.path.replace(/\.in$/, ".out");
    Deno.test({
      name: `command - integration - ${name}`,
      ignore: Deno.build.os === "windows",
      async fn() {
        const [cmd, expected] = await Promise.all([
          Deno.readTextFile(file.path),
          Deno.readTextFile(outPath),
        ]);
        const output: string = await runCommand(cmd.split(" "));
        assertEquals(
          output,
          expected
            .replace(/\\x1b/g, "\x1b")
            .replace(/\r\n/g, "\n"),
        );
      },
    });
  }
}

async function runCommand(cmd: Array<string>): Promise<string> {
  const process = Deno.run({
    stdout: "piped",
    cmd: [
      "deno",
      "run",
      "--unstable",
      "--allow-all",
      `${baseDir}/command.ts`,
      ...cmd,
    ],
  });

  const output = await process.output();
  process.close();

  return new TextDecoder().decode(output);
}
