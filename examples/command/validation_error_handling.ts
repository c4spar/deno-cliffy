import { Command, ValidationError } from "../../command/mod.ts";

const cmd = new Command()
  .throwErrors() // <-- throw also validation errors.
  .option("-p, --pizza-type <type>", "Flavour of pizza.")
  .action(() => {
    throw new Error("Some error happened.");
  });

try {
  await cmd.parse();
} catch (error) {
  if (error instanceof ValidationError) {
    cmd.showHelp();
    console.error("Usage error: %s", error.message);
    Deno.exit(error.exitCode);
  } else {
    console.error("Runtime error: %s", error);
    Deno.exit(1);
  }
}
