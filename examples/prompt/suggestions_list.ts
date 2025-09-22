#!/usr/bin/env -S deno run

import { Input } from "jsr:@cliffy/prompt@1.0.0-rc.8/input";
import { colors } from "./data/colors.ts";

const colorNames: Array<string> = Object.keys(colors);

const color = await Input.prompt({
  message: "Choose a color",
  suggestions: colorNames,
  list: true,
  info: true,
});

console.log({ color });
