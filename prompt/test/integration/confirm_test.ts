import { Confirm } from "../../confirm.ts";
import { assertPromptSnapshot } from "../../testing.ts";

await assertPromptSnapshot({
  meta: import.meta,
  osSuffix: ["windows"],
  tests: {
    "should confirm": ["y", "\n"],
    "should not confirm": ["n", "\n"],
    "should not confirm by default": ["", "\n"],
  },
  async fn() {
    await Confirm.prompt({
      message: "Please confirm",
      hint: "some hint",
      default: false,
    });
  },
});
