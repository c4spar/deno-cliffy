#!/usr/bin/env -S deno run

import { Number } from "../../prompt/number.ts";

const age: number = await Number.prompt("How old are you?");

console.log({ age });
