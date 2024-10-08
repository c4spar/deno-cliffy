import { test } from "@cliffy/internal/testing/test";
import { assertEquals } from "@std/assert";
import { stripAnsiCode } from "@std/fmt/colors";
import { Command } from "../../command.ts";

function command() {
  return new Command()
    .throwErrors()
    .version("1.0.0")
    .description("Test description ...")
    .option(
      "-H, --hidden <value:string>",
      "Nobody knows about me!",
      { hidden: true },
    )
    .hidden();
}

test("hidden option", async () => {
  const cmd = command();
  const { options, args } = await cmd.parse(["--hidden", "test"]);

  assertEquals(options, { hidden: "test" });
  assertEquals(args, []);
});

test("hidden option help", () => {
  const cmd = command();
  const output: string = cmd.getHelp();

  assertEquals(
    `
Usage:   COMMAND
Version: 1.0.0  

Description:

  Test description ...

Options:

  -h, --help     - Show this help.                            
  -V, --version  - Show the version number for this program.  
`,
    stripAnsiCode(output),
  );
});
