#!/usr/bin/env -S deno run

import { prompt, PromptOptions } from "jsr:@cliffy/command@1.0.0-rc.8";
import { Input } from "jsr:@cliffy/command@1.0.0-rc.8/input";
import { Number } from "jsr:@cliffy/command@1.0.0-rc.8/number";
import { Confirm } from "jsr:@cliffy/command@1.0.0-rc.8/confirm";
import { Checkbox } from "jsr:@cliffy/command@1.0.0-rc.8/checkbox";

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
