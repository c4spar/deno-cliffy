import { Toggle } from "../../toggle.ts";
import { assertPromptSnapshot } from "../../testing.ts";

await assertPromptSnapshot({
  meta: import.meta,
  osSuffix: ["windows"],
  tests: {
    "should toggle the prompt": ["y", "n", "y", "\n"],
  },
  async fn() {
    await Toggle.prompt({
      message: "Please confirm",
      hint: "some hint",
      default: false,
    });
  },
});
