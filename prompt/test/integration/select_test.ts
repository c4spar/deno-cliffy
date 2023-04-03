import { ansi } from "../../../ansi/ansi.ts";
import { Select } from "../../select.ts";
import { assertPromptSnapshot } from "../../testing.ts";

await assertPromptSnapshot({
  meta: import.meta,
  osSuffix: ["windows"],
  tests: {
    "should select an option": ansi
      .cursorDown
      .cursorDown
      .text("\n")
      .toArray(),
  },
  async fn() {
    await Select.prompt({
      message: "Select an option",
      options: [
        { name: "Foo", value: "foo" },
        { name: "Bar", value: "bar" },
        { name: "Baz", value: "baz" },
      ],
    });
  },
});