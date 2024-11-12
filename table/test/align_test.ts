import { test } from "@cliffy/internal/testing/test";
import { Table } from "../table.ts";
import { assertEquals } from "@std/assert";
import { Row } from "../row.ts";
import { Cell } from "../cell.ts";

test("table - align - align table", () => {
  assertEquals(
    new Table()
      .header(["Foo", "Bar", "Baz"])
      .body([
        ["foo bar baz", "baz", "beep boop"],
        ["baz", "beep boop", "foo bar baz"],
        ["beep boop", "foo bar baz", "baz"],
      ])
      .border()
      .align("center")
      .toString(),
    `
┌─────────────┬─────────────┬─────────────┐
│     Foo     │     Bar     │     Baz     │
├─────────────┼─────────────┼─────────────┤
│ foo bar baz │     baz     │  beep boop  │
├─────────────┼─────────────┼─────────────┤
│     baz     │  beep boop  │ foo bar baz │
├─────────────┼─────────────┼─────────────┤
│  beep boop  │ foo bar baz │     baz     │
└─────────────┴─────────────┴─────────────┘`.slice(1),
  );
});

test("table - align - align row and cell", () => {
  assertEquals(
    new Table()
      .header(Row.from(["Foo", "Bar", "Baz"]).align("center"))
      .body([
        ["foo bar baz", "baz", "beep boop"],
        new Row("baz", "beep boop", "foo bar baz").align("right"),
        ["beep boop", "foo bar baz", new Cell("baz").align("center")],
      ])
      .border()
      .toString(),
    `
┌─────────────┬─────────────┬─────────────┐
│     Foo     │     Bar     │     Baz     │
├─────────────┼─────────────┼─────────────┤
│ foo bar baz │ baz         │ beep boop   │
├─────────────┼─────────────┼─────────────┤
│         baz │   beep boop │ foo bar baz │
├─────────────┼─────────────┼─────────────┤
│ beep boop   │ foo bar baz │     baz     │
└─────────────┴─────────────┴─────────────┘`.slice(1),
  );
});

test("table - align - default direction", () => {
  const cell = new Cell("foo");
  const row = new Row(cell);
  const table = new Table(row);
  assertEquals(cell.getAlign(), "left");
  assertEquals(row.getAlign(), "left");
  assertEquals(table.getAlign(), "left");
  assertEquals(table[0][0].getAlign(), "left");
  assertEquals(table[0].getAlign(), "left");
});

test("table - align - override direction", () => {
  const cell = new Cell("foo").align("center");
  const row = new Row(cell).align("center");
  const table = new Table(row).align("center");
  assertEquals(cell.getAlign(), "center");
  assertEquals(row.getAlign(), "center");
  assertEquals(table.getAlign(), "center");
  assertEquals(table[0][0].getAlign(), "center");
  assertEquals(table[0].getAlign(), "center");
});

test("table - align - inherit direction", () => {
  const cell = new Cell("foo");
  const row = new Row(cell);
  const table = new Table(row).align("right");
  assertEquals(cell.getAlign(), "left");
  assertEquals(row.getAlign(), "left");
  assertEquals(table.getAlign(), "right");
  assertEquals(table[0][0].getAlign(), "left");
  assertEquals(table[0].getAlign(), "left");
});
