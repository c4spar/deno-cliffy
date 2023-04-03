import { List } from "../../list.ts";
import { assertPromptSnapshot } from "../../testing.ts";

await assertPromptSnapshot({
  name: "list prompt",
  meta: import.meta,
  osSuffix: ["windows"],
  steps: {
    "should enter some keywords": ["foo,bar", "\n"],
  },
  async fn() {
    await List.prompt({
      message: "Enter some keywords",
      default: ["foo", "far"],
      hint: "some hint...",
    });
  },
});
