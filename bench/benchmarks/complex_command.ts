import {
  bench,
  BenchmarkTimer,
} from "https://deno.land/std@0.101.0/testing/bench.ts";
import { Command } from "../../command/command.ts";
import { benchConfig } from "../config.ts";

bench({
  name: "command: Complex command",
  runs: benchConfig.runs,
  func: async (timer: BenchmarkTimer): Promise<void> => {
    timer.start();

    const program = new Command()
      .name("My MY App")
      .description("My MY Description")
      .version("1.0.1");

    await program
      .option("-g, --global1 [foo]", "...", { global: true })
      .option("-G, --global2 [foo]", "...", { global: true })
      .option("-H, --global3 [foo]", "...", { global: true })
      .option("-a, --global4 [foo]", "...", { global: true })
      .option("-b, --global5 [foo]", "...", { global: true })
      .option("-c, --global6 [foo]", "...", { global: true })
      .command("serve1")
      .description("Simple Server")
      .option("-a --address", "Define the address")
      .option("-p --port", "Define the port")
      .command("serve2")
      .description("Simple Server2")
      .command("serve3")
      .description("Simple Server3")
      .command("serve4")
      .description("Simple Server4")
      .command("serve5")
      .description("Simple Server5")
      .command("serve6")
      .description("Simple Server6")
      .parse(
        [
          "serve6",
          "--global1",
          "foo",
          "--global2",
          "foo",
          "--global3",
          "foo",
          "--global4",
          "foo",
          "--global5",
          "foo",
          "--global6",
          "foo",
        ],
      );

    timer.stop();
  },
});
