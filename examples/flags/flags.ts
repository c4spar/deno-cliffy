#!/usr/bin/env -S deno run

import { parseFlags } from "../../flags/flags.ts";

console.log(parseFlags(Deno.args));
