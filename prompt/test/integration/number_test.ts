import { ansi } from "../../../ansi/ansi.ts";
import { Number } from "../../number.ts";
import { assertSnapshotCall } from "../../../testing/assert_snapshot_call.ts";

await assertSnapshotCall({
  name: "number prompt",
  meta: import.meta,
  osSuffix: ["windows"],
  steps: {
    "should enter a number": ansi
      .text("19")
      .cursorUp
      .text("u")
      .cursorDown
      .cursorDown
      .cursorDown
      .cursorDown
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
    });
  },
});
