#!/usr/bin/env -S deno run

import { colors } from "jsr:@cliffy/ansi@1.0.0-rc.8/colors";

// Define theme colors.
const error = colors.bold.red;
const warn = colors.bold.yellow;
const info = colors.bold.blue;

// Use theme colors.
console.log(error("[ERROR]"), "Some error!");
console.log(warn("[WARN]"), "Some warning!");
console.log(info("[INFO]"), "Some information!");

// Override theme colors.
console.log(error.underline("[ERROR]"), "Some error!");
console.log(warn.underline("[WARN]"), "Some warning!");
console.log(info.underline("[INFO]"), "Some information!");
