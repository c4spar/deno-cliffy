#!/usr/bin/env -S deno run --allow-net=deno.land

import { rgb24 } from "https://deno.land/std@0.196.0/fmt/colors.ts";
import { tty } from "../../ansi/tty.ts";

const response = await fetch("https://deno.land/images/hashrock_simple.png");
const imageBuffer: ArrayBuffer = await response.arrayBuffer();

Deno.addSignalListener("SIGINT", () => {
  console.log("interrupted!");
  tty.cursorShow();
  Deno.exit();
});

tty.clearScreen
  .cursorHide
  .cursorTo(0, 0)
  .eraseDown
  .image(imageBuffer, {
    width: 29,
    preserveAspectRatio: true,
  })
  .cursorNextLine();

setInterval(
  () =>
    tty
      .cursorLeft
      .eraseLine
      .text("          ")
      .link(style("Deno Land"), "https://deno.land"),
  150,
);

let i = 0;
const colors: Array<number> = [
  0xff3366,
  0xff6633,
  0xFFCC33,
  0x33FF66,
  0x33FFCC,
  0x33CCFF,
  0x3366FF,
  0x6633FF,
  0xCC33FF,
  0xefefef,
];
const style = (val: string) =>
  rgb24(val, colors[i > colors.length - 1 ? (i = 0) : i++]);
