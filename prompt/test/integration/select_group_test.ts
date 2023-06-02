import { ansi } from "../../../ansi/ansi.ts";
import { snapshotTest } from "../../../testing/snapshot.ts";
import { Select } from "../../select.ts";

await snapshotTest({
  name: "select prompt with groups",
  meta: import.meta,
  osSuffix: ["windows"],
  steps: {
    "should select a child option": {
      stdin: ansi
        .cursorDown
        .cursorDown
        .text("\n")
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
        {
          name: "Baz",
          options: [
            { name: "Beep", value: "beep" },
            { name: "Boop", value: "boop" },
          ],
        },
      ],
    });
  },
});
