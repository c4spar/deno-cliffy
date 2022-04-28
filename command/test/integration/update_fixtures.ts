import { expandGlob } from "../../../dev_deps.ts";
import { baseDir, runCommand } from "./utils.ts";

const promises = [];
for await (const file of expandGlob(`${baseDir}/fixtures/*.in`)) {
  promises.push((async () => {
    if (file.isFile) {
      const outPath = file.path.replace(/\.in$/, ".out");
      const cmd = await Deno.readTextFile(file.path);
      const output: string = await runCommand(cmd.split(" "));
      await Deno.writeTextFile(outPath, output);
    }
  })());
}

await Promise.all(promises);
