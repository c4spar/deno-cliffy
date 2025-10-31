#!/usr/bin/env -S deno run

import { Command, StringType } from "@cliffy/command";

class EmailType extends StringType {
  override complete(): string[] {
    return ["aaa@example.com", "bbb@example.com", "ccc@example.com"];
  }
}

await new Command()
  .option("-e, --email <value:email>", "Your email address.")
  .type("email", new EmailType())
  .parse();
