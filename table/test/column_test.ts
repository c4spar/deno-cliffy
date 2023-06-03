import { colors } from "../../ansi/colors.ts";
import { Table } from "../table.ts";
import { assertEquals, assertSnapshot } from "../../dev_deps.ts";

const createTable = () =>
  new Table()
    .header(["Foo", "Bar", "Baz"])
    .body([
      ["foo bar baz", "baz", "beep boop"],
      ["baz", "beep boop", "foo bar baz"],
      ["beep boop", "foo bar baz", "baz"],
    ]);

Deno.test("[table] should set border on columns", () => {
  assertEquals(
    createTable()
      .columns([{
        border: true,
      }, {
        border: false,
      }, {
        border: true,
      }])
      .toString(),
    `
┌─────────────┐             ┌─────────────┐
│ Foo         │ Bar         │ Baz         │
├─────────────┤             ├─────────────┤
│ foo bar baz │ baz         │ beep boop   │
├─────────────┤             ├─────────────┤
│ baz         │ beep boop   │ foo bar baz │
├─────────────┤             ├─────────────┤
│ beep boop   │ foo bar baz │ baz         │
└─────────────┘             └─────────────┘`.slice(1),
  );
});

Deno.test("[table] should set align on columns", () => {
  assertEquals(
    createTable()
      .columns([{
        align: "left",
      }, {
        align: "center",
      }, {
        align: "right",
      }])
      .border(true)
      .toString(),
    `
┌─────────────┬─────────────┬─────────────┐
│ Foo         │     Bar     │         Baz │
├─────────────┼─────────────┼─────────────┤
│ foo bar baz │     baz     │   beep boop │
├─────────────┼─────────────┼─────────────┤
│ baz         │  beep boop  │ foo bar baz │
├─────────────┼─────────────┼─────────────┤
│ beep boop   │ foo bar baz │         baz │
└─────────────┴─────────────┴─────────────┘`.slice(1),
  );
});

Deno.test("[table] should set width on columns", () => {
  assertEquals(
    createTable()
      .columns([{
        maxWidth: 4,
      }, {
        minWidth: 20,
      }, {
        align: "right",
      }])
      .border(true)
      .toString(),
    `
┌──────┬──────────────────────┬─────────────┐
│ Foo  │ Bar                  │         Baz │
├──────┼──────────────────────┼─────────────┤
│ foo  │ baz                  │   beep boop │
│ bar  │                      │             │
│ baz  │                      │             │
├──────┼──────────────────────┼─────────────┤
│ baz  │ beep boop            │ foo bar baz │
├──────┼──────────────────────┼─────────────┤
│ beep │ foo bar baz          │         baz │
│ boop │                      │             │
└──────┴──────────────────────┴─────────────┘`.slice(1),
  );
});

Deno.test("[table] should set padding on columns", () => {
  assertEquals(
    createTable()
      .columns([{
        padding: 5,
        align: "left",
      }, {
        padding: 5,
        minWidth: 20,
        align: "center",
      }, {
        padding: 5,
        align: "right",
      }])
      .border(true)
      .toString(),
    `
┌─────────────────────┬──────────────────────────────┬─────────────────────┐
│     Foo             │             Bar              │             Baz     │
├─────────────────────┼──────────────────────────────┼─────────────────────┤
│     foo bar baz     │             baz              │       beep boop     │
├─────────────────────┼──────────────────────────────┼─────────────────────┤
│     baz             │          beep boop           │     foo bar baz     │
├─────────────────────┼──────────────────────────────┼─────────────────────┤
│     beep boop       │         foo bar baz          │             baz     │
└─────────────────────┴──────────────────────────────┴─────────────────────┘`
      .slice(1),
  );
});

Deno.test("[table] should call parser and renderer callback methods", async (t) => {
  await assertSnapshot(
    t,
    createTable()
      .columns([{
        headerValue: (value) => value + "a",
        cellValue: (value) => value + "1",
        headerRenderer: colors.magenta,
        cellRenderer: colors.blue,
      }, {
        headerValue: (value) => value + "b",
        cellValue: (value) => value + "2",
        headerRenderer: colors.blue,
        cellRenderer: colors.magenta,
      }, {
        headerValue: (value) => value + "c",
        cellValue: (value) => value + "3",
        headerRenderer: colors.yellow,
        cellRenderer: colors.green,
      }])
      .border(true)
      .toString(),
  );
});

Deno.test("[table] should set column options with column method", () => {
  const table = createTable();
  table.getColumn(0)?.padding(5);
  table.getColumn(0)?.align("left");

  table.getColumn(1)?.padding(5);
  table.getColumn(1)?.minWidth(20);
  table.getColumn(1)?.align("center");

  table.getColumn(2)?.padding(5);
  table.getColumn(2)?.align("right");

  assertEquals(
    table
      .border(true)
      .toString(),
    `
┌─────────────────────┬──────────────────────────────┬─────────────────────┐
│     Foo             │             Bar              │             Baz     │
├─────────────────────┼──────────────────────────────┼─────────────────────┤
│     foo bar baz     │             baz              │       beep boop     │
├─────────────────────┼──────────────────────────────┼─────────────────────┤
│     baz             │          beep boop           │     foo bar baz     │
├─────────────────────┼──────────────────────────────┼─────────────────────┤
│     beep boop       │         foo bar baz          │             baz     │
└─────────────────────┴──────────────────────────────┴─────────────────────┘`
      .slice(1),
  );
});
