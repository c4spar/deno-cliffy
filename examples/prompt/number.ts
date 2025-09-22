#!/usr/bin/env -S deno run

import { Number } from "jsr:@cliffy/prompt@1.0.0-rc.8/number";

const age: number = await Number.prompt("How old are you?");

console.log({ age });
