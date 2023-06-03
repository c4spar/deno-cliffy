import { assertEquals, assertRejects } from "../../../dev_deps.ts";
import { Command } from "../../command.ts";
import { ValidationError } from "../../_errors.ts";
import { HelpCommand } from "../../help/help_command.ts";

const cmd = () =>
  new Command()
    .name("test")
    .noExit()
    .version("0.1.0")
    .command("global [val:string]", "global command...")
    .global()
    .command("help", new HelpCommand())
    .global()
    .command(
      "command1",
      new Command()
        .description("Some sub command.")
        .command(
          "command2",
          new Command()
            .description("Some nested sub command."),
        )
        .command(
          "command3",
          new Command()
            .description("Some nested sub command.")
            .noGlobals(),
        ),
    );

Deno.test("[command] should execute global command", async () => {
  const { options, args } = await cmd().parse(["global", "halo"]);

  assertEquals(options, {});
  assertEquals(args, ["halo"]);
});

Deno.test("[command] should execute global command on sub command", async () => {
  const { options, args } = await cmd().parse(["command1", "global", "halo"]);

  assertEquals(options, {});
  assertEquals(args, ["halo"]);
});

Deno.test("[command] should execute global command on nested sub command", async () => {
  const { options, args } = await cmd().parse(
    ["command1", "command2", "global", "halo"],
  );

  assertEquals(options, {});
  assertEquals(args, ["halo"]);
});

Deno.test("[command] should disable global commands with noGlobals", async () => {
  await assertRejects(
    () =>
      cmd().parse(
        ["command1", "command3", "global", "halo"],
      ),
    ValidationError,
    'Unknown command "global". Did you mean command "help"?',
  );
});

Deno.test("[command] should not disable global help command with noGlobals", async () => {
  await cmd().parse(
    ["command1", "command3", "help"],
  );
});
