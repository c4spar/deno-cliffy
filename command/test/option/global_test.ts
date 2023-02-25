import { assertEquals, assertRejects } from "../../../dev_deps.ts";
import { Command } from "../../command.ts";
import type { ArgumentValue } from "../../types.ts";
import { ValidationError } from "../../_errors.ts";

const cmd = () =>
  new Command()
    .noExit()
    .version("0.1.0")
    .option("-b, --base", "Only available on this command.")
    .type(
      "custom",
      ({ value }: ArgumentValue) => value.toUpperCase(),
      { global: true },
    )
    .option(
      "-g, --global [val:custom]",
      "Available on all commands.",
      { global: true },
    )
    .globalOption("-G, --global2 [val:string]", "Available on all commands.")
    .globalOption("-o, --global3 [val:string]", "Available on all commands.")
    .command(
      "cmd1",
      new Command()
        .option("-l, --level2 [val:custom]", "Only available on this command.")
        .description("Some sub command.")
        .command(
          "cmd2",
          new Command()
            .option(
              "-L, --level3 [val:custom]",
              "Only available on this command.",
            )
            .description("Some nested sub command."),
        )
        .command(
          "cmd3",
          new Command()
            .option(
              "-L, --level3 [val:custom]",
              "Only available on this command.",
            )
            .description("Some nested sub command.")
            .noGlobals(),
        )
        .reset(),
    );

Deno.test("[command] should parse global options", async () => {
  const { options, args } = await cmd().parse(["-g", "halo", "-G", "halo"]);

  assertEquals(options, { global: "HALO", global2: "halo" });
  assertEquals(args, []);
});

Deno.test("[command] should parse global options on sub command", async () => {
  const { options, args } = await cmd().parse([
    "cmd1",
    "-g",
    "foo",
    "-G",
    "bar",
    "-o",
    "baz",
  ]);

  assertEquals(options, { global: "FOO", global2: "bar", global3: "baz" });
  assertEquals(args, []);
});

Deno.test("[command] should parse global options on nested sub command", async () => {
  const { options, args } = await cmd().parse(
    ["cmd1", "cmd2", "-g", "foo", "-G", "bar", "-o", "baz"],
  );

  assertEquals(options, { global: "FOO", global2: "bar", global3: "baz" });
  assertEquals(args, []);
});

Deno.test("[command] should parse global options before sub commands", async () => {
  const { options, args } = await cmd().parse(
    ["-g", "foo", "cmd1", "-G", "bar", "cmd2", "-o", "baz"],
  );

  assertEquals(options, { global: "FOO", global2: "bar", global3: "baz" });
  assertEquals(args, []);
});

Deno.test("[command] should collect global options before sub commands", async () => {
  const { options, args } = await new Command()
    .noExit()
    .globalOption("--collect <value>", "...", { collect: true })
    .command("cmd1", new Command().command("cmd2"))
    .parse(
      [
        "--collect",
        "foo",
        "cmd1",
        "--collect",
        "bar",
        "cmd2",
        "--collect",
        "baz",
      ],
    );

  assertEquals(options, { collect: ["foo", "bar", "baz"] });
  assertEquals(args, []);
});

Deno.test("[command] should parse global options before and after normal option", async () => {
  const { options, args } = await new Command()
    .noExit()
    .globalOption("--global", "...", { collect: true })
    .command("foo")
    .option("--foo", "...", { collect: true })
    .parse(
      ["foo", "--global", "--foo", "--global", "--foo"],
    );

  assertEquals(options, { global: [true, true], foo: [true, true] });
  assertEquals(args, []);
});

Deno.test("[command] should disable global options with noGlobals", async () => {
  await assertRejects(
    () =>
      cmd().parse(
        ["cmd1", "cmd3", "-g", "foo"],
      ),
    ValidationError,
    'Unknown option "-g". Did you mean option "-h"?',
  );
});

Deno.test("[command] should not disable global -h option with noGlobals", async () => {
  await cmd().parse(
    ["cmd1", "cmd3", "-h"],
  );
});

Deno.test("[command] should not disable global --help option with noGlobals", async () => {
  await cmd().parse(
    ["cmd1", "cmd3", "--help"],
  );
});

const cmdWithDefaults = () =>
  new Command()
    .noExit()
    .version("0.1.0")
    .option(
      "-g, --global [val:boolean]",
      "Available on all commands.",
      {
        global: true,
        default: true,
      },
    )
    .option(
      "-a, --alt [val:boolean]",
      "Available on all commands.",
      {
        global: true,
        default: false,
      },
    )
    .command(
      "cmd1",
      new Command()
        .description("Some sub command.")
        .command(
          "cmd2",
          new Command()
            .option(
              "-l, --level3 [val:boolean]",
              "Only available on this command.",
            )
            .description("Some nested sub command."),
        ),
    );

Deno.test("[command] should parse options when used interchangeable and global options have defaults", async () => {
  const { options, args } = await cmdWithDefaults().parse([
    "cmd1",
    "cmd2",
    "-a",
    "-l",
    "false",
    "-g",
    "false",
  ]);

  assertEquals(options, { global: false, alt: true, level3: false });
  assertEquals(args, []);
});
