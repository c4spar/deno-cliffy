#!/usr/bin/env -S deno run

import { Input } from "@cliffy/prompt/input";

const name: string = await Input.prompt("What's your github user name?");

console.log({ name });
