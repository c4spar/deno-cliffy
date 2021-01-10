import { Command, ValidationError } from "../../command/mod.ts";

const cmd = new Command()
  .throwErrors() // <-- throw also validation errors.
  .option("-p, --pizza-type <type>", "Flavour of pizza.")
  .action(() => {
    throw new Error("Some error happened.");
  });

try {
  cmd.parse();
} catch (error) {
  if (error instanceof ValidationError) {
    cmd.help();
    console.error("[CUSTOM_VALIDATION_ERROR]", error.message);
  } else {
    console.error("[CUSTOM_ERROR]", error);
  }
  Deno.exit(1);
}
