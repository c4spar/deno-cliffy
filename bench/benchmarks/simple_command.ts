import { bench, BenchmarkTimer } from "../../dev_deps.ts";
import { Command } from "../../command/command.ts";
import { benchConfig } from "../config.ts";

bench({
  name: "command: Simple command",
  runs: benchConfig.runs,
  func: async (timer: BenchmarkTimer): Promise<void> => {
    timer.start();

    const program = new Command()
      .name("My MY App")
      .description("My MY Description")
      .version("1.0.1");

    await program
      .command("serve")
      .description("Simple Server")
      .option("-a --address", "Define the address")
      .option("-p --port", "Define the port")
      .parse(
        [
          "serve",
          "--address",
          "--port",
        ],
      );

    timer.stop();
  },
});
