#!/usr/bin/env -S deno run

import { Table } from "@cliffy/table";

new Table()
  .columns([{
    border: true,
  }, {
    minWidth: 20,
    align: "center",
  }, {
    align: "right",
  }])
  .header(["Foo", "Bar", "Baz"])
  .body([
    ["foo bar baz", "baz", "beep boop"],
    ["baz", "beep boop", "foo bar baz"],
    ["beep boop", "foo bar baz", "baz"],
  ])
  .render();
