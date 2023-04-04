import { Secret } from "../../secret.ts";
import { assertSnapshotCall } from "../../../testing/assert_snapshot_call.ts";

await assertSnapshotCall({
  name: "secret prompt",
  meta: import.meta,
  osSuffix: ["windows"],
  steps: {
    "should enter a secret": { stdin: ["123", "\n"] },
  },
  async fn() {
    await Secret.prompt({
      message: "enter your secret",
    });
  },
});
