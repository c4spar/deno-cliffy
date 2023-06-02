import { Toggle } from "../../toggle.ts";
import { snapshotTest } from "../../../testing/snapshot.ts";

await snapshotTest({
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
