import { Command } from "../../lib/command.ts";
import { assertEquals } from "../lib/assert.ts";

Deno.test("command optionAction action", async () => {
  let actionOptions!: any;
  let actionArgs!: string[];

  const cmd = new Command()
    .throwErrors()
    .arguments("[argument]")
    .option("-a, --action <action:string>", "action ...", {
      action: (options: any, ...args: string[]) => {
        actionOptions = options;
        actionArgs = args;
      },
    });

  const { options, args } = await cmd.parse(["-a", "my-action", "arg"]);

  assertEquals(options, { action: "my-action" });
  assertEquals(actionOptions, { action: "my-action" });
  assertEquals(actionArgs, ["arg"]);
  assertEquals(args, ["arg"]);
});
