#!/usr/bin/env -S deno run

import { Cell, Table } from "jsr:@cliffy/table@1.0.0-rc.8";

const table = new Table(
  [
    new Cell("Row 1 & 2 / Column 1").rowSpan(2),
    "Row 1 / Column 2",
    "Row 1 / Column 3",
  ],
  [new Cell("Row 2 / Column 2 & 3").colSpan(2)],
  [
    new Cell("Row 3 & 4 / Column 1").rowSpan(2),
    "Row 3 / Column 2",
    "Row 3 / Column 3",
  ],
  [new Cell("Row 4 / Column 2 & 3").colSpan(2)],
  [
    "Row 5 / Column 1",
    new Cell("Row 5 & 6 / Column 2 & 3").rowSpan(2).colSpan(2),
  ],
);

table.push(["Row 6 / Column 1"]);

table.border().render();
