#!/usr/bin/env -S deno run

import { Input } from "jsr:@cliffy/command@1.0.0-rc.8/input";
import { colors } from "./data/colors.ts";

const colorNames: Array<number> = Object.values(colors);

const color: string = await Input.prompt({
  message: "Choose a color",
  suggestions: colorNames,
});

console.log({ color });
