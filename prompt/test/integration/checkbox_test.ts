import { ansi } from "../../../ansi/ansi.ts";
import { Checkbox } from "../../checkbox.ts";
import { assertSnapshotCall } from "../../../testing/assert_snapshot_call.ts";

await assertSnapshotCall({
  name: "checkbox prompt",
  meta: import.meta,
  osSuffix: ["windows"],
  steps: {
    "should check an option": ansi
      .cursorDown
      .cursorDown
      .text(" ")
      .text("\n")
      .toArray(),
  },
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
