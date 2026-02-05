import { assertEquals, assertRejects } from "@std/assert";
import { Command } from "../../mod.ts";

Deno.test("bundled global options before subcommand", async () => {
  const cmd = new Command()
    .noExit()
    .name("test")
    .option("-S, --silent", "Silent mode", { global: true })
    .option("-A, --all", "All mode", { global: true })
    .command("sub", "A subcommand")
    .action(() => {});

  // Test bundled flags before subcommand
  const result = await cmd.parse(["-SA", "sub"]);

  assertEquals(result.options.silent, true);
  assertEquals(result.options.all, true);
});

Deno.test("bundled global options with non-global options", async () => {
  const cmd = new Command()
    .noExit()
    .name("test")
    .option("-S, --silent", "Silent mode", { global: true })
    .option("-L, --local", "Local mode", { global: false })
    .command("sub", "A subcommand")
    .action(() => {});

  // Test bundled flags with mix of global and non-global before subcommand
  // This should fail because non-global options cannot appear before subcommands
  await assertRejects(
    () => cmd.parse(["-SL", "sub"]),
    Error,
    "Non-global option -L cannot appear before subcommand.",
  );
});
