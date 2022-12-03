#!/usr/bin/env deno run

import { Command, ValidationError } from "../../command/mod.ts";

const { options, cmd } = await new Command()
  .error((_error, _cmd) => {
    console.error("error handler...");
    // Throw or call Deno.exit() to disable the default error handler.
    // throw _error;
    // Deno.exit(_error instanceof ValidationError ? _error.exitCode : 1);
  })
  .option("-r, --runtime-error", "Triggers a runtime error.")
  .option("-v, --validation-error", "Triggers a validation error.")
  .parse();

if (options.validationError) {
  cmd.throw(new ValidationError("validation error message."));
}

if (options.runtimeError) {
  cmd.throw(new Error("runtime error message."));
}
