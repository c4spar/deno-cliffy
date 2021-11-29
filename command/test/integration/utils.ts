import { dirname } from "../../../dev_deps.ts";

export const baseDir = `${dirname(import.meta.url).replace("file://", "")}`;

export async function runCommand(args: Array<string>): Promise<string> {
  const process = Deno.run({
    stdout: "piped",
    cmd: [
      "deno",
      "run",
      "--unstable",
      "--allow-all",
      `${baseDir}/command.ts`,
      ...args,
    ],
  });

  const [status, output] = await Promise.all([
    process.status(),
    process.output(),
  ]);
  process.close();

  if (!status.success) {
    throw new Error("test command failed");
  }

  return new TextDecoder().decode(output);
}
