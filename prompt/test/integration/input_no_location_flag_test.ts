import { Input } from "../../input.ts";
import { assertPromptSnapshot } from "../../testing.ts";

await assertPromptSnapshot({
  name: "input prompt with no location flag",
  meta: import.meta,
  osSuffix: ["windows"],
  steps: {
    "should work without --location flag": ["yes", "\n"],
  },
  async fn() {
    await Input.prompt({
      message: "Works without --location?",
      default: "hope so",
    });
  },
});
