#!/usr/bin/env -S deno run

import { Table } from "../../table/table.ts";

const table: Table = Table.from([
  ["Baxter Herman", "Oct 1, 2020", "Harderwijk", "Slovenia"],
  ["Jescie Wolfe", "Dec 4, 2020", "Alto Hospicio", "Japan"],
  ["Allegra Cleveland", "Apr 16, 2020", "Avernas-le-Bauduin", "Samoa"],
]);

table.push(["Aretha Gamble", "Feb 22, 2021", "Honolulu", "Georgia"]);
table.sort();
table.render();
