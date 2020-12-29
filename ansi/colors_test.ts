import { assertEquals, bold, red } from "../dev_deps.ts";
import { underline } from "../prompt/deps.ts";
import { colors } from "./colors.ts";

Deno.test({
  name: "test colors",
  fn() {
    assertEquals(
      colors.red.underline.bold("test"),
      bold(underline(red("test"))),
    );
  },
});

Deno.test({
  name: "test color theme",
  fn() {
    const theme = colors.red.underline();
    assertEquals(
      theme.bold("test"),
      bold(underline(red("test"))),
    );
    assertEquals(
      theme("test"),
      underline(red("test")),
    );
  },
});
