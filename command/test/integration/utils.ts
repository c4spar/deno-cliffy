import { dirname } from "../../../dev_deps.ts";

export const baseDir = `${dirname(import.meta.url).replace("file://", "")}`;

export async function runCommand(cmd: Array<string>): Promise<string> {
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
