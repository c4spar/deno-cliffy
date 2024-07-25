#!/usr/bin/env -S deno run

import { Toggle } from "@cliffy/prompt/toggle";

const confirmed: boolean = await Toggle.prompt("Can you confirm?");

console.log({ confirmed });
