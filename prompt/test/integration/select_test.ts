import { ansi } from "../../../ansi/ansi.ts";
import { Select } from "../../select.ts";
import { assertSnapshotCall } from "../../../testing/assert_snapshot_call.ts";

await assertSnapshotCall({
  name: "select prompt",
  meta: import.meta,
  osSuffix: ["windows"],
  steps: {
    "should select an option": {
      stdin: ansi
        .cursorDown
        .cursorDown
        .text("\n")
        .toArray(),
    },
  },
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
