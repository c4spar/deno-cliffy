import {
  assert,
  IsExact,
} from "https://deno.land/x/conditional_type_checks@1.0.6/mod.ts";
import { assertEquals } from "../../../dev_deps.ts";
import { Command } from "../../command.ts";

function cmd() {
  return new Command()
    .throwErrors()
    .globalOption("-p, --path <path:file>", "description ...")
    .arguments("[path:file]")
    .action((options, ...args) => {
      assert<IsExact<typeof options, { path?: string }>>(true);
      assert<IsExact<typeof args, [string?]>>(true);
    });
}

Deno.test("command - type - file - with option", async () => {
  const { options, args } = await cmd().parse(["--path", "foo/bar/baz"]);

  assert<IsExact<typeof options, { path?: string }>>(true);
  assert<IsExact<typeof args, [string?]>>(true);

  assertEquals(options, { path: "foo/bar/baz" });
  assertEquals(args, []);
});

Deno.test("command - type - file - sub-command with option", async () => {
  const { options, args } = await cmd()
    .command("foo")
    .action((options, ...args) => {
      assert<IsExact<typeof options, { path?: string }>>(true);
      assert<IsExact<typeof args, []>>(true);
    })
    .parse(["foo", "--path", "foo/bar/baz"]);

  assert<IsExact<typeof options, Record<string, unknown>>>(true);
  assert<IsExact<typeof args, Array<unknown>>>(true);

  assertEquals(options, { path: "foo/bar/baz" });
  assertEquals(args, []);
});

Deno.test("command - type - file - with argument", async () => {
  const { options, args } = await cmd().parse(["foo/bar/baz"]);

  assert<IsExact<typeof options, { path?: string }>>(true);
  assert<IsExact<typeof args, [string?]>>(true);

  assertEquals(options, {});
  assertEquals(args, ["foo/bar/baz"]);
});
