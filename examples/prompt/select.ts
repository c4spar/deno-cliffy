#!/usr/bin/env -S deno run --unstable

import { Select } from "../../prompt/select.ts";

const color: string = await Select.prompt({
  message: "Pick a color",
  search: false,
  options: [
    { name: "Red", value: "#ff0000", options: ["hello", "test"] },
    { name: "Green", value: "#00ff00", disabled: true },
    {
      name: "Blue",
      value: "#0000ff",
      options: ["hello", {
        value: "hello2",
        options: [{ value: "hello3", options: ["hello4"] }],
      }],
    },
    Select.separator("--------"),
    { name: "White", value: "#ffffff" },
    { name: "Black", value: "#000000" },
  ],
});

console.log({ color });
