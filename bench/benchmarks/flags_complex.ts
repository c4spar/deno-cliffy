import { parseFlags } from "../../flags/flags.ts";
import { OptionType } from "../../flags/types.ts";
import { bench, BenchmarkTimer } from "../bench_deps.ts";
import { benchConfig } from "../config.ts";

bench({
  name: "flags: Complex flags",
  runs: benchConfig.runs,
  func: (timer: BenchmarkTimer) => {
    timer.start();

    parseFlags([
      "-x",
      "3",
      "-n5",
      "-abc",
      "-d1",
      "-e1",
      "-f1",
      "-g1",
      "-h1",
      "-i1",
      "-j1",
      "--beep=boop",
      "foo",
      "bar",
      "baz",
      "foo",
      "bar",
      "baz",
      "foo",
      "bar",
      "baz",
      "--deno.land",
      "--",
      "--cliffy",
    ], {
      flags: [{
        name: "x",
        type: OptionType.NUMBER,
      }, {
        name: "n",
        type: OptionType.NUMBER,
      }, {
        name: "a",
      }, {
        name: "b",
      }, {
        name: "c",
      }, {
        name: "d",
        type: OptionType.STRING,
      }, {
        name: "e",
        type: OptionType.STRING,
      }, {
        name: "f",
        type: OptionType.STRING,
      }, {
        name: "g",
        type: OptionType.STRING,
      }, {
        name: "h",
        type: OptionType.STRING,
      }, {
        name: "i",
        type: OptionType.STRING,
      }, {
        name: "j",
        type: OptionType.STRING,
      }, {
        name: "beep",
        type: OptionType.STRING,
      }, {
        name: "deno.land",
      }],
    });

    timer.stop();
  },
});
