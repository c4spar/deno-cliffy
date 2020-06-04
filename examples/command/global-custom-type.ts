#!/usr/bin/env -S deno run

import { Command } from "../../packages/command/lib/command.ts";
import {
  IFlagArgument,
  IFlagOptions,
  ITypeHandler,
} from "../../packages/flags/lib/types.ts";

const email = (): ITypeHandler<string> => {
  const emailRegex: RegExp =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  return (option: IFlagOptions, arg: IFlagArgument, value: string): string => {
    if (!emailRegex.test(value.toLowerCase())) {
      throw new Error(
        `Option --${option.name} must be a valid email but got: ${value}`,
      );
    }

    return value;
  };
};

await new Command()
  .type("email", email(), { global: true })
  .command("login")
  .description("Login with email.")
  .option("-e, --email <value:email>", "Your email address.")
  .action(console.log)
  .command("config")
  .description("Manage config.")
  .option("-a, --admin-email [value:email]", "Get or set admin email address.")
  .action(console.log)
  .parse(Deno.args);
