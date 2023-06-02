import { ansi } from "../../../ansi/ansi.ts";
import { Checkbox } from "../../checkbox.ts";
import { snapshotTest } from "../../../testing/snapshot.ts";

await snapshotTest({
  name: "checkbox prompt > should check an option",
  meta: import.meta,
  osSuffix: ["windows"],
  stdin: ansi
    .cursorDown
    .cursorDown
    .text(" ")
    .text("\n")
    .toArray(),
  async fn() {
    await Checkbox.prompt({
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
  name: "checkbox prompt > should search an option",
  meta: import.meta,
  osSuffix: ["windows"],
  stdin: ansi
    .text("baz")
    .text(" ")
    .text("\n")
    .toArray(),
  async fn() {
    await Checkbox.prompt({
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
