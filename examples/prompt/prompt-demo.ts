#!/usr/bin/env -S deno run --unstable

import { rgb24 } from "https://deno.land/std@0.70.0/fmt/colors.ts";
import { prompt } from "../../prompt/prompt.ts";
import { Checkbox } from "../../prompt/checkbox.ts";
import { Input } from "../../prompt/input.ts";
import { List } from "../../prompt/list.ts";
import { Number } from "../../prompt/number.ts";
import { Secret } from "../../prompt/secret.ts";
import { Select } from "../../prompt/select.ts";
import { Toggle } from "../../prompt/toggle.ts";

const colors: Record<string, number> = {
  alloyOrange: 0xC46210,
  darkMagenta: 0x8B008B,
  darkSkyBlue: 0x8CBED6,
  deepSaffron: 0xFF9933,
  amaranthRed: 0xD3212D,
  amber: 0xFFBF00,
  arcticLime: 0xD0FF14,
};

const result = await prompt([{
  name: "text",
  message: "Enter some cool stuff",
  type: Input,
}, {
  name: "color",
  type: Select,
  message: "Choose a color",
  options: [{
    name: "Alloy Orange",
    value: "alloyOrange",
  }, {
    name: "Dark Magenta",
    value: "darkMagenta",
  }, {
    name: "Dark Sky Blue",
    value: "darkSkyBlue",
  }, {
    name: "Deep Saffron",
    value: "deepSaffron",
  }, {
    name: "Amaranth Red",
    value: "amaranthRed",
  }, {
    name: "Amber",
    value: "amber",
  }, {
    name: "Arctic Lime",
    value: "arcticLime",
  }].map((color) => ({
    name: rgb24(color.name, colors[color.value]),
    value: color.value,
  })),
}, {
  name: "animals",
  message: "Select some animal's",
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
}]);

console.log("result:", result);
