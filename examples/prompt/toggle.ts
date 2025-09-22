#!/usr/bin/env -S deno run

import { Toggle } from "jsr:@cliffy/command@1.0.0-rc.8/toggle";

const confirmed: boolean = await Toggle.prompt("Can you confirm?");

console.log({ confirmed });
