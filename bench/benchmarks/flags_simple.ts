import { parseFlags } from "../../flags/flags.ts";
import { bench, BenchmarkTimer } from "../bench_deps.ts";
import { benchConfig } from "../config.ts";

bench({
  name: "flags: Simple flags",
  runs: benchConfig.runs,
  func: (timer: BenchmarkTimer) => {
    timer.start();

    parseFlags([
      "-x",
      "3",
      "-n5",
      "-abc",
      "--beep=boop",
      "foo",
    ]);

    timer.stop();
  },
});
