import { assert, assertEquals } from "../../../dev_deps.ts";
import { Command } from "../../command.ts";

interface IStats {
  context?: null | Command;
  options?: unknown;
  args?: unknown;
}

Deno.test("command option action", async () => {
  const stats: IStats = {};

  const cmd = new Command()
    .throwErrors()
    .arguments("[beep:string]")
    .option("-f, --foo [value:string]", "action ...", {
      action: function (options, ...args) {
        stats.context = this;
        stats.options = options;
        stats.args = args;
      },
    });

  const { options, args } = await cmd.parse(["--foo", "bar", "beep"]);

  assert(stats.context, "option action not executed");
  assertEquals(stats.context, cmd);
  assertEquals(stats.options, { foo: "bar" });
  assertEquals(stats.args, ["beep"]);
  assertEquals(stats.options, options);
  assertEquals(stats.args, args);
});

Deno.test("sub-command option action", async () => {
  const stats: IStats = {};
  let subCmd: Command;

  const cmd = new Command()
    .throwErrors()
    .command(
      "foo",
      subCmd = new Command()
        .arguments("[beep:string]")
        .option("-b, --bar [value:string]", "action ...", {
          action: function (options, ...args) {
            stats.context = this;
            stats.options = options;
            stats.args = args;
          },
        }),
    );

  const { options, args } = await cmd.parse(["foo", "--bar", "baz", "beep"]);

  assert(stats.context, "option action not executed");
  assertEquals(stats.context, subCmd);
  assertEquals(stats.options, { bar: "baz" });
  assertEquals(stats.args, ["beep"]);
  assertEquals(stats.options, options);
  assertEquals(stats.args, args);
});

Deno.test("option action with dashed option name", async () => {
  const stats: IStats = {};

  const cmd = new Command()
    .throwErrors()
    .arguments("[beep:string] [boop:string]")
    .option("-f, --foo-bar", "action ...", {
      action: function (options, ...args) {
        stats.context = this;
        stats.options = options;
        stats.args = args;
      },
    });

  const { options, args } = await cmd.parse(["-f", "beep", "boop"]);

  assert(stats.context, "option action not executed");
  assertEquals(stats.context, cmd);
  assertEquals(stats.options, { fooBar: true });
  assertEquals(stats.args, ["beep", "boop"]);
  assertEquals(stats.options, options);
  assertEquals(stats.args, args);
});

Deno.test("option action with dashed option name an value", async () => {
  const stats: IStats = {};

  const cmd = new Command()
    .throwErrors()
    .arguments("[beep:string]")
    .option("-f, --foo-bar [value:string]", "action ...", {
      action: function (options, ...args) {
        stats.context = this;
        stats.options = options;
        stats.args = args;
      },
    });

  const { options, args } = await cmd.parse(["-f", "beep", "boop"]);

  assert(stats.context, "option action not executed");
  assertEquals(stats.context, cmd);
  assertEquals(stats.options, { fooBar: "beep" });
  assertEquals(stats.args, ["boop"]);
  assertEquals(stats.options, options);
  assertEquals(stats.args, args);
});
