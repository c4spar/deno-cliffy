#!/usr/bin/env -S deno run

import { Toggle } from "../../prompt/toggle.ts";

const confirmed: boolean = await Toggle.prompt("Can you confirm?");

console.log({ confirmed });
