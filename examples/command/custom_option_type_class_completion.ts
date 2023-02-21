#!/usr/bin/env -S deno run

import { Command, StringType } from "../../command/mod.ts";

class EmailType extends StringType {
  complete(): string[] {
    return ["aaa@example.com", "bbb@example.com", "ccc@example.com"];
  }
}

await new Command()
  .option("-e, --email <value:email>", "Your email address.")
  .type("email", new EmailType())
  .parse(Deno.args);
