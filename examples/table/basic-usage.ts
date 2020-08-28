#!/usr/bin/env -S deno run

import { Table } from "../../table/table.ts";

const table: Table = new Table(
  ["Row 1 Column 1", "Row 1 Column 2", "Row 1 Column 3"],
  ["Row 2 Column 1", "Row 2 Column 2", "Row 2 Column 3"],
  ["Row 3 Column 1", "Row 3 Column 2", "Row 3 Column 3"],
);

console.log(table.toString());
// You can also use table.render() as shorthand which uses Deno.stdout.writeSync() under the hood.
