import { snapshotTest } from "../../testing/snapshot.ts";
import { Table } from "../table.ts";

const createTable = () =>
  new Table()
    .header(["Foo", "Bar", "Baz"])
    .body([
      ["foo bar baz", "baz", "beep boop"],
      ["baz", "beep boop", "foo bar baz"],
      ["beep boop", "foo bar baz", "baz"],
    ]);

await snapshotTest({
  name: "[table] should set border on columns",
  meta: import.meta,
  fn() {
    createTable()
      .columns([{
        border: true,
      }, {
        border: false,
      }, {
        border: true,
      }])
      .render();
  },
});

await snapshotTest({
  name: "[table] should set align on columns",
  meta: import.meta,
  fn() {
    createTable()
      .columns([{
        align: "left",
      }, {
        align: "center",
      }, {
        align: "right",
      }])
      .border()
      .render();
  },
});

await snapshotTest({
  name: "[table] should set width on columns",
  meta: import.meta,
  fn() {
    createTable()
      .columns([{
        maxWidth: 4,
      }, {
        minWidth: 20,
      }, {
        align: "right",
      }])
      .border()
      .render();
  },
});

await snapshotTest({
  name: "[table] should set padding on columns",
  meta: import.meta,
  fn() {
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
      .border()
      .render();
  },
});

await snapshotTest({
  name: "[table] should set column options with column method",
  meta: import.meta,
  fn() {
    const table = createTable();
    table.getColumn(0)?.padding(5);
    table.getColumn(0)?.align("left");

    table.getColumn(1)?.padding(5);
    table.getColumn(1)?.minWidth(20);
    table.getColumn(1)?.align("center");

    table.getColumn(2)?.padding(5);
    table.getColumn(2)?.align("right");

    table
      .border()
      .render();
  },
});
