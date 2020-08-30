#!/usr/bin/env -S deno run

import { Cell } from "../../table/cell.ts";
import { Table } from "../../table/table.ts";

Table.from([
  [
    Cell.from("Row 1 & 2 Column 1").rowSpan(2),
    "Row 1 Column 2",
    "Row 1 Column 3",
  ],
  [Cell.from("Row 2 Column 2 & 3").colSpan(2)],
  [
    Cell.from("Row 3 & 4 Column 1").rowSpan(2),
    "Row 3 Column 2",
    "Row 3 Column 3",
  ],
  [Cell.from("Row 4 Column 2 & 3").colSpan(2)],
  ["Row 5 Column 1", Cell.from("Row 5 & 6 Column 2 & 3").rowSpan(2).colSpan(2)],
  ["Row 6 Column 1"],
])
  .border(true)
  .render();
