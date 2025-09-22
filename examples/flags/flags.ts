#!/usr/bin/env -S deno run

import { parseFlags } from "jsr:@cliffy/flags@1.0.0-rc.8";

console.log(parseFlags(Deno.args));
