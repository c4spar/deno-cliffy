import { assertEquals } from "../dev_deps.ts";
import { tty } from "./tty.ts";

Deno.test({
  name: "ansi - tty - chainable tty",
  fn() {
    assertEquals(
      typeof tty.getCursorPosition === "function",
      true,
    );
  },
});

Deno.test({
  name: "ansi - tty - chainable tty custom instance",
  fn() {
    assertEquals(
      typeof tty().text("foo").getCursorPosition === "function",
      true,
    );
  },
});

Deno.test({
  name: "ansi - empty ansi chain",
  fn() {
    assertEquals(
      typeof tty({
        stdout: Deno.stdout,
        stdin: Deno.stdin,
      })() === "function",
      true,
    );
  },
});
