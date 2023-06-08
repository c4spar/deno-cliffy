#!/usr/bin/env -S deno run

import { Cell } from "../../table/cell.ts";
import { Row } from "../../table/row.ts";
import { Table } from "../../table/table.ts";

new Table()
  .header(Row.from(["Name", "Date", "City", "Country"]).border())
  .body([
    [
      "Baxter Herman",
      new Cell("Oct 1, 2020").border(),
      "Row 1 Column 3",
      "Harderwijk",
      "Slovenia",
    ],
    new Row("Jescie Wolfe", "Dec 4, 2020", "Alto Hospicio", "Japan").border(
      true,
    ),
    ["Allegra Cleveland", "Apr 16, 2020", "Avernas-le-Bauduin", "Samoa"],
    ["Aretha Gamble", "Feb 22, 2021", "Honolulu", "Georgia"],
  ])
  .render();
