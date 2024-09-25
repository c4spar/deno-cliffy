import { test } from "@cliffy/internal/testing/test";
import { assertEquals } from "@std/assert";
import { bold, red, underline } from "@std/fmt/colors";
import { colors } from "./colors.ts";

test({
  name: "ansi - colors - chainable colors",
  fn() {
    assertEquals(
      colors.red.underline.bold("test"),
      bold(underline(red("test"))),
    );
  },
});

test({
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

test({
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

test({
  name: "ansi - colors - empty string argument",
  fn() {
    assertEquals(
      colors.red.underline.bold(""),
      bold(underline(red(""))),
    );
  },
});
