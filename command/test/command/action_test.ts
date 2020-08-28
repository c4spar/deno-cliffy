import { assertEquals } from "../../../dev_deps.ts";
import { Command } from "../../command.ts";

interface IStats {
  context: null | Command;
  options: unknown;
  args: unknown;
}

function createStats(): IStats {
  return {
    context: null,
    options: null,
    args: null,
  };
}

Deno.test("flags allowEmpty enabled", async () => {
  const stats: IStats = createStats();

  const cmd: Command = new Command()
    .throwErrors()
    .arguments("[beep:string]")
    .option("-f, --foo [value:string]", "description ...")
    .action(function (options, ...args) {
      stats.context = this;
      stats.options = options;
      stats.args = args;
    });

  const { options, args } = await cmd.parse(["--foo", "bar", "beep"]);

  assertEquals(stats.context, cmd);
  assertEquals(stats.options, { foo: "bar" });
  assertEquals(stats.args, ["beep"]);
  assertEquals(stats.options, options);
  assertEquals(stats.args, args);
});

Deno.test("flags allowEmpty enabled", async () => {
  const stats: IStats = createStats();
  let subCmd: Command;

  const cmd: Command = new Command()
    .throwErrors()
    .command(
      "foo",
      subCmd = new Command()
        .arguments("[beep:string]")
        .option("-b, --bar [value:string]", "description ...")
        .action(function (options, ...args) {
          stats.context = this;
          stats.options = options;
          stats.args = args;
        }),
    );

  const { options, args } = await cmd.parse(["foo", "--bar", "baz", "beep"]);

  assertEquals(stats.context, subCmd);
  assertEquals(stats.options, { bar: "baz" });
  assertEquals(stats.args, ["beep"]);
  assertEquals(stats.options, options);
  assertEquals(stats.args, args);
});
