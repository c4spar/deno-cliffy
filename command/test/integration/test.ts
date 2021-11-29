import { assertEquals, expandGlob } from "../../../dev_deps.ts";
import { baseDir, runCommand } from "./utils.ts";

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
        assertEquals(output, expected);
      },
    });
  }
}
