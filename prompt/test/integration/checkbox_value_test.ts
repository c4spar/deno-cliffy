import { ansi } from "../../../ansi/ansi.ts";
import { snapshotTest } from "../../../testing/snapshot.ts";
import { Checkbox } from "../../checkbox.ts";

await snapshotTest({
  name: "[checkbox] should handle none primitive values",
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
      message: "Select an option",
      options: [
        { name: "date 1", value: new Date(1000) },
        { name: "date 2", value: new Date(2000) },
      ],
    });
  },
});
