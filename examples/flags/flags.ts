#!/usr/bin/env -S deno run

import { parseFlags } from "@cliffy/flags";

console.log(parseFlags());

// or: console.log(parseFlags(Deno.args));
