import { List } from "../../list.ts";
import { snapshotTest } from "@cliffy/testing";

await snapshotTest({
  name: "list prompt",
  meta: import.meta,
  osSuffix: ["windows"],
  steps: {
    "should enter some keywords": { stdin: ["foo,bar", "\n"] },
  },
  async fn() {
    await List.prompt({
      message: "Enter some keywords",
      default: ["foo", "far"],
      hint: "some hint...",
    });
  },
});
