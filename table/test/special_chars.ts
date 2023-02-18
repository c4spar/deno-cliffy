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
cell1              cell2 豆贝 
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
私は ふわっち クン cell2     cell3   
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
cell1  cell2 ｜ａ 
cell1  〜 〜 cell3`.slice(1),
  );
});
