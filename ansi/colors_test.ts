import { assertEquals, bold, red } from "../dev_deps.ts";
import { underline } from "../prompt/deps.ts";
import { colors } from "./colors.ts";

Deno.test({
  name: "ansi - colors - chainable colors",
  fn() {
    assertEquals(
      colors.red.underline.bold("test"),
      bold(underline(red("test"))),
    );
  },
});

Deno.test({
  name: "ansi - colors - chainable colors theme",
  fn() {
    const theme = colors.red.underline;
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

Deno.test({
  name: "ansi - colors - chainable colors custom instance",
  fn() {
    const myColors = colors();
    const theme = myColors.red.underline;
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

Deno.test({
  name: "ansi - colors - empty string argument",
  fn() {
    assertEquals(
      colors.red.underline.bold(""),
      bold(underline(red(""))),
    );
  },
});
