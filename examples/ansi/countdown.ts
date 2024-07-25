#!/usr/bin/env -S deno run --allow-net=deno.land

import { colors } from "@cliffy/ansi/colors";
import { tty } from "@cliffy/ansi/tty";

for await (const i of [3, 2, 1]) {
  console.log(i);
  await new Promise((resolve) => setTimeout(resolve, 1000));
  tty.cursorLeft.cursorUp.eraseLine();
}

console.log(colors.green("Done!"));
