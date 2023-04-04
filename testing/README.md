# Testing

Read the full documentation at https://cliffy.io/docs/testing.

### Snapshot testing

#### Test user input

```ts
import { assertSnapshotCall } from "./assert_snapshot_call.ts";
import { Input } from "../prompt/input.ts";

await assertSnapshotCall({
  name: "test name",
  meta: import.meta,
  steps: {
    "should enter som text": { stdin: ["foo bar", "\n"] },
  },
  async fn() {
    await Input.prompt({
      message: "Whats your name?",
      default: "foo",
    });
  },
});
```

#### Test commands

```ts
await assertSnapshotCall({
  name: "command integration",
  meta: import.meta,
  ignore: Deno.build.os === "windows",
  colors: true,
  steps: {
    "should delete file": {
      args: ["/foo/bar"],
    },
    "should delete directory recursive": {
      args: ["--recursive", "/foo/bar"],
    },
  },
  async fn() {
    await new Command()
      .version("1.0.0")
      .name("rm")
      .option("-r, --recursive", "Delete recursive.")
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
