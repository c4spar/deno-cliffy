#!/usr/bin/env -S deno run

import { parseFlags, ValidationError } from "jsr:@cliffy/flags@1.0.0-rc.8";

try {
  const flags = parseFlags(Deno.args, {
    flags: [{
      name: "debug",
    }],
  });
  console.log(flags);
} catch (error) {
  // Flags validation error.
  if (error instanceof ValidationError) {
    console.log("[VALIDATION_ERROR] %s", error.message);
    Deno.exit(1);
  }
  // General error.
  throw error;
}
