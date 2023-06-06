import { assertEquals } from "../../../dev_deps.ts";
import { Command } from "../../command.ts";

Deno.test("[command] help - help string", () => {
  const cmd = new Command()
    .throwErrors()
    .help("help: xxx")
    .command("foo")
    .command("bar");

  assertEquals(cmd.getHelp(), "help: xxx");
  assertEquals(cmd.getCommand("foo")?.getHelp(), "help: xxx");
  assertEquals(cmd.getCommand("bar")?.getHelp(), "help: xxx");
});

Deno.test("[command] help - help handler", () => {
  const cmd = new Command()
    .throwErrors()
    .name("main")
    .help(function () {
      return `help: ${this.getName()}`;
    })
    .command("foo")
    .command("bar")
    .reset();

  assertEquals(cmd.getHelp(), "help: main");
  assertEquals(cmd.getCommand("foo")?.getHelp(), "help: foo");
  assertEquals(cmd.getCommand("bar")?.getHelp(), "help: bar");
});

Deno.test("[command] help - override help handler", () => {
  const cmd = new Command()
    .throwErrors()
    .name("main")
    .help(function () {
      return `help: ${this.getName()}`;
    })
    .command("foo")
    .help(`foo help`)
    .command("bar")
    .help(() => `bar help`)
    .reset();

  assertEquals(cmd.getHelp(), "help: main");
  assertEquals(cmd.getCommand("foo")?.getHelp(), "foo help");
  assertEquals(cmd.getCommand("bar")?.getHelp(), "bar help");
});

Deno.test("[command] help - help option", async () => {
  let called = 0;
  const cmd = new Command()
    .throwErrors()
    .name("main")
    .helpOption("-x, --x-help", "", () => {
      called++;
    })
    .command("foo", new Command().command("foo-foo"))
    .command("bar")
    .reset();

  await cmd.parse(["-x"]);
  assertEquals(called, 1);
  await cmd.parse(["foo", "-x"]);
  assertEquals(called, 2);
  await cmd.parse(["foo", "foo-foo", "-x"]);
  assertEquals(called, 3);
  await cmd.parse(["bar", "-x"]);
  assertEquals(called, 4);
});

Deno.test("[command] help - help option action", async () => {
  let called = 0;
  const cmd = new Command()
    .throwErrors()
    .name("main")
    .helpOption("-x, --x-help", "", {
      action: () => {
        called++;
      },
    })
    .command("foo", new Command().command("foo-foo"))
    .command("bar")
    .reset();

  await cmd.parse(["-x"]);
  assertEquals(called, 1);
  await cmd.parse(["foo", "-x"]);
  assertEquals(called, 2);
  await cmd.parse(["foo", "foo-foo", "-x"]);
  assertEquals(called, 3);
  await cmd.parse(["bar", "-x"]);
  assertEquals(called, 4);
});

Deno.test("[command] help - should set usage", () => {
  const cmd = new Command()
    .throwErrors()
    .help({ colors: false })
    .usage("foo bar")
    .arguments("<foo> [bar]");

  assertEquals(
    `
Usage: COMMAND foo bar

Options:

  -h, --help  - Show this help.  
`,
    cmd.getHelp(),
  );
});

Deno.test("[command] help - should group options", () => {
  const cmd = new Command()
    .throwErrors()
    .help({ colors: false })
    .option("--foo", "Foo option.")
    .group("Other options")
    .option("--bar", "Bar option.")
    .option("--baz", "Baz option.")
    .group("Other options 2")
    .option("--beep", "Beep option.")
    .option("--boop", "Boop option.");

  assertEquals(
    `
Usage: COMMAND

Options:

  -h, --help  - Show this help.  
  --foo       - Foo option.      

Other options:

  --bar  - Bar option.  
  --baz  - Baz option.  

Other options 2:

  --beep  - Beep option.  
  --boop  - Boop option.  
`,
    cmd.getHelp(),
  );
});

Deno.test("[command] help - should ignore required options for help option", async () => {
  const ctx = await new Command()
    .noExit()
    .name("bug-with-help-and-required-options")
    .version("0.1.0")
    .description("Help does not work if you have required option(s).")
    .command("bar")
    .description("Help doesn't work, because -f is required.")
    .option("-f, --file <file:string>", "file path", { required: true })
    .action((options) => console.log(options))
    .parse(["bar", "--help"]);

  assertEquals(ctx.options, { help: true });
});
