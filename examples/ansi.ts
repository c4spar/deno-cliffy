#!/usr/bin/env -S deno run

import { delay } from "@std/async/delay";
import { colors } from "../ansi/colors.ts";
import { tty } from "../ansi/tty.ts";

const error = colors.bold.red;
const warn = colors.bold.yellow;
const info = colors.bold.blue;

console.log(info("This is an info message!"));
console.log(warn("This is a warning!"));
console.log(error("This is an error message!"));
console.log(error.underline("This is a critical error message!"));

await delay(3000);

tty.cursorLeft.cursorUp(4).eraseDown();
