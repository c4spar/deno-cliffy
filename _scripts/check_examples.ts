import { expandGlobSync } from "https://deno.land/std@0.170.0/fs/expand_glob.ts";

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
  const proc = Deno.run({
    cmd: ["deno", "check", file],
    stderr: "piped",
  });
  const [status, stderrOutput] = await Promise.all([
    proc.status(),
    proc.stderrOutput(),
  ]);
  proc.close();
  if (!status.success) {
    errors.push(
      new Error(
        `Type checking failed for ${file} \n${
          new TextDecoder().decode(stderrOutput)
        }`,
      ),
    );
  }
  const nextFile = files.shift();
  if (nextFile) {
    return checkExample(nextFile.path);
  }
}
