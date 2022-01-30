import { assertEquals } from "../../../dev_deps.ts";
import { Command } from "../../command.ts";
import type { ITypeInfo } from "../../types.ts";

const cmd = new Command()
  .version("0.1.0")
  .option("-b, --base", "Only available on this command.")
  .type(
    "custom",
    ({ value }: ITypeInfo) => value.toUpperCase(),
    { global: true },
  )
  .option(
    "-g, --global [val:custom]",
    "Available on all command's.",
    { global: true },
  )
  .globalOption("-G, --global2 [val:string]", "Available on all command's.")
  .command(
    "sub-command",
    new Command()
      .option("-l, --level2 [val:custom]", "Only available on this command.")
      .description("Some sub command.")
      .command(
        "sub-command",
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
    "sub-command",
    "-g",
    "halo",
    "-G",
    "halo",
  ]);

  assertEquals(options, { global: "HALO", global2: "halo" });
  assertEquals(args, []);
});

Deno.test("nested sub command with global option", async () => {
  const { options, args } = await cmd.parse(
    ["sub-command", "sub-command", "-g", "halo", "-G", "halo"],
  );

  assertEquals(options, { global: "HALO", global2: "halo" });
  assertEquals(args, []);
});

Deno.test("sub command with global option", async () => {
  const { options, args } = await cmd.parse(["sub-command", "-l", "halo"]);

  assertEquals(options, { level2: "HALO" });
  assertEquals(args, []);
});

Deno.test("nested sub command with global option", async () => {
  const { options, args } = await cmd.parse(
    ["sub-command", "sub-command", "-L", "halo"],
  );

  assertEquals(options, { level3: "HALO" });
  assertEquals(args, []);
});
