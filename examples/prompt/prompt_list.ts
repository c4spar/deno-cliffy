#!/usr/bin/env -S deno run

import { prompt, PromptOptions } from "../../prompt/prompt.ts";
import { Input } from "../../prompt/input.ts";
import { Number } from "../../prompt/number.ts";
import { Confirm } from "../../prompt/confirm.ts";
import { Checkbox } from "../../prompt/checkbox.ts";

const animalsPrompt: PromptOptions<
  "animals",
  typeof Checkbox,
  { name?: string }
> = {
  name: "animals",
  message: "Select some animals",
  type: Checkbox,
  options: ["dog", "cat", "snake"],
  before({ name }, next) {
    console.log("Name is:", name);
    return next();
  },
};

const result = await prompt([{
  name: "name",
  message: "What's your name?",
  type: Input,
}, {
  name: "age",
  message: "How old are you?",
  type: Number,
}, {
  name: "like",
  message: "Do you like animals?",
  type: Confirm,
}, animalsPrompt]);

console.log(result);
