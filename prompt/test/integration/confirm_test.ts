import { Confirm } from "../../confirm.ts";
import { snapshotTest } from "../../../testing/snapshot.ts";

await snapshotTest({
  name: "confirm prompt",
  meta: import.meta,
  osSuffix: ["windows"],
  steps: {
    "should confirm": { stdin: ["y", "\n"] },
    "should not confirm": { stdin: ["n", "\n"] },
    "should not confirm by default": { stdin: ["", "\n"] },
  },
  async fn() {
    await Confirm.prompt({
      message: "Please confirm",
      hint: "some hint",
      default: false,
    });
  },
});
