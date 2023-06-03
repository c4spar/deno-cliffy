import { ansi } from "../../../ansi/ansi.ts";
import { snapshotTest } from "../../../testing/snapshot.ts";
import { Select } from "../../select.ts";

await snapshotTest({
  name: "select prompt with groups and breadcrumb",
  meta: import.meta,
  osSuffix: ["windows"],
  steps: {
    "should render breadcrumb": {
      stdin: ansi
        .text("\n")
        .text("\n")
        .text("\n")
        .text("\n")
        .text("\n")
        .text("\n")
        .text("\n")
        .toArray(),
    },
  },
  async fn() {
    await Select.prompt({
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
  name: "select prompt with custom breadcrumb separator",
  meta: import.meta,
  osSuffix: ["windows"],
  steps: {
    "should render breadcrumb": {
      stdin: ansi
        .text("\n")
        .text("\n")
        .text("\n")
        .text("\n")
        .text("\n")
        .text("\n")
        .text("\n")
        .toArray(),
    },
  },
  async fn() {
    await Select.prompt({
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
