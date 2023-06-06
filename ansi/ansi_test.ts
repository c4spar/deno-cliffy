import { assertEquals } from "../dev_deps.ts";
import { ansi } from "./ansi.ts";

Deno.test({
  name: "ansi - chainable ansi escapes",
  fn() {
    assertEquals(
      ansi.cursorTo(3, 2).eraseDown.cursorHide(),
      "\x1B[2;3H\x1B[0J\x1B[?25l",
    );
  },
});

Deno.test({
  name: "ansi - toArray",
  fn() {
    assertEquals(
      ansi.cursorTo(3, 2).eraseDown.cursorHide.toArray(),
      ["\x1B[2;3H", "\x1B[0J", "\x1B[?25l"],
    );
  },
});

Deno.test({
  name: "ansi - chainable ansi escape custom instance",
  fn() {
    const myAnsi = ansi();
    assertEquals(
      new TextDecoder().decode(
        myAnsi
          .cursorTo(3, 2)
          .text("FOO")
          .eraseDown
          .cursorHide
          .bytes(),
      ),
      "\x1B[2;3HFOO\x1B[0J\x1B[?25l",
    );
  },
});

Deno.test({
  name: "ansi - empty ansi chain",
  fn() {
    assertEquals(ansi().toString(), "");
  },
});
