# Testing

Read the full documentation at https://cliffy.io/docs/testing.

### Snapshot testing

```ts
import { assertSnapshotCall } from "./assert_snapshot_call.ts";
import { Input } from "../prompt/input.ts";

await assertSnapshotCall({
  name: "test name",
  meta: import.meta,
  steps: {
    "should enter som text": ["foo bar", "\n"],
  },
  async fn() {
    await Input.prompt({
      message: "Whats your name?",
      default: "foo",
    });
  },
});
```
