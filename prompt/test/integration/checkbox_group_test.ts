import { ansi } from "../../../ansi/ansi.ts";
import { snapshotTest } from "../../../testing/snapshot.ts";
import { Checkbox } from "../../checkbox.ts";

await snapshotTest({
  name: "checkbox prompt with groups",
  meta: import.meta,
  osSuffix: ["windows"],
  steps: {
    "should select a group option": {
      stdin: ansi
        .cursorDown
        .cursorDown
        .text(" ")
        .text("\n")
        .text("\n")
        .toArray(),
    },
    "should select a child option": {
      stdin: ansi
        .cursorDown
        .cursorDown
        .cursorForward
        .cursorDown
        .text(" ")
        .text("\n")
        .text("\n")
        .toArray(),
    },
  },
  async fn() {
    await Checkbox.prompt({
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
