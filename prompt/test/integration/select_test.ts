import { ansi } from "../../../ansi/ansi.ts";
import { format } from "../../../dev_deps.ts";
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

await snapshotTest({
  name: "select prompt > should format option value",
  meta: import.meta,
  osSuffix: ["windows"],
  stdin: ansi
    .cursorDown
    .text("\n")
    .toArray(),
  async fn() {
    await Select.prompt({
      message: "Message...",
      options: [
        { value: new Date(10000) },
        { value: new Date(20000) },
      ],
      format: (date) => format(date, "dd-MM-yyyy"),
    });
  },
});

await snapshotTest({
  name: "select prompt > should support separator option",
  meta: import.meta,
  osSuffix: ["windows"],
  stdin: ansi
    .cursorDown
    .text("\n")
    .toArray(),
  async fn() {
    await Select.prompt({
      message: "Message...",
      options: [
        { value: new Date(10000) },
        Select.separator("+++++"),
        { value: new Date(20000) },
      ],
      format: (date) => format(date, "dd-MM-yyyy"),
    });
  },
});
