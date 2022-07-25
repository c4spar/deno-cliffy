import { assertEquals } from "../../../dev_deps.ts";
import { Command } from "../../command.ts";
import type { ITypeInfo } from "../../types.ts";

const cmd = new Command()
  .throwErrors()
  .version("0.1.0")
  .option("-b, --base", "Only available on this command.")
  .type(
    "custom",
    ({ value }: ITypeInfo) => value.toUpperCase(),
    { global: true },
  )
  .option(
    "-g, --global [val:custom]",
    "Available on all commands.",
    { global: true },
  )
  .globalOption("-G, --global2 [val:string]", "Available on all commands.")
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
      .reset(),
  );

Deno.test("command with global option", async () => {
  const { options, args } = await cmd.parse(["-g", "halo", "-G", "halo"]);

  assertEquals(options, { global: "HALO", global2: "halo" });
  assertEquals(args, []);
});

Deno.test("sub command with global option", async () => {
  const { options, args } = await cmd.parse([
    "cmd1",
    "-g",
    "halo",
    "-G",
    "halo",
  ]);

  assertEquals(options, { global: "HALO", global2: "halo" });
  assertEquals(args, []);
});

Deno.test("sub command with global option before sub command", async () => {
  const { options, args } = await cmd.parse([
    "-g",
    "halo",
    "cmd1",
    "-G",
    "halo",
  ]);

  assertEquals(options, { global: "HALO", global2: "halo" });
  assertEquals(args, []);
});

Deno.test("nested sub command with global option", async () => {
  const { options, args } = await cmd.parse(
    ["cmd1", "cmd2", "-g", "halo", "-G", "halo"],
  );

  assertEquals(options, { global: "HALO", global2: "halo" });
  assertEquals(args, []);
});

Deno.test("nested sub command with global option before sub command", async () => {
  const { options, args } = await cmd.parse(
    ["-g", "halo", "cmd1", "-G", "halo", "cmd2"],
  );

  assertEquals(options, { global: "HALO", global2: "halo" });
  assertEquals(args, []);
});

Deno.test("sub command with global option", async () => {
  const { options, args } = await cmd.parse(["cmd1", "-l", "halo"]);

  assertEquals(options, { level2: "HALO" });
  assertEquals(args, []);
});

Deno.test("nested sub command with global option", async () => {
  const { options, args } = await cmd.parse(
    ["cmd1", "cmd2", "-L", "halo"],
  );

  assertEquals(options, { level3: "HALO" });
  assertEquals(args, []);
});
