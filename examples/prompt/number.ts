#!/usr/bin/env -S deno run

import { Number } from "@cliffy/prompt/number";

const age: number = await Number.prompt("How old are you?");

console.log({ age });
