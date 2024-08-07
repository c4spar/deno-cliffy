#!/usr/bin/env -S deno run

import { List } from "@cliffy/prompt/list";
import { colors } from "./data/colors.ts";

const colorNames: Array<string> = Object.keys(colors);

const color = await List.prompt({
  message: "Choose a color",
  suggestions: colorNames,
});

console.log({ color });
