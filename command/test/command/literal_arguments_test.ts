import { test } from "@cliffy/internal/testing/test";
import { assertEquals } from "@std/assert";
import { Command } from "../../command.ts";

test("command literal arguments", async () => {
  const { options, args, literal } = await new Command()
    .throwErrors()
    .option("-f, --flag [val:string]", "...")
    .action(() => {})
    .parse(["-f", "value", "--", "-t", "abc"]);

  assertEquals(options, { flag: "value" });
  assertEquals(args, []);
  assertEquals(literal, ["-t", "abc"]);
});
