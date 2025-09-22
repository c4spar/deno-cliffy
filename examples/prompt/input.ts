#!/usr/bin/env -S deno run

import { Input } from "jsr:@cliffy/prompt@1.0.0-rc.8/input";

const name: string = await Input.prompt("What's your github user name?");

console.log({ name });

const defaultValue: string = await Input.prompt({
  message: "Just press Enter to see the default value",
  default: new Date().toLocaleDateString(),
});

console.log({ defaultValue });
