import { Table } from "../../table/table.ts";
import { bench, BenchmarkTimer } from "../bench_deps.ts";
import { benchConfig } from "../config.ts";

bench({
  name: "table: Simple table",
  runs: benchConfig.runs,
  func: (timer: BenchmarkTimer) => {
    timer.start();

    new Table(
      ["Baxter Herman", "Oct 1, 2020", "Harderwijk", "Slovenia"],
      ["Jescie Wolfe", "Dec 4, 2020", "Alto Hospicio", "Japan"],
      ["Allegra Cleveland", "Apr 16, 2020", "Avernas-le-Bauduin", "Samoa"],
      ["Aretha Gamble", "Feb 22, 2021", "Honolulu", "Georgia"],
    ).toString();

    timer.stop();
  },
});
