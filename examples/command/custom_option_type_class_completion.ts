#!/usr/bin/env -S deno run

import { Command, StringType } from "jsr:@cliffy/command@1.0.0-rc.8";

class EmailType extends StringType {
  override complete(): string[] {
    return ["aaa@example.com", "bbb@example.com", "ccc@example.com"];
  }
}

await new Command()
  .option("-e, --email <value:email>", "Your email address.")
  .type("email", new EmailType())
  .parse(Deno.args);
