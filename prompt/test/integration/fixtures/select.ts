import { ansi } from "../../../../ansi/ansi.ts";
import { Select } from "../../../select.ts";

export const tests = import.meta.main ? null : {
  "should select an option": ansi
    .cursorDown
    .cursorDown
    .text("\n")
    .toArray(),
};

if (import.meta.main) {
  await Select.prompt({
    message: "Select an option",
    options: [
      { name: "Foo", value: "foo" },
      { name: "Bar", value: "bar" },
      { name: "Baz", value: "baz" },
    ],
  });
}
