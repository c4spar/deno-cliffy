import { Input } from "../../input.ts";
import { assertSnapshotCall } from "../../../testing/assert_snapshot_call.ts";

await assertSnapshotCall({
  name: "input prompt with suggestions",
  meta: import.meta,
  osSuffix: ["windows"],
  steps: {
    "should enable suggestions and list": { stdin: ["foo", "\n"] },
  },
  async fn() {
    await Input.prompt({
      message: "Whats your name?",
      default: "foo",
      suggestions: ["foo", "bar", "baz"],
      list: true,
    });
  },
});
