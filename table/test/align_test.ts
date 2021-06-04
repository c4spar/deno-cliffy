import { Table } from "../table.ts";
import { assertEquals } from "../../dev_deps.ts";
import { Row } from "../row.ts";
import { Cell } from "../cell.ts";

Deno.test("table - align - align table", () => {
  assertEquals(
    new Table()
      .header(["Foo", "Bar", "Baz"])
      .body([
        ["foo bar baz", "baz", "beep boop"],
        ["baz", "beep boop", "foo bar baz"],
        ["beep boop", "foo bar baz", "baz"],
      ])
      .border(true)
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

Deno.test("table - align - align row and cell", () => {
  assertEquals(
    new Table()
      .header(Row.from(["Foo", "Bar", "Baz"]).align("center"))
      .body([
        ["foo bar baz", "baz", "beep boop"],
        new Row("baz", "beep boop", "foo bar baz").align("right"),
        ["beep boop", "foo bar baz", new Cell("baz").align("center")],
      ])
      .border(true)
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
