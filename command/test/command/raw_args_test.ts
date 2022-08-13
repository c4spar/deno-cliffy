import { assertEquals } from "../../../dev_deps.ts";
import { Command } from "../../command.ts";

Deno.test("command - raw args - command with useRawArgs disabled", async () => {
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

Deno.test("command - raw args - command with useRawArgs enabled", async () => {
  const { options, args, literal } = await new Command()
    .throwErrors()
    .option("-f, --flag [value:boolean]", "description ...")
    .option("-s, --script-arg1 [value:boolean]", "description ...")
    .option("-S, --script-arg2 [value:boolean]", "description ...")
    .arguments("[script:string] [args...:string]")
    .useRawArgs()
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

  // TODO: fix empty options type.
  assertEquals(options, {} as unknown as void);
  assertEquals(
    args,
    [
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
    ],
  );
  assertEquals(literal, []);
});
