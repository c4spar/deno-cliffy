import { assertEquals, bold, red } from "../dev_deps.ts";
import { underline } from "../prompt/deps.ts";
import { ansi } from "./ansi.ts";
import { colors } from "./colors.ts";

Deno.test({
  name: "test colors",
  fn() {
    assertEquals(
      ansi.cursorTo(3, 2).eraseDown.cursorHide(),
      "\x1B[2;3H\x1B[0J\x1B[?25l",
    );
  },
});
