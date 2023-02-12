import { ansi } from "../../../../ansi/ansi.ts";
import { Checkbox } from "../../../checkbox.ts";

export const tests = import.meta.main ? null : {
  "should check an option": ansi
    .cursorDown
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
      { name: "Baz", value: "baz" },
    ],
  });
}
