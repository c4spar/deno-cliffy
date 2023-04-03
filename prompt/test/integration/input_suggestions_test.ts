import { Input } from "../../input.ts";
import { assertPromptSnapshot } from "../../testing.ts";

await assertPromptSnapshot({
  name: "input prompt with suggestions",
  meta: import.meta,
  osSuffix: ["windows"],
  steps: {
    "should enable suggestions and list": ["foo", "\n"],
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
