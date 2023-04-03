import { Input } from "../../input.ts";
import { assertPromptSnapshot } from "../../testing.ts";

await assertPromptSnapshot({
  name: "input prompt without prefix",
  meta: import.meta,
  osSuffix: ["windows"],
  steps: {
    "should disable prefix": ["bar", "\n"],
  },
  async fn() {
    await Input.prompt({
      message: "Whats your name?",
      default: "foo",
      prefix: "",
    });
  },
});
