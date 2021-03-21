import { assertEquals, dirname, expandGlob } from "../../../dev_deps.ts";

for await (const file of expandGlob(`${dir()}/fixtures/*.in`)) {
  if (file.isFile) {
    const name = file.name.replace(/_/g, " ").replace(".in", "");
    const outPath = file.path.replace(/\.in$/, ".out");
    Deno.test({
      name: `command - integration - ${name}`,
      async fn() {
        const cmd: string = await Deno.readTextFile(file.path);
        const expected: string = await Deno.readTextFile(outPath);
        const output: string = await runCommand(cmd.trim().split(" "));
        assertEquals(output.trim(), expected.trim());
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
      `${dir()}/command.ts`,
      ...cmd,
    ],
  });

  const output = await process.output();
  process.close();

  return new TextDecoder().decode(output);
}

function dir(): string {
  return `${dirname(import.meta.url).replace("file://", "")}`;
}
