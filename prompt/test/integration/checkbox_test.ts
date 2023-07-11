import { ansi } from "../../../ansi/ansi.ts";
import { format } from "../../../dev_deps.ts";
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
    .text("\n")
    .text(" ")
    .text("\n")
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

await snapshotTest({
  name: "checkbox prompt > should format option value",
  meta: import.meta,
  osSuffix: ["windows"],
  stdin: ansi
    .cursorDown
    .text(" ")
    .text("\n")
    .text("\n")
    .toArray(),
  async fn() {
    await Checkbox.prompt({
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
  name: "checkbox prompt > should support separator option",
  meta: import.meta,
  osSuffix: ["windows"],
  stdin: ansi
    .cursorDown
    .text(" ")
    .text("\n")
    .text("\n")
    .toArray(),
  async fn() {
    await Checkbox.prompt({
      message: "Message...",
      options: [
        { value: new Date(10000) },
        Checkbox.separator("+++++"),
        { value: new Date(20000) },
      ],
      format: (date) => format(date, "dd-MM-yyyy"),
    });
  },
});

await snapshotTest({
  name: "checkbox prompt > should disable confirmSubmit",
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
      confirmSubmit: false,
      options: [
        { name: "Foo", value: "foo" },
        { name: "Bar", value: "bar" },
        { name: "Baz", value: "baz" },
      ],
    });
  },
});
