import { ansi } from "../../../../ansi/ansi.ts";
import { Checkbox } from "../../../checkbox.ts";

export const tests = import.meta.main ? null : {
  "should select a group option": ansi
    .cursorDown
    .cursorDown
    .text(" ")
    .text("\n")
    .toArray(),
  "should select a child option": ansi
    .cursorDown
    .cursorDown
    .cursorForward
    .cursorDown
    .text(" ")
    .text("\n")
    .toArray(),
};

if (import.meta.main) {
  await Checkbox.prompt({
    message: "Select an option",
    options: [
      { name: "Foo", value: "foo" },
      { name: "Bar", value: "bar" },
      {
        name: "Baz",
        options: [
          { name: "Beep", value: "beep" },
          { name: "Boop", value: "boop" },
        ],
      },
    ],
  });
}
