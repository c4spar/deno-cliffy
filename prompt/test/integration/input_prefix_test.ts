import { Input } from "../../input.ts";
import { assertPromptSnapshot } from "../../testing.ts";

await assertPromptSnapshot({
  name: "input prompt with prefix",
  meta: import.meta,
  osSuffix: ["windows"],
  steps: {
    "should change prefix": ["bar", "\n"],
  },
  async fn() {
    await Input.prompt({
      message: "Whats your name?",
      default: "foo",
      prefix: "PREFIX ",
    });
  },
});
