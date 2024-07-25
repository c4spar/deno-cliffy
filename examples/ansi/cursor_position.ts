#!/usr/bin/env -S deno run

import { getCursorPosition } from "@cliffy/ansi/cursor-position";

Deno.stdout.writeSync(new TextEncoder().encode("Hallo world!"));
console.log("\ngetCursorPosition:", getCursorPosition());
