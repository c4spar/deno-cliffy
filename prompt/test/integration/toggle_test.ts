import { Toggle } from "../../toggle.ts";
import { assertSnapshotCall } from "../../../testing/assert_snapshot_call.ts";

await assertSnapshotCall({
  name: "toggle prompt",
  meta: import.meta,
  osSuffix: ["windows"],
  steps: {
    "should toggle the prompt": { stdin: ["y", "n", "y", "\n"] },
  },
  async fn() {
    await Toggle.prompt({
      message: "Please confirm",
      hint: "some hint",
      default: false,
    });
  },
});
