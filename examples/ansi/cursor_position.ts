#!/usr/bin/env -S deno run

import { getCursorPosition } from "../../ansi/cursor_position.ts";

Deno.stdout.writeSync(new TextEncoder().encode("Hallo world!"));
console.log("\ngetCursorPosition:", getCursorPosition());
