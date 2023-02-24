import { ansi } from "../../../../ansi/ansi.ts";
import { Select } from "../../../select.ts";

export const tests = import.meta.main ? null : {
  "should render breadcrumb": ansi
    .text("\n")
    .text("\n")
    .text("\n")
    .text("\n")
    .text("\n")
    .text("\n")
    .text("\n")
    .toArray(),
};

if (import.meta.main) {
  await Select.prompt({
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
