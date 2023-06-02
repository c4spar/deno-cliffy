import { dirname } from "../../../dev_deps.ts";

export const baseDir = `${dirname(import.meta.url).replace("file://", "")}`;

export async function runCommand(
  args: Array<string> | string,
  canFail = false,
): Promise<string> {
  if (typeof args === "string") {
    args = args.split(" ");
  }
  const cmd = new Deno.Command("deno", {
    stdout: "piped",
    stderr: "piped",
    args: [
      "run",
      "--allow-all",
      `${baseDir}/command.ts`,
      ...args,
    ],
  });

  const { success, stderr, stdout } = await cmd.output();

  if (!success && !canFail) {
    throw new Error(
      "test command failed: " + new TextDecoder().decode(stderr),
    );
  }

  return new TextDecoder().decode(stdout) +
    (canFail ? new TextDecoder().decode(stderr) : "");
}
