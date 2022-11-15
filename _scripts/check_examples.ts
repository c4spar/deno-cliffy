import { expandGlobSync } from "https://deno.land/std@0.161.0/fs/expand_glob.ts";

const MAX_PARALLEL = Number(Deno.env.get("MAX_PARALLEL")) || 8;
const files = [...expandGlobSync("./examples/**/**.ts")];
const errors: Array<Error> = [];

await Promise.all(
  files.splice(0, MAX_PARALLEL).map((file) => checkExample(file.path)),
);

if (errors.length) {
  errors.forEach((error) => console.error(error));
  console.error("%s examples have errors.", errors.length);
  Deno.exit(1);
}

async function checkExample(file: string): Promise<void> {
  console.log("Type check example:", file);
  const output = await Deno.spawn("deno", {
    args: ["check", "--unstable", file],
  });
  if (!output.success) {
    errors.push(
      new Error(
        `Type checking failed for ${file} \n${
          new TextDecoder().decode(output.stderr)
        }`,
      ),
    );
  }
  const nextFile = files.shift();
  if (nextFile) {
    return checkExample(nextFile.path);
  }
}
