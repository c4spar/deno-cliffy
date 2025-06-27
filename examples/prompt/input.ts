#!/usr/bin/env -S deno run

import { Input } from "@cliffy/prompt/input";

const name: string = await Input.prompt("What's your github user name?");

console.log({ name });

const defaultValue: string = await Input.prompt({
  message: "Just press Enter to see the default value",
  default: new Date().toLocaleDateString(),
});

console.log({ defaultValue });
