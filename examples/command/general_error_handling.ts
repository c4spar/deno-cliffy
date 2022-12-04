import { Command } from "../../command/command.ts";

const cmd = new Command()
  .option("-p, --pizza-type <type>", "Flavour of pizza.")
  .action(() => {
    throw new Error("Some error happened.");
  });

try {
  await cmd.parse();
} catch (error) {
  console.error("[CUSTOM_ERROR]", error);
  Deno.exit(1);
}
