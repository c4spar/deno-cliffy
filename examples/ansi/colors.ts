#!/usr/bin/env -S deno run

import { colors } from "../../ansi/colors.ts";

console.log(
  colors.bold.underline.rgb24("Welcome to Deno.Land!", 0xff3333),
);
