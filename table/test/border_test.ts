import { border } from "../border.ts";
import { Table } from "../table.ts";
import { assertEquals } from "../../dev_deps.ts";

Deno.test("default table chars", () => {
  assertEquals(
    Table
      .from([
        ["Row 1 Column 1", "Row 1 Column 2"],
        ["Row 2 Column 1", "Row 2 Column 2", "Row 2 Column 3"],
        ["Row 3 Column 1", "Row 3 Column 2", "Row 3 Column 3"],
      ])
      .border()
      .toString(),
    `
┌────────────────┬────────────────┬────────────────┐
│ Row 1 Column 1 │ Row 1 Column 2 │                │
├────────────────┼────────────────┼────────────────┤
│ Row 2 Column 1 │ Row 2 Column 2 │ Row 2 Column 3 │
├────────────────┼────────────────┼────────────────┤
│ Row 3 Column 1 │ Row 3 Column 2 │ Row 3 Column 3 │
└────────────────┴────────────────┴────────────────┘`.slice(1),
  );
});

Deno.test("custom global table chars", () => {
  assertEquals(
    Table
      .chars({
        top: "a",
        topMid: "b",
        topLeft: "c",
        topRight: "d",
        bottom: "e",
        bottomMid: "f",
        bottomLeft: "g",
        bottomRight: "h",
        left: "i",
        right: "j",
        middle: "k",
        mid: "l",
        leftMid: "m",
        rightMid: "n",
        midMid: "o",
      })
      .from([
        ["+++ ++", "+++", "++++++++ +++ ++++"],
        ["++", "++++ ++++++ ++", "+++ +"],
        ["++++ +++++", "++ ++++", "+++ +++++++"],
      ])
      .border(true)
      .toString(),
    `
caaaaaaaaaaaabaaaaaaaaaaaaaaaabaaaaaaaaaaaaaaaaaaad
i +++ ++     k +++            k ++++++++ +++ ++++ j
mllllllllllllollllllllllllllllollllllllllllllllllln
i ++         k ++++ ++++++ ++ k +++ +             j
mllllllllllllollllllllllllllllollllllllllllllllllln
i ++++ +++++ k ++ ++++        k +++ +++++++       j
geeeeeeeeeeeefeeeeeeeeeeeeeeeefeeeeeeeeeeeeeeeeeeeh`.slice(1),
  );
  // reset default border chars
  Table.chars(border);
});

Deno.test("custom table chars", () => {
  assertEquals(
    Table
      .from([
        ["+++ ++", "+++", "++++++++ +++ ++++"],
        ["++", "++++ ++++++ ++", "+++ +"],
        ["++++ +++++", "++ ++++", "+++ +++++++"],
      ])
      .chars({
        top: "a",
        topMid: "b",
        topLeft: "c",
        topRight: "d",
        bottom: "e",
        bottomMid: "f",
        bottomLeft: "g",
        bottomRight: "h",
        left: "i",
        right: "j",
        middle: "k",
        mid: "l",
        leftMid: "m",
        rightMid: "n",
        midMid: "o",
      })
      .border()
      .toString(),
    `
caaaaaaaaaaaabaaaaaaaaaaaaaaaabaaaaaaaaaaaaaaaaaaad
i +++ ++     k +++            k ++++++++ +++ ++++ j
mllllllllllllollllllllllllllllollllllllllllllllllln
i ++         k ++++ ++++++ ++ k +++ +             j
mllllllllllllollllllllllllllllollllllllllllllllllln
i ++++ +++++ k ++ ++++        k +++ +++++++       j
geeeeeeeeeeeefeeeeeeeeeeeeeeeefeeeeeeeeeeeeeeeeeeeh`.slice(1),
  );
  // reset default border chars
  Table.chars(border);
});
