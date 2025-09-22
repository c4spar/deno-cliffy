#!/usr/bin/env -S deno run

import { colors } from "jsr:@cliffy/ansi@1.0.0-rc.8/colors";
import { tty } from "jsr:@cliffy/ansi@1.0.0-rc.8/tty";
import { delay } from "jsr:@std/async@^1.0.14/delay";

const error = colors.bold.red;
const warn = colors.bold.yellow;
const info = colors.bold.blue;

console.log(info("This is an info message!"));
console.log(warn("This is a warning!"));
console.log(error("This is an error message!"));
console.log(error.underline("This is a critical error message!"));

await delay(3000);

tty.cursorLeft.cursorUp(4).eraseDown();
