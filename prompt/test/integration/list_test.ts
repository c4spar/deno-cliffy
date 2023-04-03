import { List } from "../../list.ts";
import { assertPromptSnapshot } from "../../testing.ts";

await assertPromptSnapshot({
  meta: import.meta,
  osSuffix: ["windows"],
  tests: {
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
