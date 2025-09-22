#!/usr/bin/env -S deno run

import { getCursorPosition } from "jsr:@cliffy/ansi@1.0.0-rc.8/cursor-position";

Deno.stdout.writeSync(new TextEncoder().encode("Hallo world!"));
console.log("\ngetCursorPosition:", getCursorPosition());
