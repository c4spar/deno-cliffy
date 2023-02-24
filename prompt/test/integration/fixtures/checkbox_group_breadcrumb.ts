import { ansi } from "../../../../ansi/ansi.ts";
import { Checkbox } from "../../../checkbox.ts";

export const tests = import.meta.main ? null : {
  "should render breadcrumb": ansi
    .cursorForward
    .cursorForward
    .cursorForward
    .cursorForward
    .cursorForward
    .cursorForward
    .cursorForward
    .text(" ")
    .text("\n")
    .toArray(),
};

if (import.meta.main) {
  await Checkbox.prompt({
    message: "Select an option",
    breadcrumbSeparator: "#",
    maxBreadcrumbItems: 4,
    options: [{
      name: "Foo",
      options: [{
        name: "Bar",
        options: [{
          name: "Baz",
          options: [{
            name: "Beep",
            options: [{
              name: "Boop",
              options: [{
                name: "Fiz",
                options: [{
                  name: "Faz",
                  value: "123",
                }],
              }],
            }],
          }],
        }],
      }],
    }],
  });
}
