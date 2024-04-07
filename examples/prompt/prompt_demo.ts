#!/usr/bin/env -S deno run

import { rgb24 } from "https://deno.land/std@0.221.0/fmt/colors.ts";
import { tty } from "../../ansi/tty.ts";
import { prompt } from "../../prompt/prompt.ts";
import { Checkbox } from "../../prompt/checkbox.ts";
import { Input } from "../../prompt/input.ts";
import { List } from "../../prompt/list.ts";
import { Number } from "../../prompt/number.ts";
import { Secret } from "../../prompt/secret.ts";
import { Select } from "../../prompt/select.ts";
import { Toggle } from "../../prompt/toggle.ts";
import { colors } from "./data/colors.ts";
import { firstNames } from "./data/first_names.ts";

const result = await prompt([{
  name: "text",
  message: "Enter some cool stuff",
  type: Input,
}, {
  message: "Whats your name?",
  name: "text",
  type: Input,
  suggestions: firstNames,
}, {
  name: "color",
  message: "Choose a color",
  type: Select,
  search: true,
  options: Object.entries<number>(colors).map(([name, value]) => ({
    name: rgb24(name, value),
    value: name,
  })),
}, {
  name: "animals",
  message: "Select some animals",
  type: Checkbox,
  options: [{
    name: "🦕 Dino",
    value: "dino",
  }, {
    name: "🐵 Monkey",
    value: "monkey",
  }, {
    name: "🐶 Dog",
    value: "dog",
  }, {
    name: "🦊 Fox",
    value: "fox",
  }, {
    name: "🐱 Cat",
    value: "cat",
  }, {
    name: "🦁 Lion",
    value: "lion",
  }, {
    name: "🐴 Horse",
    value: "horse",
  }, {
    name: "🐻 Bear",
    value: "bear",
  }, {
    name: "🐨 Koala",
    value: "koala",
  }],
}, {
  name: "password",
  message: "Enter some super secret information",
  type: Secret,
}, {
  name: "number",
  message: "Enter a number",
  hint: "Use up/down to increase/decrease the value",
  type: Number,
}, {
  name: "toggle",
  message: "Confirm something",
  hint: "Use left/right to toggle the value",
  type: Toggle,
}, {
  name: "tags",
  message: "Enter some comma separated words",
  type: List,
  suggestions: ["deno", "typescript", "cliffy"],
}]);

console.log("result:", result);

tty.cursorHide();
await new Promise((resolve) => setTimeout(resolve, 1000));
tty.cursorTo(0, 0);
