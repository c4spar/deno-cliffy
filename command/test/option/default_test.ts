import { assertEquals } from "../../../dev_deps.ts";
import { Command } from "../../command.ts";

Deno.test("command: option -> default", async () => {
  const { options, args } = await new Command()
    .throwErrors()
    .option("--flag1", "flag 1")
    .option("--flag2 <val:string>", "flag 2", { default: "example" })
    .parse([]);

  assertEquals(options, { flag2: "example" });
  assertEquals(args, []);
});

Deno.test("command: option -> default", async () => {
  const { options, args } = await new Command()
    .throwErrors()
    .option("--flag1", "flag 1")
    .option("--flag2 <val:string>", "flag 2", { default: "example" })
    .parse(["--flag1"]);

  assertEquals(options, { flag1: true, flag2: "example" });
  assertEquals(args, []);
});

Deno.test("command: option -> default", async () => {
  const { options, args } = await new Command()
    .throwErrors()
    .option("--flag1", "flag 1")
    .option("--flag2 <val:string>", "flag 2", { default: "example" })
    .parse(["--flag2", "test"]);

  assertEquals(options, { flag2: "test" });
  assertEquals(args, []);
});

Deno.test("command: option -> default", async () => {
  const { options, args } = await new Command()
    .throwErrors()
    .option("--flag1", "flag 1")
    .option("--flag2 <val:string>", "flag 2", { default: "example" })
    .parse(["--flag1", "--flag2", "test"]);

  assertEquals(options, { flag1: true, flag2: "test" });
  assertEquals(args, []);
});
