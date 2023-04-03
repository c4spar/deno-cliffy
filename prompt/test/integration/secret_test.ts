import { Secret } from "../../secret.ts";
import { assertPromptSnapshot } from "../../testing.ts";

await assertPromptSnapshot({
  meta: import.meta,
  osSuffix: ["windows"],
  tests: {
    "should enter a secret": ["123", "\n"],
  },
  async fn() {
    await Secret.prompt({
      message: "enter your secret",
    });
  },
});
