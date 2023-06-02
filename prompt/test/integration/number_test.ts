import { ansi } from "../../../ansi/ansi.ts";
import { Number } from "../../number.ts";
import { snapshotTest } from "../../../testing/snapshot.ts";

await snapshotTest({
  name: "number prompt",
  meta: import.meta,
  osSuffix: ["windows"],
  steps: {
    "should enter a number": {
      stdin: ansi
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

await snapshotTest({
  name: "number prompt with float",
  meta: import.meta,
  osSuffix: ["windows"],
  steps: {
    "should enter a floating number": {
      stdin: ansi
        .text("19.")
        .cursorUp
        .cursorUp
        .cursorUp
        .cursorUp
        .text("\n")
        .toArray(),
    },
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
