import { List } from "../../list.ts";
import { assertSnapshotCall } from "../../../testing/assert_snapshot_call.ts";

await assertSnapshotCall({
  name: "list prompt",
  meta: import.meta,
  osSuffix: ["windows"],
  steps: {
    "should enter some keywords": ["foo,bar", "\n"],
  },
  async fn() {
    await List.prompt({
      message: "Enter some keywords",
      default: ["foo", "far"],
      hint: "some hint...",
    });
  },
});
