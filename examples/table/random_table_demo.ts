#!/usr/bin/env -S deno run

import {
  blue,
  bold,
  cyan,
  dim,
  green,
  italic,
  magenta,
  strikethrough,
  underline,
  yellow,
} from "https://deno.land/std@0.73.0/fmt/colors.ts";
import { AnsiEscape } from "../../ansi_escape/ansi_escape.ts";
import { Cell, ICell } from "../../table/cell.ts";
import { Table } from "../../table/table.ts";

const screen: AnsiEscape = AnsiEscape.from(Deno.stdout);
screen.cursorShow();

loop();

function loop() {
  const table: Table = createTable();
  // screen.eraseScreen().cursorTo( 0, 0 ).cursorHide();
  table.render();
  // setTimeout( loop, 1000 );
}

function createTable(): Table {
  return new Table()
    .header(
      ["ID", "First Name", "Last Name", "Email", "Gender", "IP-Address"].map(
        (value) => dim(value),
      ),
    )
    .body(
      [
        [
          "1",
          "Gino",
          "Aicheson",
          "gaicheson0@nydailynews.com",
          "Male",
          "186.87.102.85",
        ],
        [
          "2",
          "Godfry",
          "Pedycan",
          "gpedycan1@state.gov",
          "Male",
          "53.95.85.89",
        ],
        [
          "3",
          "Loni",
          "Miller",
          "lmiller2@chron.com",
          "Female",
          "134.230.62.147",
        ],
        [
          "4",
          "Frayda",
          "Oman",
          "foman3@bloglovin.com",
          "Female",
          "232.19.202.61",
        ],
        [
          "5",
          "Ernaline",
          "Hucklesby",
          "ehucklesby4@comcast.net",
          "Female",
          "0.102.177.91",
        ],
        ["6", "Lilla", "Cattel", "lcattel5@gov.uk", "Female", "253.205.45.62"],
      ].map<ICell[]>((row: ICell[]) => randomizeRow(row)),
    )
    .padding(1);
}

function randomizeRow(row: ICell[]) {
  // return row;
  const rnd = (index: number = row.length) =>
    Math.round(Math.random() * (index - 2)) + 1;
  const styles = [
    bold,
    bold,
    blue,
    green,
    magenta,
    yellow,
    cyan,
    strikethrough,
    underline,
    italic,
    dim,
  ];
  const style = (val: string) => styles[rnd(styles.length)](val);
  const cell: ICell = row[0];

  if (cell instanceof Cell) {
    // cell.setValue( style( cell.toString() ) );
  } else if (cell) {
    row[0] = dim(`#${cell}`);
    for (let i = 0; i < 20; i++) {
      const r = rnd();
      if (typeof row[r] === "string") {
        row[r] = style(row[r] as string);
      }
    }
  }

  const cells: ICell[] = row;
  const r1 = rnd();
  if (typeof cells[r1] === "string") {
    cells[r1] = Cell.from(cells[r1]).border(true);
  }
  return cells;
}
