# Testing

Read the full documentation at https://cliffy.io/docs/testing.

## Snapshot testing

### assertSnapshotCall

```ts
import { assertSnapshotCall } from "./assert_snapshot_call.ts";

await assertSnapshotCall({
  name: "should log to stdout and atderr",
  meta: import.meta,
  async fn() {
    console.log("foo");
    console.error("bar");
  },
});
```

#### Test user input

```ts
import { assertSnapshotCall } from "./assert_snapshot_call.ts";
import { Checkbox } from "../prompt/checkbox.ts";
import { ansi } from "../ansi/ansi.ts";

await assertSnapshotCall({
  name: "should check an option",
  meta: import.meta,
  stdin: ansi
    .cursorDown
    .cursorDown
    .text(" ")
    .text("\n")
    .toArray(),
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
```

#### Test commands

```ts
import { assertSnapshotCall } from "./assert_snapshot_call.ts";
import { Command } from "../command/mod.ts";

await assertSnapshotCall({
  name: "command",
  meta: import.meta,
  ignore: Deno.build.os === "windows",
  colors: true,
  steps: {
    "should delete a file": {
      args: ["/foo/bar"],
    },
    "should delete a directory recursively": {
      args: ["--recursive", "/foo/bar"],
    },
  },
  async fn() {
    await new Command()
      .version("1.0.0")
      .name("rm")
      .option("-r, --recursive", "Delete recursive.")
      .arguments("<path>")
      .action(({ recursive }, path) => {
        if (recursive) {
          console.log("Delete recursive: %s", path);
        } else {
          console.log("Delete: %s", path);
        }
      })
      .parse();
  },
});
```
