import { assertEquals, assertRejects } from "../../../dev_deps.ts";
import { Command } from "../../command.ts";

Deno.test("command stopEarly disable", async () => {
  const { options, args, literal } = await new Command()
    .throwErrors()
    .option("-f, --flag [value:boolean]", "description ...")
    .option("-s, --script-arg1 [value:boolean]", "description ...")
    .option("-S, --script-arg2 [value:boolean]", "description ...")
    .arguments("[script:string] [args...:string]")
    .action(() => {})
    .parse([
      "-f",
      "true",
      "run",
      "script-name",
      "--script-arg1",
      "--script-arg2",
      "--",
      "--literal-arg1",
      "--literal-arg2",
    ]);

  assertEquals(options, { flag: true, scriptArg1: true, scriptArg2: true });
  assertEquals(args, ["run", "script-name"]);
  assertEquals(literal, ["--literal-arg1", "--literal-arg2"]);
});

Deno.test("command stopEarly enabled", async () => {
  const { options, args, literal } = await new Command()
    .throwErrors()
    .stopEarly()
    .option("-f, --flag [value:boolean]", "description ...")
    .option("-s, --script-arg1 [value:boolean]", "description ...")
    .option("-S, --script-arg2 [value:boolean]", "description ...")
    .arguments("[script:string] [args...:string]")
    .action(() => {})
    .parse([
      "-f",
      "true",
      "run",
      "script-name",
      "--script-arg1",
      "--script-arg2",
      "--script-arg3",
      "--",
      "--literal-arg1",
      "--literal-arg2",
    ]);

  assertEquals(options, { flag: true });
  assertEquals(
    args,
    ["run", "script-name", "--script-arg1", "--script-arg2", "--script-arg3"],
  );
  assertEquals(literal, ["--literal-arg1", "--literal-arg2"]);
});

Deno.test("command stopEarly unknown option", async () => {
  const cmd = new Command()
    .throwErrors()
    .stopEarly()
    .option("-f, --flag [value:boolean]", "description ...")
    .option("-s, --script-arg1 [value:boolean]", "description ...")
    .option("-S, --script-arg2 [value:boolean]", "description ...")
    .action(() => {});

  await assertRejects(
    async () => {
      await cmd.parse([
        "-f",
        "true",
        "-t",
        "true",
        "run",
        "script-name",
        "--script-arg1",
        "--script-arg2",
        "--script-arg3",
        "--",
        "--literal-arg1",
        "--literal-arg2",
      ]);
    },
    Error,
    `Unknown option "-t". Did you mean option "-h"?`,
  );
});
