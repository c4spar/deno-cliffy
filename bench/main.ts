import { runBenchmarks } from "./bench_deps.ts";

import "./benchmarks/command_simple.ts";
import "./benchmarks/command_complex.ts";

import "./benchmarks/flags_simple.ts";
import "./benchmarks/flags_complex.ts";

import "./benchmarks/table_simple.ts";
import "./benchmarks/table_complex.ts";

interface BenchResult {
  totalMs: number;
  runsCount: number;
  measuredRunsAvgMs: number;
  rev: string;
  timestamp: number;
  version: typeof Deno.version;
}

interface TestData {
  name: string;
  history: Array<BenchResult>;
}

interface ModuleData {
  name: string;
  tests: Array<TestData>;
}
type BenchData = Array<ModuleData>;

if (import.meta.main) {
  const outputFile: string | undefined = Deno.args[0];
  const rev = Deno.args[1];
  const timestamp = Date.now();
  await runBenchmarks({}, async (progress) => {
    if (progress.state === "benchmarking_end") {
      const json: string | undefined = outputFile &&
          await Deno.readTextFile(outputFile).catch(() => undefined) ||
        undefined;

      const data: BenchData = (json && JSON.parse(json)) ?? [];

      const output = progress.results.map((result) => {
        let [moduleName, testName] = result.name.split(":").map((val) =>
          val.trim()
        );
        if (!testName) {
          testName = moduleName;
          moduleName = "default";
        }

        const entry: BenchResult = {
          totalMs: result.totalMs,
          runsCount: result.runsCount,
          measuredRunsAvgMs: result.measuredRunsAvgMs,
          rev,
          timestamp,
          version: Deno.version,
        };

        if (outputFile && result.name !== "warmup") {
          let module: ModuleData | undefined = data.find((module) =>
            module.name === moduleName
          );
          if (!module) {
            module = { name: moduleName, tests: [] };
            data.push(module);
          }

          let test: TestData | undefined = module.tests.find((test) =>
            test.name === testName
          );
          if (!test) {
            test = { name: testName, history: [] };
            module.tests.push(test);
          }

          test.history.push(entry);
        }

        return entry;
      });

      if (outputFile) {
        await Deno.writeTextFile(outputFile, JSON.stringify(data), {
          create: true,
        });
      } else {
        console.log(output);
      }
    }
  });
}
