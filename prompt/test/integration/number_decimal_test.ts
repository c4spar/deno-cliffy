import { ansi } from "../../../ansi/ansi.ts";
import { Number } from "../../number.ts";
import { assertPromptSnapshot } from "../../testing.ts";

await assertPromptSnapshot({
  name: "number prompt with float",
  meta: import.meta,
  osSuffix: ["windows"],
  steps: {
    "should enter a floating number": ansi
      .text("19.")
      .cursorUp
      .cursorUp
      .cursorUp
      .cursorUp
      .text("\n")
      .toArray(),
  },
  async fn() {
    await Number.prompt({
      message: "How old are you?",
      default: 7,
      max: 20,
      min: 18,
      float: true,
    });
  },
});
