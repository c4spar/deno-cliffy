#!/usr/bin/env -S deno run

import { Command, ITypeInfo } from "../../command/mod.ts";

const emailRegex =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

function emailType({ label, name, value }: ITypeInfo): string {
  if (!emailRegex.test(value.toLowerCase())) {
    throw new Error(
      `${label} "${name}" must be a valid "email", but got "${value}".`,
    );
  }

  return value;
}

const { options } = await new Command()
  .type("email", emailType)
  .arguments("[email:email]")
  .option("-e, --email <value:email>", "Your email address.")
  .command("email [email:email]", "Your email address.")
  .parse(Deno.args);

console.log(options);
