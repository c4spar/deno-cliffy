import { expandGlobSync } from "https://deno.land/std@0.158.0/fs/expand_glob.ts";

const files = [...expandGlobSync("./examples/**/**.ts")];

const result = await Promise.all(files.map((file) => checkExample(file.path)));
const errors = result.filter((result) => result instanceof Error);

if (errors.length) {
  errors.forEach((error) => console.error(error));
  console.error("%s examples have errors.", errors.length);
  Deno.exit(1);
}

async function checkExample(file: string) {
  console.log("Type check example:", file);
  const output = await Deno.spawn("deno", {
    args: ["check", "--unstable", file],
  });
  if (!output.success) {
    return new Error(
      `Type checking failed for ${file} \n${
        new TextDecoder().decode(output.stderr)
      }`,
    );
  }
}
