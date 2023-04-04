import { Confirm } from "../../confirm.ts";
import { assertSnapshotCall } from "../../../testing/assert_snapshot_call.ts";

await assertSnapshotCall({
  name: "confirm prompt",
  meta: import.meta,
  osSuffix: ["windows"],
  // args: ["--allow-env=ASSERT_SNAPSHOT_CALL_TEST_NAME"],
  steps: {
    "should confirm": ["y", "\n"],
    "should not confirm": ["n", "\n"],
    "should not confirm by default": ["", "\n"],
  },
  async fn() {
    await Confirm.prompt({
      message: "Please confirm",
      hint: "some hint",
      default: false,
    });
  },
});
