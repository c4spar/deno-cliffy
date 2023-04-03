import { Input } from "../../input.ts";
import { assertPromptSnapshot } from "../../testing.ts";

await assertPromptSnapshot({
  name: "input prompt with writer set to stderr",
  meta: import.meta,
  osSuffix: ["windows"],
  steps: {
    "should enter some text": ["foo bar", "\n"],
  },
  async fn() {
    await Input.prompt({
      message: "Whats your name?",
      default: "foo",
      writer: Deno.stderr,
    });
  },
});
