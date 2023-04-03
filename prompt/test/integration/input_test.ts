import { Input } from "../../input.ts";
import { assertPromptSnapshot } from "../../testing.ts";

await assertPromptSnapshot({
  meta: import.meta,
  osSuffix: ["windows"],
  tests: {
    "should enter som text": ["foo bar", "\n"],
  },
  async fn() {
    await Input.prompt({
      message: "Whats your name?",
      default: "foo",
    });
  },
});
