#!/usr/bin/env -S deno run

import { Command } from "../../command/command.ts";

await new Command()
  .command("install [name]", "install one or more packages").executable()
  .command("search [query]", "search with optional query").executable()
  .command("update", "update installed packages").executable()
  .command("list", "list packages installed").executable()
  .parse(Deno.args);
