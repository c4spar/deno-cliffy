#!/usr/bin/env -S deno run

import { Command } from "@cliffy/command";

await new Command()
  .version("0.1.0")
  .option("--foo", "Foo option.", {
    action: () => {
      console.log("--foo action");
    },
  })
  .option("--bar", "Bar option.", {
    standalone: true,
    action: () => {
      console.log("--bar action");
    },
  })
  .option("--baz", "Baz option.", {
    action: () => {
      console.log("--baz action");
      Deno.exit(0);
    },
  })
  .action(() => console.log("main action"))
  .parse();

console.log("main context");
