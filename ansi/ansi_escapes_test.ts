import { test } from "@cliffy/internal/testing/test";
import {
  cursorBackward,
  cursorDown,
  cursorForward,
  cursorMove,
  cursorNextLine,
  cursorPrevLine,
  cursorTo,
  cursorUp,
  eraseLines,
  eraseUp,
  image,
  link,
  scrollDown,
  scrollUp,
} from "./ansi_escapes.ts";
import { assertEquals } from "@std/assert";

test({
  name: "ansi - ansi escapes - cursorTo x",
  fn() {
    assertEquals(
      cursorTo(3),
      "\x1b[3G",
    );
  },
});

test({
  name: "ansi - ansi escapes - cursorTo x y",
  fn() {
    assertEquals(
      cursorTo(3, 2),
      "\x1b[2;3H",
    );
  },
});

test({
  name: "ansi - ansi escapes - cursorMove right down",
  fn() {
    assertEquals(
      cursorMove(3, 2),
      "\x1b[3C\x1b[2B",
    );
  },
});

test({
  name: "ansi - ansi escapes - cursorMove left up",
  fn() {
    assertEquals(
      cursorMove(-3, -2),
      "\x1b[3D\x1b[2A",
    );
  },
});

test({
  name: "ansi - ansi escapes - cursorUp",
  fn() {
    assertEquals(
      cursorUp(5),
      "\x1b[5A",
    );
  },
});

test({
  name: "ansi - ansi escapes - cursorDown",
  fn() {
    assertEquals(
      cursorDown(5),
      "\x1b[5B",
    );
  },
});

test({
  name: "ansi - ansi escapes - cursorForward",
  fn() {
    assertEquals(
      cursorForward(5),
      "\x1b[5C",
    );
  },
});

test({
  name: "ansi - ansi escapes - cursorBackward",
  fn() {
    assertEquals(
      cursorBackward(5),
      "\x1b[5D",
    );
  },
});

test({
  name: "ansi - ansi escapes - cursorNextLine",
  fn() {
    assertEquals(
      cursorNextLine(2),
      "\x1b[E\x1b[E",
    );
  },
});

test({
  name: "ansi - ansi escapes - cursorPrevLine",
  fn() {
    assertEquals(
      cursorPrevLine(2),
      "\x1b[F\x1b[F",
    );
  },
});

test({
  name: "ansi - ansi escapes - scrollUp",
  fn() {
    assertEquals(
      scrollUp(2),
      "\x1b[S\x1b[S",
    );
  },
});

test({
  name: "ansi - ansi escapes - scrollDown",
  fn() {
    assertEquals(
      scrollDown(2),
      "\x1b[T\x1b[T",
    );
  },
});

test({
  name: "ansi - ansi escapes - eraseUp",
  fn() {
    assertEquals(
      eraseUp(2),
      "\x1b[1J\x1b[1J",
    );
  },
});

test({
  name: "ansi - ansi escapes - eraseUp",
  fn() {
    assertEquals(
      eraseLines(2),
      "\x1b[2K\x1b[1A\x1b[2K\x1b[G",
    );
  },
});

test({
  name: "ansi - ansi escapes - link",
  fn() {
    assertEquals(
      link("foo bar", "https://github.com/"),
      "\x1b]8;;https://github.com/\x07foo bar\x1b]8;;\x07",
    );
  },
});

test({
  name: "ansi - ansi escapes - image",
  fn() {
    assertEquals(
      image("foo", {
        height: 200,
        width: 200,
        preserveAspectRatio: false,
      }),
      "\x1b]1337;File=inline=1;width=200;height=200;preserveAspectRatio=0:Zm9v\x07",
    );
  },
});

test({
  name: "ansi - ansi escapes - image preserveAspectRatio",
  fn() {
    assertEquals(
      image("foo", {
        height: 200,
        width: 200,
        preserveAspectRatio: true,
      }),
      "\x1b]1337;File=inline=1;width=200;height=200:Zm9v\x07",
    );
  },
});
