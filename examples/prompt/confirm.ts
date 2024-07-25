#!/usr/bin/env -S deno run

import { Confirm } from "@cliffy/prompt/confirm";

const confirmed: boolean = await Confirm.prompt("Can you confirm?");

console.log({ confirmed });
