#!/usr/bin/env -S deno run

import { colors } from "../../ansi/colors.ts";
import { Table } from "../../table/table.ts";

new Table()
  .header(["Name", "Age", "Email"])
  .body([
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
  .columns([{
    value: ({ firstName, lastName }) =>
      colors.brightBlue.bold(`${firstName} ${lastName}`),
  }, {
    align: "right",
    value: ({ age }) => colors.yellow(age.toString()),
  }, {
    minWidth: 20,
    value: ({ email }) => colors.cyan.italic(email),
  }])
  .headerValue((value) => colors.bold(value))
  .border()
  .render();
