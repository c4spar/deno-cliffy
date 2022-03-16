import { assertEquals, assertRejects } from "../../../dev_deps.ts";
import { Command } from "../../command.ts";

const cmd = new Command()
  .throwErrors()
  .allowEmpty(false)
  .option("-f, --flag [value:string]", "description ...", { required: true })
  .action(() => {});

Deno.test("command optionRequired", async () => {
  const { options, args } = await cmd.parse(["-f", "value"]);

  assertEquals(options, { flag: "value" });
  assertEquals(args, []);
});

Deno.test("command optionRequired noArguments", async () => {
  await assertRejects(
    async () => {
      await cmd.parse([]);
    },
    Error,
    `Missing required option "--flag".`,
  );
});
