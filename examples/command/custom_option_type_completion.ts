#!/usr/bin/env -S deno run

import { Command } from "@cliffy/command";

await new Command()
  .option("-e, --email <value:string:email>", "Your email address.")
  .complete(
    "email",
    () => ["aaa@example.com", "bbb@example.com", "ccc@example.com"],
  )
  .parse();
