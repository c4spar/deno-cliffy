#!/usr/bin/env -S deno run

import { colors } from "jsr:@cliffy/ansi@1.0.0-rc.8/colors";
colors.setColorEnabled(true);

console.log(
  colors.bold.underline.rgb24("Welcome to Deno.Land!", 0xff3333),
);
