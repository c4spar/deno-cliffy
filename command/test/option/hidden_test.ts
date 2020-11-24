import { assertEquals, stripColor } from "../../../dev_deps.ts";
import { Command } from "../../command.ts";

function command(): Command {
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

Deno.test("hidden option", async () => {
  const cmd: Command = command();
  const { options, args } = await cmd.parse(["--hidden", "test"]);

  assertEquals(options, { hidden: "test" });
  assertEquals(args, []);
});

Deno.test("hidden option help", () => {
  const cmd: Command = command();
  const output: string = cmd.getHelp();

  assertEquals(
    `
  Usage:   COMMAND
  Version: v1.0.0 

  Description:

    Test description ...

  Options:

    -h, --help     - Show this help.                            
    -V, --version  - Show the version number for this program.  

`,
    stripColor(output),
  );
});
