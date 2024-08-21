#!/usr/bin/env -S deno run -A

import { blue } from "@std/fmt/colors";
import config from "../deno.json" with { type: "json" };

const taskName = Deno.args[0] as keyof typeof config.scripts;
const script = config.scripts[taskName];
const prefix = "shopt -s extglob; ";

console.log(blue("$"), script);

await new Deno.Command("sh", {
  args: ["-O", "extglob", "-c", `${prefix} ${script}`],
  stdout: "inherit",
  stderr: "inherit",
}).output();
