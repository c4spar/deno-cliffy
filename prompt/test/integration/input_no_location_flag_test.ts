import { Input } from "../../input.ts";
import { assertSnapshotCall } from "../../../testing/assert_snapshot_call.ts";

await assertSnapshotCall({
  name: "input prompt with no location flag",
  meta: import.meta,
  osSuffix: ["windows"],
  steps: {
    "should work without --location flag": { stdin: ["yes", "\n"] },
  },
  async fn() {
    await Input.prompt({
      message: "Works without --location?",
      default: "hope so",
    });
  },
});
