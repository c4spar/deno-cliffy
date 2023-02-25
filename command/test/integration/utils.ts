import { dirname } from "../../../dev_deps.ts";

export const baseDir = `${dirname(import.meta.url).replace("file://", "")}`;

export async function runCommand(
  args: Array<string> | string,
  canFail = false,
): Promise<string> {
  if (typeof args === "string") {
    args = args.split(" ");
  }
  const process = Deno.run({
    stdout: "piped",
    stderr: "piped",
    cmd: [
      "deno",
      "run",
      "--allow-all",
      `${baseDir}/command.ts`,
      ...args,
    ],
  });

  const [status, output, errorOutput] = await Promise.all([
    process.status(),
    process.output(),
    process.stderrOutput(),
  ]);
  process.close();

  if (!status.success && !canFail) {
    throw new Error(
      "test command failed: " + new TextDecoder().decode(errorOutput),
    );
  }

  return new TextDecoder().decode(output) +
    (canFail ? new TextDecoder().decode(errorOutput) : "");
}
