// deno-fmt-ignore-file

import { assertEquals, assertThrowsAsync } from "../../../dev_deps.ts";
import { Command } from "../../command.ts";
import type { IEnvVar } from "../../types.ts";

function command() {
  return new Command<void>()
    .throwErrors()
    .globalEnv<{ global?: boolean }>("global=<value:boolean>", "...")
    .globalEnv<{ globalHidden?: boolean }>(
      "global_hidden=<value:string>",
      "...",
      { hidden: true },
    )
    .globalEnv<{ globalRequired: boolean }>(
      "global_required=<value:number>",
      "...",
      { required: true },
    )
    .env<{ foo?: boolean }>("foo=<value:boolean>", "...")
    .env<{ fooHidden?: boolean }>("foo_hidden=<value:string>", "...", {
      hidden: true,
    })
    .env<{ fooRequired: boolean }>("foo_required=<value:number>", "...", {
      required: true,
    })
    .command(
      "bar",
      new Command()
        .env("bar", "...")
        .env("bar_hidden", "...", { hidden: true })
        .command("baz")
        .env("baz", "...")
        .env("baz_hidden", "...", { hidden: true }),
    );
}

function setupEnv() {
  Deno.env.set("global", "true");
  Deno.env.set("global_hidden", "foo");
  Deno.env.set("global_required", "1");
  Deno.env.set("foo", "true");
  Deno.env.set("foo_hidden", "foo");
  Deno.env.set("foo_required", "1");
}

function clearEnv() {
  Deno.env.delete("global");
  Deno.env.delete("global_hidden");
  Deno.env.delete("global_required");
  Deno.env.delete("foo");
  Deno.env.delete("foo_hidden");
  Deno.env.delete("foo_required");
}

Deno.test("command - env var - missing required env var", async () => {
  await assertThrowsAsync(
    async () => {
      await new Command()
        .throwErrors()
        .env("foo", "...", { required: true })
        .parse([]);
    },
    Error,
    `Missing required environment variable "foo".`,
  );
});

Deno.test("command - env var - expect valid values", async () => {
  setupEnv();
  let called = 0;
  await command()
    .reset()
    .action((options) => {
      called++;
      assertEquals(options, {
        global: true,
        globalHidden: "foo",
        globalRequired: 1,
        foo: true,
        fooHidden: "foo",
        fooRequired: 1,
      });
    })
    .parse([]);
  assertEquals(called, 1);
  clearEnv();
});

Deno.test("command - env var - expect option to throw if value is not a boolean", async () => {
  setupEnv();
  Deno.env.set("global", "foo");
  await assertThrowsAsync(
    async () => {
      await command().parse([]);
    },
    Error,
    `Environment variable "global" must be of type "boolean", but got "foo".`,
  );
  clearEnv();
});

Deno.test("command - env var - expect option to throw if value is not a number", async () => {
  setupEnv();
  Deno.env.set("global_required", "foo");
  await assertThrowsAsync(
    async () => {
      await command().parse([]);
    },
    Error,
    `Environment variable "global_required" must be of type "number", but got "foo".`,
  );
  clearEnv();
});

Deno.test("command - env var - expect global option to throw if value is not a boolean", async () => {
  setupEnv();
  Deno.env.set("global", "foo");
  await assertThrowsAsync(
    async () => {
      await command().parse(["bar"]);
    },
    Error,
    `Environment variable "global" must be of type "boolean", but got "foo".`,
  );
  clearEnv();
});

Deno.test("command - env var - expect global option to throw if value is not a number", async () => {
  setupEnv();
  Deno.env.set("global_required", "foo");
  await assertThrowsAsync(
    async () => {
      await command().parse(["bar"]);
    },
    Error,
    `Environment variable "global_required" must be of type "number", but got "foo".`,
  );
  clearEnv();
});

Deno.test("command - env var - env var properties", () => {
  const cmd: Command = new Command()
    .throwErrors()
    .globalEnv("global, global2", "global ...")
    .env("foo, foo2 <bar:string>", "foo ...", {
      hidden: true,
    });

  const globalEnvVar: IEnvVar = cmd.getEnvVar("global") as IEnvVar;
  const fooEnvVar: IEnvVar = cmd.getEnvVar("foo", true) as IEnvVar;

  assertEquals(globalEnvVar.name, "global");
  assertEquals(globalEnvVar.names, ["global", "global2"]);
  assertEquals(globalEnvVar.description, "global ...");
  assertEquals(globalEnvVar.global, true);
  assertEquals(globalEnvVar.type, "boolean");
  assertEquals(globalEnvVar.hidden, undefined);

  assertEquals(fooEnvVar.name, "foo");
  assertEquals(fooEnvVar.names, ["foo", "foo2"]);
  assertEquals(fooEnvVar.description, "foo ...");
  assertEquals(fooEnvVar.global, undefined);
  assertEquals(fooEnvVar.type, "string");
  assertEquals(fooEnvVar.hidden, true);
});

Deno.test("command - env var - has env vars", () => {
  const cmd: Command = command();
  assertEquals(cmd.hasEnvVars(), true);
  assertEquals(cmd.hasEnvVars(true), true);
  assertEquals(new Command().hasEnvVars(), false);
  assertEquals(new Command().hasEnvVars(true), false);
});

Deno.test("command - env var - get env vars", () => {
  const cmd: Command = command();
  assertEquals(cmd.getEnvVars().length, 4);
  assertEquals(cmd.getEnvVars(true).length, 6);
  assertEquals(!!cmd.getEnvVars().find((opt) => opt.name === "global"), true);
  assertEquals(!!cmd.getEnvVars(true).find((opt) => opt.name === "global"), true);
  assertEquals(!!cmd.getEnvVars().find((opt) => opt.name === "global_hidden"), false);
  assertEquals(!!cmd.getEnvVars(true).find((opt) => opt.name === "global_hidden"), true);
  assertEquals(!!cmd.getEnvVars().find((opt) => opt.name === "foo"), true);
  assertEquals(!!cmd.getEnvVars(true).find((opt) => opt.name === "foo"), true);
  assertEquals(!!cmd.getEnvVars().find((opt) => opt.name === "foo_hidden"), false);
  assertEquals(!!cmd.getEnvVars(true).find((opt) => opt.name === "foo_hidden"), true);
});

Deno.test("command - env var - get base env vars", () => {
  const cmd: Command = command();
  assertEquals(cmd.getBaseEnvVars().length, 4);
  assertEquals(cmd.getBaseEnvVars(true).length, 6);
  assertEquals(!!cmd.getBaseEnvVars().find((opt) => opt.name === "global"), true);
  assertEquals(!!cmd.getBaseEnvVars(true).find((opt) => opt.name === "global"), true);
  assertEquals(!!cmd.getBaseEnvVars().find((opt) => opt.name === "global_hidden"), false);
  assertEquals(!!cmd.getBaseEnvVars(true).find((opt) => opt.name === "global_hidden"), true);
  assertEquals(!!cmd.getBaseEnvVars().find((opt) => opt.name === "foo"), true);
  assertEquals(!!cmd.getBaseEnvVars(true).find((opt) => opt.name === "foo"), true);
  assertEquals(!!cmd.getBaseEnvVars().find((opt) => opt.name === "foo_hidden"), false);
  assertEquals(!!cmd.getBaseEnvVars(true).find((opt) => opt.name === "foo_hidden"), true);
});

Deno.test("command - env var - get global env vars", () => {
  const cmd: Command = command();
  assertEquals(cmd.getCommand("bar")?.getGlobalEnvVars().length, 2);
  assertEquals(cmd.getCommand("bar")?.getGlobalEnvVars(true).length, 3);
  assertEquals(!!cmd.getCommand("bar")?.getGlobalEnvVars().find((opt) => opt.name === "global"), true);
  assertEquals(!!cmd.getCommand("bar")?.getGlobalEnvVars(true).find((opt) => opt.name === "global"), true);
  assertEquals(!!cmd.getCommand("bar")?.getGlobalEnvVars().find((opt) => opt.name === "global_hidden"), false);
  assertEquals(!!cmd.getCommand("bar")?.getGlobalEnvVars(true).find((opt) => opt.name === "global_hidden"), true);
  assertEquals(!!cmd.getCommand("bar")?.getGlobalEnvVars().find((opt) => opt.name === "foo"), false);
  assertEquals(!!cmd.getCommand("bar")?.getGlobalEnvVars(true).find((opt) => opt.name === "foo"), false);
  assertEquals(!!cmd.getCommand("bar")?.getGlobalEnvVars().find((opt) => opt.name === "foo_hidden"), false);
  assertEquals(!!cmd.getCommand("bar")?.getGlobalEnvVars(true).find((opt) => opt.name === "foo_hidden"), false);
});

Deno.test("command - env var - has env var", () => {
  const cmd: Command = command();
  assertEquals(cmd.hasEnvVar("global"), true);
  assertEquals(cmd.hasEnvVar("global_hidden"), false);
  assertEquals(cmd.hasEnvVar("global_hidden", true), true);
  assertEquals(cmd.hasEnvVar("foo"), true);
  assertEquals(cmd.hasEnvVar("foo_hidden"), false);
  assertEquals(cmd.hasEnvVar("foo_hidden", true), true);
  assertEquals(cmd.hasEnvVar("unknown"), false);
  assertEquals(cmd.getCommand("bar")?.hasEnvVar("global"), true);
  assertEquals(cmd.getCommand("bar")?.hasEnvVar("global_hidden"), false);
  assertEquals(cmd.getCommand("bar")?.hasEnvVar("global_hidden", true), true);
  assertEquals(cmd.getCommand("bar")?.hasEnvVar("bar"), true);
  assertEquals(cmd.getCommand("bar")?.hasEnvVar("bar_hidden"), false);
  assertEquals(cmd.getCommand("bar")?.hasEnvVar("bar_hidden", true), true);
  assertEquals(cmd.getCommand("bar")?.hasEnvVar("unknown"), false);
  assertEquals(cmd.getCommand("bar")?.getCommand("baz")?.hasEnvVar("global"), true);
  assertEquals(cmd.getCommand("bar")?.getCommand("baz")?.hasEnvVar("global_hidden"), false);
  assertEquals(cmd.getCommand("bar")?.getCommand("baz")?.hasEnvVar("global_hidden", true), true);
  assertEquals(cmd.getCommand("bar")?.getCommand("baz")?.hasEnvVar("baz"), true);
  assertEquals(cmd.getCommand("bar")?.getCommand("baz")?.hasEnvVar("baz_hidden"), false);
  assertEquals(cmd.getCommand("bar")?.getCommand("baz")?.hasEnvVar("baz_hidden", true), true);
  assertEquals(cmd.getCommand("bar")?.getCommand("baz")?.hasEnvVar("unknown"), false);
});

Deno.test("command - env var - get env var", () => {
  const cmd: Command = command();
  assertEquals(cmd.getEnvVar("global")?.name, "global");
  assertEquals(cmd.getEnvVar("global_hidden")?.name, undefined);
  assertEquals(cmd.getEnvVar("global_hidden", true)?.name, "global_hidden");
  assertEquals(cmd.getEnvVar("foo")?.name, "foo");
  assertEquals(cmd.getEnvVar("foo_hidden")?.name, undefined);
  assertEquals(cmd.getEnvVar("foo_hidden", true)?.name, "foo_hidden");
  assertEquals(cmd.getEnvVar("unknown")?.name, undefined);
  assertEquals(cmd.getCommand("bar")?.getEnvVar("global")?.name, "global");
  assertEquals(cmd.getCommand("bar")?.getEnvVar("global_hidden")?.name, undefined);
  assertEquals(cmd.getCommand("bar")?.getEnvVar("global_hidden", true)?.name, "global_hidden");
  assertEquals(cmd.getCommand("bar")?.getEnvVar("bar")?.name, "bar");
  assertEquals(cmd.getCommand("bar")?.getEnvVar("bar_hidden")?.name, undefined);
  assertEquals(cmd.getCommand("bar")?.getEnvVar("bar_hidden", true)?.name, "bar_hidden");
  assertEquals(cmd.getCommand("bar")?.getEnvVar("unknown")?.name, undefined);
  assertEquals(cmd.getCommand("bar")?.getCommand("baz")?.getEnvVar("global")?.name, "global");
  assertEquals(cmd.getCommand("bar")?.getCommand("baz")?.getEnvVar("global_hidden")?.name, undefined);
  assertEquals(cmd.getCommand("bar")?.getCommand("baz")?.getEnvVar("global_hidden", true)?.name, "global_hidden");
  assertEquals(cmd.getCommand("bar")?.getCommand("baz")?.getEnvVar("baz")?.name, "baz");
  assertEquals(cmd.getCommand("bar")?.getCommand("baz")?.getEnvVar("baz_hidden")?.name, undefined);
  assertEquals(cmd.getCommand("bar")?.getCommand("baz")?.getEnvVar("baz_hidden", true)?.name, "baz_hidden");
  assertEquals(cmd.getCommand("bar")?.getCommand("baz")?.getEnvVar("unknown")?.name, undefined);
});

Deno.test("command - env var - get base env var", () => {
  const cmd: Command = command();
  assertEquals(cmd.getBaseEnvVar("global")?.name, "global");
  assertEquals(cmd.getBaseEnvVar("global_hidden")?.name, undefined);
  assertEquals(cmd.getBaseEnvVar("global_hidden", true)?.name, "global_hidden");
  assertEquals(cmd.getBaseEnvVar("foo")?.name, "foo");
  assertEquals(cmd.getBaseEnvVar("foo_hidden")?.name, undefined);
  assertEquals(cmd.getBaseEnvVar("foo_hidden", true)?.name, "foo_hidden");
  assertEquals(cmd.getBaseEnvVar("unknown")?.name, undefined);
  assertEquals(cmd.getCommand("bar")?.getBaseEnvVar("global")?.name, undefined);
  assertEquals(cmd.getCommand("bar")?.getBaseEnvVar("global_hidden")?.name, undefined);
  assertEquals(cmd.getCommand("bar")?.getBaseEnvVar("global_hidden", true)?.name, undefined);
  assertEquals(cmd.getCommand("bar")?.getBaseEnvVar("bar")?.name, "bar");
  assertEquals(cmd.getCommand("bar")?.getBaseEnvVar("bar_hidden")?.name, undefined);
  assertEquals(cmd.getCommand("bar")?.getBaseEnvVar("bar_hidden", true)?.name, "bar_hidden");
  assertEquals(cmd.getCommand("bar")?.getBaseEnvVar("unknown")?.name, undefined);
  assertEquals(cmd.getCommand("bar")?.getCommand("baz")?.getBaseEnvVar("global")?.name, undefined);
  assertEquals(cmd.getCommand("bar")?.getCommand("baz")?.getBaseEnvVar("global_hidden")?.name, undefined);
  assertEquals(cmd.getCommand("bar")?.getCommand("baz")?.getBaseEnvVar("global_hidden", true)?.name, undefined);
  assertEquals(cmd.getCommand("bar")?.getCommand("baz")?.getBaseEnvVar("baz")?.name, "baz");
  assertEquals(cmd.getCommand("bar")?.getCommand("baz")?.getBaseEnvVar("baz_hidden")?.name, undefined);
  assertEquals(cmd.getCommand("bar")?.getCommand("baz")?.getBaseEnvVar("baz_hidden", true)?.name, "baz_hidden");
  assertEquals(cmd.getCommand("bar")?.getCommand("baz")?.getBaseEnvVar("unknown")?.name, undefined);
});

Deno.test("command - env var - get global env var", () => {
  const cmd: Command = command();
  assertEquals(cmd.getGlobalEnvVar("global")?.name, undefined);
  assertEquals(cmd.getGlobalEnvVar("global_hidden")?.name, undefined);
  assertEquals(cmd.getGlobalEnvVar("global_hidden", true)?.name, undefined);
  assertEquals(cmd.getGlobalEnvVar("foo")?.name, undefined);
  assertEquals(cmd.getGlobalEnvVar("foo_hidden")?.name, undefined);
  assertEquals(cmd.getGlobalEnvVar("foo_hidden", true)?.name, undefined);
  assertEquals(cmd.getGlobalEnvVar("unknown")?.name, undefined);
  assertEquals(cmd.getCommand("bar")?.getGlobalEnvVar("global")?.name, "global");
  assertEquals(cmd.getCommand("bar")?.getGlobalEnvVar("global_hidden")?.name, undefined);
  assertEquals(cmd.getCommand("bar")?.getGlobalEnvVar("global_hidden", true)?.name, "global_hidden");
  assertEquals(cmd.getCommand("bar")?.getGlobalEnvVar("bar")?.name, undefined);
  assertEquals(cmd.getCommand("bar")?.getGlobalEnvVar("bar_hidden")?.name, undefined);
  assertEquals(cmd.getCommand("bar")?.getGlobalEnvVar("bar_hidden", true)?.name, undefined);
  assertEquals(cmd.getCommand("bar")?.getGlobalEnvVar("unknown")?.name, undefined);
  assertEquals(cmd.getCommand("bar")?.getCommand("baz")?.getGlobalEnvVar("global")?.name, "global");
  assertEquals(cmd.getCommand("bar")?.getCommand("baz")?.getGlobalEnvVar("global_hidden")?.name, undefined);
  assertEquals(cmd.getCommand("bar")?.getCommand("baz")?.getGlobalEnvVar("global_hidden", true)?.name, "global_hidden");
  assertEquals(cmd.getCommand("bar")?.getCommand("baz")?.getGlobalEnvVar("baz")?.name, undefined);
  assertEquals(cmd.getCommand("bar")?.getCommand("baz")?.getGlobalEnvVar("baz_hidden")?.name, undefined);
  assertEquals(cmd.getCommand("bar")?.getCommand("baz")?.getGlobalEnvVar("baz_hidden", true)?.name, undefined);
  assertEquals(cmd.getCommand("bar")?.getCommand("baz")?.getGlobalEnvVar("unknown")?.name, undefined);
});
