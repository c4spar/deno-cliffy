import { Cell } from "../cell.ts";
import { Table } from "../table.ts";
import { assertEquals } from "../../dev_deps.ts";

Deno.test("should allow undefined cell values", () => {
  assertEquals(
    Table.from([
      ["foo", undefined, "bar"],
      ["beep", undefined, "boop"],
    ])
      .border()
      .toString(),
    `
┌──────┬──┬──────┐
│ foo  │  │ bar  │
├──────┼──┼──────┤
│ beep │  │ boop │
└──────┴──┴──────┘`
      .slice(1),
  );
});

Deno.test("should override undefined cell values with col & row span", () => {
  assertEquals(
    Table.from([
      [new Cell("foo").colSpan(2), undefined, "bar"],
      [undefined, new Cell("beep").rowSpan(2), "boop"],
      ["biz", undefined, "baz"],
    ])
      .border()
      .toString(),
    `
┌────────────┬──────┐
│ foo        │ bar  │
├─────┬──────┼──────┤
│     │ beep │ boop │
├─────┤      ├──────┤
│ biz │      │ baz  │
└─────┴──────┴──────┘`
      .slice(1),
  );
});

Deno.test("colspan + rowspan 1", () => {
  const expected = `
┌────────────────────┬────────────────┬────────────────┐
│ Row 1 & 2 Column 1 │ Row 1 Column 2 │ Row 1 Column 3 │
│                    ├────────────────┴────────────────┤
│                    │ Row 2 Column 2 & 3              │
├────────────────────┼────────────────┬────────────────┤
│ Row 3 & 4 Column 1 │ Row 3 Column 2 │ Row 3 Column 3 │
│                    ├────────────────┴────────────────┤
│                    │ Row 4 Column 2 & 3              │
├────────────────────┼─────────────────────────────────┤
│ Row 5 Column 1     │ Row 5 & 6 Column 2 & 3          │
├────────────────────┤                                 │
│ Row 6 Column 1     │                                 │
└────────────────────┴─────────────────────────────────┘`.slice(1);

  assertEquals(
    expected,
    Table.from([
      [
        Cell.from("Row 1 & 2 Column 1").rowSpan(2),
        "Row 1 Column 2",
        "Row 1 Column 3",
      ],
      [Cell.from("Row 2 Column 2 & 3").colSpan(2)],
      [
        Cell.from("Row 3 & 4 Column 1").rowSpan(2),
        "Row 3 Column 2",
        "Row 3 Column 3",
      ],
      [Cell.from("Row 4 Column 2 & 3").colSpan(2)],
      [
        "Row 5 Column 1",
        Cell.from("Row 5 & 6 Column 2 & 3").rowSpan(2).colSpan(2),
      ],
      ["Row 6 Column 1"],
    ])
      .border()
      .toString(),
  );
});

Deno.test("colspan + rowspan 2", () => {
  const expected = `
┌────────────────────┬────────────────┬────────────────┐
│ Row 1 & 2 Column 1 │ Row 1 Column 2 │ Row 1 Column 3 │
│                    ├────────────────┴────────────────┤
│                    │ Row 2 Column 2 & 3              │
├────────────────────┼────────────────┬────────────────┤
│ Row 3 & 4 Column 1 │ Row 3 Column 2 │ Row 3 Column 3 │
│                    ├────────────────┴────────────────┤
│                    │ Row 4 Column 2 & 3              │
├────────────────────┼─────────────────────────────────┤
│ Row 5 Column 1     │ Row 5 & 6 Column 2 & 3          │
├────────────────────┤                                 │
│                    │                                 │
└────────────────────┴─────────────────────────────────┘`.slice(1);

  assertEquals(
    expected,
    Table.from([
      [
        Cell.from("Row 1 & 2 Column 1").rowSpan(2),
        "Row 1 Column 2",
        "Row 1 Column 3",
      ],
      [Cell.from("Row 2 Column 2 & 3").colSpan(2)],
      [
        Cell.from("Row 3 & 4 Column 1").rowSpan(2),
        "Row 3 Column 2",
        "Row 3 Column 3",
      ],
      [Cell.from("Row 4 Column 2 & 3").colSpan(2)],
      [
        "Row 5 Column 1",
        Cell.from("Row 5 & 6 Column 2 & 3").rowSpan(2).colSpan(2),
      ],
    ])
      .border()
      .toString(),
  );
});

Deno.test("colspan + rowspan 3", () => {
  const expected = `
┌────────────────┬─────┐
│ Row 5 Column 1 │ Row │
├────────────────┤ 5 & │
│                │ 6   │
│                │ Col │
│                │ umn │
│                │ 2 & │
│                │ 3   │
└────────────────┴─────┘`.slice(1);

  assertEquals(
    expected,
    Table.from([
      [
        "Row 5 Column 1",
        Cell.from("Row 5 & 6 Column 2 & 3").rowSpan(2).colSpan(2),
      ],
    ])
      .border()
      .toString(),
  );
});

Deno.test("colspan + rowspan 4", () => {
  const expected = `
┌─────┐
│ Row │
│ 5 & │
│ 6   │
│ Col │
│ umn │
│ 2 & │
│ 3   │
└─────┘`.slice(1);

  assertEquals(
    expected,
    Table.from([
      [Cell.from("Row 5 & 6 Column 2 & 3").rowSpan(2).colSpan(2)],
    ])
      .border()
      .toString(),
  );
});

Deno.test("colspan + rowspan 5", () => {
  const expected = `
┌────────────────┬────────────────┬────────────────┬────────────────┐
│ Row 1 Column 1 │ Row 1 Column 2 │ Row 1 Column 3 │ Row 1 Column 4 │
├────────────────┼────────────────┴────────────────┼────────────────┤
│ Row 2 Column 1 │ Row 2 & 3 Column 2 & 3          │ Row 2 Column 4 │
├────────────────┤ foo                             ├────────────────┤
│ Row 3 Column 1 │ bar                             │ Row 3 Column 4 │
├────────────────┼────────────────┬────────────────┼────────────────┤
│ Row 4 Column 1 │ Row 4 Column 2 │ Row 4 Column 3 │ Row 4 Column 4 │
└────────────────┴────────────────┴────────────────┴────────────────┘`.slice(1);

  assertEquals(
    expected,
    Table.from([
      ["Row 1 Column 1", "Row 1 Column 2", "Row 1 Column 3", "Row 1 Column 4"],
      [
        "Row 2 Column 1",
        Cell.from("Row 2 & 3 Column 2 & 3\nfoo\nbar").colSpan(2).rowSpan(2),
        "Row 2 Column 4",
      ],
      ["Row 3 Column 1", "Row 3 Column 4"],
      ["Row 4 Column 1", "Row 4 Column 2", "Row 4 Column 3", "Row 4 Column 4"],
    ])
      .border()
      .toString(),
  );
});

Deno.test("colspan + rowspan 6", () => {
  const expected = `
┌────────────────┬────────────────┬─────────────────────────────────┐
│ Row 1 Column 1 │ Row 1 Column 2 │ Row 1 & 2 Column 3 & 4          │
├────────────────┼────────────────┤ foo                             │
│ Row 2 Column 1 │ Row 2 Column 2 │ bar                             │
├────────────────┼────────────────┼────────────────┬────────────────┤
│ Row 3 Column 1 │ Row 3 Column 2 │ Row 1 Column 3 │ Row 1 Column 4 │
├────────────────┼────────────────┼────────────────┼────────────────┤
│ Row 4 Column 1 │ Row 4 Column 2 │ Row 4 Column 3 │ Row 4 Column 4 │
└────────────────┴────────────────┴────────────────┴────────────────┘`.slice(1);

  assertEquals(
    expected,
    Table.from([
      [
        "Row 1 Column 1",
        "Row 1 Column 2",
        Cell.from("Row 1 & 2 Column 3 & 4\nfoo\nbar").colSpan(2).rowSpan(2),
      ],
      ["Row 2 Column 1", "Row 2 Column 2"],
      ["Row 3 Column 1", "Row 3 Column 2", "Row 1 Column 3", "Row 1 Column 4"],
      ["Row 4 Column 1", "Row 4 Column 2", "Row 4 Column 3", "Row 4 Column 4"],
    ])
      .border()
      .toString(),
  );
});

Deno.test("colspan + rowspan 7", () => {
  const expected = `
┌────────────────┬────────────────┬──┬──┐
│ Row 1 Column 1 │ Row 1 Column 2 │  │  │
├────────────────┼────────────────┼──┴──┤
│ Row 2 Column 1 │ Row 2 Column 2 │ Row │
├────────────────┼────────────────┤ 2 & │
│ Row 3 Column 1 │ Row 3 Column 2 │ 3 & │
├────────────────┼────────────────┤ 4 & │
│ Row 4 Column 1 │ Row 4 Column 2 │ 5   │
├────────────────┼────────────────┤ Col │
│                │                │ umn │
│                │                │ 3 & │
│                │                │ 4   │
│                │                │ foo │
│                │                │ bar │
└────────────────┴────────────────┴─────┘`.slice(1);

  assertEquals(
    expected,
    Table.from([
      ["Row 1 Column 1", "Row 1 Column 2"],
      [
        "Row 2 Column 1",
        "Row 2 Column 2",
        Cell.from("Row 2 & 3 & 4 & 5 Column 3 & 4\nfoo\nbar").colSpan(2)
          .rowSpan(4),
      ],
      ["Row 3 Column 1", "Row 3 Column 2"],
      ["Row 4 Column 1", "Row 4 Column 2"],
    ])
      .border()
      .toString(),
  );
});

Deno.test("colspan + rowspan 8", () => {
  const expected = `
┌────────────────┬────────────────────┬──┬──┐
│ Row 1 Column 1 │ Row 1 & 2 Column 2 │  │  │
├────────────────┤                    ├──┴──┤
│ Row 2 Column 1 │                    │ Row │
│                ├────────────────────┤ 2 & │
│                │ Row 3 Column 2     │ 3 & │
├────────────────┼────────────────────┤ 4 & │
│ Row 4 Column 1 │ Row 4 Column 2     │ 5   │
├────────────────┼────────────────────┤ Col │
│                │                    │ umn │
│                │                    │ 3 & │
│                │                    │ 4   │
│                │                    │ foo │
│                │                    │ bar │
└────────────────┴────────────────────┴─────┘`.slice(1);

  assertEquals(
    expected,
    Table.from([
      ["Row 1 Column 1", Cell.from("Row 1 & 2 Column 2").rowSpan(2)],
      [
        Cell.from("Row 2 Column 1").rowSpan(2),
        Cell.from("Row 2 & 3 & 4 & 5 Column 3 & 4\nfoo\nbar").colSpan(2)
          .rowSpan(4),
      ],
      ["Row 3 Column 2"],
      ["Row 4 Column 1", "Row 4 Column 2"],
    ])
      .border()
      .toString(),
  );
});

Deno.test("should allow an empty array as first row", () => {
  assertEquals(
    Table.from([
      [],
      [new Cell("abc").colSpan(2)],
    ])
      .border()
      .toString(),
    `
┌──┬──┐
│  │  │
├──┴──┤
│ abc │
└─────┘`.slice(1),
  );
});
