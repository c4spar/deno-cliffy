import { Table } from "../table.ts";
import { assertEquals } from "../../dev_deps.ts";

Deno.test("table - special chars - chinese characters", () => {
  assertEquals(
    Table.from([
      ["名字为 豆贝 尔维了", "cell2", "cell3"],
      ["cell1", "cell2", "豆贝"],
      ["cell1", "豆 贝", "cell3"],
    ])
      .padding(1)
      .toString(),
    `
名字为 豆贝 尔维了 cell2 cell3
cell1              cell2 豆贝${" "}
cell1              豆 贝 cell3`.slice(1),
  );
});

Deno.test("table - special chars - japanese characters", () => {
  assertEquals(
    Table.from([
      ["私は ふわっち クン", "cell2", "cell3"],
      ["cell1", "cell2", "ふわふわ"],
      ["cell1", "ふわ ふわ", "cell3"],
    ])
      .padding(1)
      .toString(),
    `
私は ふわっち クン cell2     cell3${"   "}
cell1              cell2     ふわふわ
cell1              ふわ ふわ cell3   `.slice(1),
  );
});

Deno.test("table - special chars - full width & cjk sybmol characters", () => {
  assertEquals(
    Table.from([
      ["！、￥", "cell2", "cell3"],
      ["cell1", "cell2", "｜ａ"],
      ["cell1", "〜 〜", "cell3"],
    ])
      .padding(1)
      .toString(),
    `
！、￥ cell2 cell3
cell1  cell2 ｜ａ${" "}
cell1  〜 〜 cell3`.slice(1),
  );
});

Deno.test("table - special chars - Korean", () => {
  assertEquals(
    Table.from([["한"]])
      .border(true)
      .toString(),
    `
┌────┐
│ 한 │
└────┘`.slice(1),
  );
});

Deno.test("table - emoji (within BMP)", () => {
  assertEquals(
    Table.from([["✅"]])
      .border(true)
      .toString(),
    `
┌────┐
│ ✅ │
└────┘`.slice(1),
  );
});

Deno.test("table - emoji (outside BMP)", () => {
  assertEquals(
    Table.from([["💩"]])
      .border(true)
      .toString(),
    `
┌────┐
│ 💩 │
└────┘`.slice(1),
  );
});

Deno.test("table - zero-width non-joiner", () => {
  assertEquals(
    Table.from([["a\u200cb"]])
      .border(true)
      .toString(),
    `
┌────┐
│ a\u200cb │
└────┘`.slice(1),
  );
});

Deno.test("table - single-width char (outside BMP)", () => {
  assertEquals(
    Table.from([["𐌰𐌱"]])
      .border(true)
      .toString(),
    `
┌────┐
│ 𐌰𐌱 │
└────┘`.slice(1),
  );
});
