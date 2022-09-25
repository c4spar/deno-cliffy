import { expandGlobSync } from "https://deno.land/std@0.154.0/fs/expand_glob.ts";

const files = [...expandGlobSync("./examples/**/**.ts")];

await Promise.all(files.map((file) => checkExample(file.path)));

async function checkExample(file: string) {
  console.log("Type check example:", file);
  const output = await Deno.spawn("deno", {
    args: ["check", "--unstable", file],
  });
  if (!output.success) {
    throw new Error(
      `Type checking failed for ${file} \n${
        new TextDecoder().decode(output.stderr)
      }`,
    );
  }
}
