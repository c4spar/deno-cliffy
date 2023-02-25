#!/usr/bin/env -S deno run --allow-net=deno.land

import { colors } from "../../ansi/colors.ts";
import { tty } from "../../ansi/tty.ts";

for await (const i of [3, 2, 1]) {
  console.log(i);
  await new Promise((resolve) => setTimeout(resolve, 1000));
  tty.cursorLeft.cursorUp.eraseLine();
}

console.log(colors.green("Done!"));
