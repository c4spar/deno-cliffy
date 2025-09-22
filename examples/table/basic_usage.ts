#!/usr/bin/env -S deno run

import { Table } from "jsr:@cliffy/table@1.0.0-rc.8";

const table: Table = new Table(
  ["Baxter Herman", "Oct 1, 2020", "Harderwijk", "Slovenia"],
  ["Jescie Wolfe", "Dec 4, 2020", "Alto Hospicio", "Japan"],
  ["Allegra Cleveland", "Apr 16, 2020", "Avernas-le-Bauduin", "Samoa"],
  ["Aretha Gamble", "Feb 22, 2021", "Honolulu", "Georgia"],
);

console.log(table.toString());
