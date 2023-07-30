#!/usr/bin/env -S deno run

import * as stdColors from "https://deno.land/std@0.196.0/fmt/colors.ts";
import * as ansiEscapes from "../../ansi/ansi_escapes.ts";

const ansiEscapeNames1: Array<keyof typeof ansiEscapes> = [
  "bel",
  "clearScreen",
  "clearTerminal",
  "cursorBackward",
  "cursorDown",
  "cursorForward",
  "cursorHide",
];

const ansiEscapeNames2: Array<keyof typeof ansiEscapes> = [
  "cursorLeft",
  "cursorMove",
  "cursorNextLine",
  "cursorPosition",
  "cursorPrevLine",
  "cursorRestore",
];

const ansiEscapeNames3: Array<keyof typeof ansiEscapes> = [
  "cursorSave",
  "cursorShow",
  "cursorTo",
  "cursorUp",
  "eraseDown",
  "eraseLine",
  "eraseLineEnd",
];

const ansiEscapeNames4: Array<keyof typeof ansiEscapes> = [
  "eraseLineStart",
  "eraseLines",
  "eraseScreen",
  "eraseUp",
  "image",
  "link",
  "scrollDown",
  "scrollUp",
];

const colorNames1: Array<keyof typeof stdColors> = [
  "yellow",
  "white",
  "underline",
  "stripColor",
  "strikethrough",
  "reset",
  "red",
  "magenta",
  "italic",
];

const colorNames2: Array<keyof typeof stdColors> = [
  "green",
  "gray",
  "dim",
  "cyan",
  "bold",
  "blue",
  "black",
  "bgYellow",
  "bgWhite",
  "bgRed",
  "bgMagenta",
];

const colorNames3: Array<keyof typeof stdColors> = [
  "bgGreen",
  "bgCyan",
  "bgBlue",
  "bgBlack",
];

for (const colorNames of [colorNames1, colorNames2, colorNames3]) {
  console.log(
    colorNames
      .map((name) => (stdColors[name] as (str: string) => string)(name))
      .join(" "),
  );
}

console.log();

for (
  const ansiEscapeNames of [
    ansiEscapeNames1,
    ansiEscapeNames2,
    ansiEscapeNames3,
    ansiEscapeNames4,
  ]
) {
  console.log(
    ansiEscapeNames
      .map((name) => stdColors.rgb8(name, Math.random() * 100))
      .join(" "),
  );
}
