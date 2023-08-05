import {
  assertEquals,
  assertRejects,
  assertSpyCalls,
  spy,
} from "../../../dev_deps.ts";
import { Command } from "../../command.ts";

Deno.test("[command] should execute standalone option action", async () => {
  const actionSpy = spy();
  const optionActionSpy = spy();

  const cmd = new Command()
    .throwErrors()
    .option("--standalone", "description ...", {
      action: optionActionSpy,
      standalone: true,
    })
    .action(actionSpy);

  const { options } = await cmd.parse(["--standalone"]);

  assertSpyCalls(optionActionSpy, 1);
  assertSpyCalls(actionSpy, 0);
  assertEquals(options, { standalone: true });
});

Deno.test("[command] should execute main action with standalone option", async () => {
  const actionSpy = spy();

  const cmd = new Command()
    .throwErrors()
    .option("--standalone", "description ...", {
      standalone: true,
    })
    .action(actionSpy);

  const { options } = await cmd.parse(["--standalone"]);

  assertSpyCalls(actionSpy, 1);
  assertEquals(options, { standalone: true });
});

Deno.test("[command] should throw an error if standalone option is combined with other options", async () => {
  const actionSpy = spy();

  const cmd = new Command()
    .throwErrors()
    .option("--standalone", "description ...", {
      standalone: true,
    })
    .option("--foo", "description ...")
    .action(actionSpy);

  await assertRejects(
    () =>
      cmd.parse(
        ["--standalone", "--foo"],
      ),
    Error,
    'Option "--standalone" cannot be combined with other options.',
  );
});
