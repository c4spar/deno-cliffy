import { ansi } from "../../../ansi/ansi.ts";
import { snapshotTest } from "../../../testing/snapshot.ts";
import { Checkbox } from "../../checkbox.ts";

await snapshotTest({
  name: "checkbox prompt with groups and breadcrumb",
  meta: import.meta,
  osSuffix: ["windows"],
  steps: {
    "should render breadcrumb": {
      stdin: ansi
        .cursorForward
        .cursorForward
        .cursorForward
        .cursorForward
        .cursorForward
        .cursorForward
        .cursorForward
        .text(" ")
        .text("\n")
        .text("\n")
        .toArray(),
    },
  },
  async fn() {
    await Checkbox.prompt({
      message: "Select an option",
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
  },
});

await snapshotTest({
  name: "checkbox prompt with custom breadcrumb separator",
  meta: import.meta,
  osSuffix: ["windows"],
  steps: {
    "should render breadcrumb": {
      stdin: ansi
        .cursorForward
        .cursorForward
        .cursorForward
        .cursorForward
        .cursorForward
        .cursorForward
        .cursorForward
        .text(" ")
        .text("\n")
        .text("\n")
        .toArray(),
    },
  },
  async fn() {
    await Checkbox.prompt({
      message: "Select an option",
      breadcrumbSeparator: " # ",
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
  },
});
