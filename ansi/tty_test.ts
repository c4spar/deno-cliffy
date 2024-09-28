import { test } from "@cliffy/internal/testing/test";
import { assertEquals } from "@std/assert";
import { tty } from "./tty.ts";

test({
  name: "ansi - tty - chainable tty",
  fn() {
    assertEquals(
      typeof tty.eraseDown === "function",
      true,
    );
  },
});

test({
  name: "ansi - tty - chainable tty custom instance",
  fn() {
    assertEquals(
      typeof tty().text("foo").getCursorPosition === "function",
      true,
    );
  },
});

test({
  name: "ansi - empty ansi chain",
  ignore: ["node", "bun"],
  fn() {
    assertEquals(
      typeof tty({
        // deno-lint-ignore no-explicit-any
        writer: (globalThis as any).Deno.stdout,
        // deno-lint-ignore no-explicit-any
        reader: (globalThis as any).Deno.stdin,
      })() === "function",
      true,
    );
  },
});
