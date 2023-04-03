import { Input } from "../../input.ts";
import { assertPromptSnapshot } from "../../testing.ts";

await assertPromptSnapshot({
  name: "input prompt",
  meta: import.meta,
  osSuffix: ["windows"],
  args: [],
  steps: {
    "should enter som text": ["foo bar", "\n"],
  },
  async fn() {
    await Input.prompt({
      message: "Whats your name?",
      default: "foo",
    });
  },
});

await assertPromptSnapshot({
  name: "second input prompt",
  meta: import.meta,
  osSuffix: ["windows"],
  args: [],
  steps: {
    "should enter som text": ["foo bar", "\n"],
  },
  async fn() {
    await Input.prompt({
      message: "Whats your name?",
      default: "foo",
    });
  },
});
