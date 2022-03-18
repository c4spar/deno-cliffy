import { assertEquals, assertRejects } from "../../../dev_deps.ts";
import { Command } from "../../command.ts";

function command() {
  return new Command()
    .throwErrors()
    .allowEmpty()
    .option("--no-check", "No check.")
    .option("--color [color:string]", "Color name.", { default: "yellow" })
    .option("--no-color", "No color.")
    .option("--remote <url:string>", "Remote url.", { depends: ["color"] })
    .option("--no-remote", "No remote.");
}

Deno.test("negatable options with no arguments", async () => {
  const { options, args, literal } = await command().parse([]);

  assertEquals(options, {
    check: true,
    color: "yellow",
  });
  assertEquals(args, []);
  assertEquals(literal, []);
});

Deno.test("negatable options with arguments", async () => {
  const { options, args, literal } = await command().parse(
    ["--color", "blue", "--remote", "foo"],
  );

  assertEquals(options, {
    check: true,
    color: "blue",
    remote: "foo",
  });
  assertEquals(args, []);
  assertEquals(literal, []);
});

Deno.test("negatable flag --no-remote should not depend on --color", async () => {
  const { options, args, literal } = await command().parse(["--no-remote"]);

  assertEquals(options, {
    check: true,
    color: "yellow",
    remote: false,
  });
  assertEquals(args, []);
  assertEquals(literal, []);
});

Deno.test("negatable flags should negate value", async () => {
  const { options, args, literal } = await command().parse(
    ["--no-check", "--no-color", "--no-remote"],
  );

  assertEquals(options, {
    color: false,
    check: false,
    remote: false,
  });
  assertEquals(args, []);
  assertEquals(literal, []);
});

Deno.test("negatable options should not be combinable with positive options", async () => {
  await assertRejects(
    async () => {
      await command().parse(["--color", "--no-color", "--no-check"]);
    },
    Error,
    `Option "--color" can only occur once, but was found several times.`,
  );
});
