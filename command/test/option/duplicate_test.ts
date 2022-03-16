import { assertRejects } from "../../../dev_deps.ts";
import { Command } from "../../command.ts";

const cmd = new Command()
  .throwErrors()
  .option("-f, --flag [value:boolean]", "description ...")
  .option("--no-flag", "description ...")
  .action(() => {});

Deno.test("command optionDuplicate flag", async () => {
  await assertRejects(
    async () => {
      await cmd.parse(["-f", "-f", "unknown"]);
    },
    Error,
    `Option "-f" can only occur once, but was found several times.`,
  );
});

Deno.test("command optionDuplicate flagLong", async () => {
  await assertRejects(
    async () => {
      await cmd.parse(["-f", "--flag"]);
    },
    Error,
    `Option "--flag" can only occur once, but was found several times.`,
  );
});

Deno.test("command optionDuplicate flagTrueLongFalse", async () => {
  await assertRejects(
    async () => {
      await cmd.parse(["-f", "true", "--flag", "false"]);
    },
    Error,
    `Option "--flag" can only occur once, but was found several times.`,
  );
});

Deno.test("command optionDuplicate flagTrueNoFlag", async () => {
  await assertRejects(
    async () => {
      await cmd.parse(["-f", "true", "--no-flag"]);
    },
    Error,
    `Option "--flag" can only occur once, but was found several times.`,
  );
});

Deno.test("command optionDuplicate flagTrueNoFlagTrue", async () => {
  await assertRejects(
    async () => {
      await cmd.parse(["-f", "true", "--no-flag", "true"]);
    },
    Error,
    `Option "--flag" can only occur once, but was found several times.`,
  );
});
