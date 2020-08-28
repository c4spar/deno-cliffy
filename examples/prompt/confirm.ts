#!/usr/bin/env -S deno run --unstable

import { Confirm } from "../../prompt/confirm.ts";

const confirmed: boolean = await Confirm.prompt("Can you confirm?");

console.log({ confirmed });
