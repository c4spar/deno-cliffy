import { ansi } from "../../../ansi/ansi.ts";
import { Select } from "../../select.ts";
import { snapshotTest } from "../../../testing/snapshot.ts";

await snapshotTest({
  name: "select prompt > should select an option",
  meta: import.meta,
  osSuffix: ["windows"],
  stdin: ansi
    .cursorDown
    .cursorDown
    .text("\n")
    .toArray(),
  async fn() {
    await Select.prompt({
      message: "Select an option",
      options: [
        { name: "Foo", value: "foo" },
        { name: "Bar", value: "bar" },
        { name: "Baz", value: "baz" },
      ],
    });
  },
});

await snapshotTest({
  name: "select prompt > should search an option",
  meta: import.meta,
  osSuffix: ["windows"],
  stdin: ansi
    .text("baz")
    .text("\n")
    .toArray(),
  async fn() {
    await Select.prompt({
      message: "Select an option",
      search: true,
      options: [
        { name: "Foo", value: "foo" },
        { name: "Bar", value: "bar" },
        { name: "Baz", value: "baz" },
      ],
    });
  },
});
