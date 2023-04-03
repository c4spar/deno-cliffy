import { ansi } from "../../../ansi/ansi.ts";
import { Checkbox } from "../../checkbox.ts";
import { assertPromptSnapshot } from "../../testing.ts";

await assertPromptSnapshot({
  meta: import.meta,
  osSuffix: ["windows"],
  tests: {
    "should check an option": ansi
      .cursorDown
      .cursorDown
      .text(" ")
      .text("\n")
      .toArray(),
  },
  async fn() {
    await Checkbox.prompt({
      message: "Select an option",
      options: [
        { name: "Foo", value: "foo" },
        { name: "Bar", value: "bar" },
        { name: "Baz", value: "baz" },
      ],
    });
  },
});
