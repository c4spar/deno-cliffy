import { Input } from "../../input.ts";
import { assertSnapshotCall } from "../../../testing/assert_snapshot_call.ts";

await assertSnapshotCall({
  name: "input prompt without prefix",
  meta: import.meta,
  osSuffix: ["windows"],
  steps: {
    "should disable prefix": { stdin: ["bar", "\n"] },
  },
  async fn() {
    await Input.prompt({
      message: "Whats your name?",
      default: "foo",
      prefix: "",
    });
  },
});
