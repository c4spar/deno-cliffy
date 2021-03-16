import { assertEquals } from "../../../dev_deps.ts";
import { Command } from "../../command.ts";

Deno.test("command - raw args - command with usRawArgs disabled", async () => {
  let action = 0;
  const { options, args, literal } = await new Command()
    .throwErrors()
    .default("bar")
    .command("foo")
    .action(() => {
      action = 2;
    })
    .command("bar")
    .action(() => {
      action = 3;
    })
    .parse([]);

  assertEquals(action, 3);
  assertEquals(options, {});
  assertEquals(args, []);
  assertEquals(literal, []);
});
