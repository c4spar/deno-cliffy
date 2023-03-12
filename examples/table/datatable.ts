#!/usr/bin/env -S deno run

import { colors } from "../../ansi/colors.ts";
import { Table } from "../../table/table.ts";

new Table()
  .data([
    {
      firstName: "Gino",
      lastName: "Aicheson",
      age: 21,
      email: "gaicheson0@nydailynews.com",
    },
    {
      firstName: "Godfry",
      lastName: "Pedycan",
      age: 33,
      email: "gpedycan1@state.gov",
    },
    {
      firstName: "Loni",
      lastName: "Miller",
      age: 24,
      email: "lmiller2@chron.com",
    },
  ])
  .headerRenderer(colors.bold)
  .columns([{
    header: "Name",
    cellValue: ({ firstName, lastName }) => `${firstName} ${lastName}`,
    cellRenderer: colors.brightBlue.bold,
  }, {
    field: "age",
    header: "Age",
    align: "right",
    cellRenderer: colors.yellow,
  }, {
    field: "email",
    header: "Email",
    minWidth: 20,
    align: "center",
    cellRenderer: colors.cyan.italic,
  }])
  .border()
  .render();
