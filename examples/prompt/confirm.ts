#!/usr/bin/env -S deno run

import { Confirm } from "jsr:@cliffy/prompt@1.0.0-rc.8/confirm";

const confirmed: boolean = await Confirm.prompt("Can you confirm?");

console.log({ confirmed });
