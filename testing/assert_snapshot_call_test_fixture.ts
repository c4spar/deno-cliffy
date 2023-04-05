import { assertSnapshotCall } from "./assert_snapshot_call.ts";

await assertSnapshotCall({
  name: "should create a simple snapshot",
  meta: import.meta,
  fn() {
    console.log("foo");
    console.error("bar");
  },
});

await assertSnapshotCall({
  name: "should change the snapshot path",
  meta: import.meta,
  path: "__snapshots__/assert_snapshot_call_test_fixture_2.ts.snap",
  fn() {
    console.log("foo");
    console.error("bar");
  },
});

await assertSnapshotCall({
  name: "should change the snapshot dir",
  meta: import.meta,
  dir: "__snapshots_test__",
  fn() {
    console.log("foo");
    console.error("bar");
  },
});

await assertSnapshotCall({
  name: "should set deno args",
  meta: import.meta,
  args: ["foo", "bar"],
  steps: {
    "step 1": { args: ["beep"] },
    "step 2": { args: ["boop"] },
  },
  fn() {
    console.log(Deno.args);
  },
});

await assertSnapshotCall({
  name: "should write to stdin",
  meta: import.meta,
  args: ["foo", "bar"],
  steps: {
    "step 1": { stdin: ["foo"] },
    "step 2": { stdin: ["bar"] },
  },
  async fn() {
    console.log("# stdin start");
    const decoder = new TextDecoder();
    let text = "";
    for await (const chunk of Deno.stdin.readable) {
      text += decoder.decode(chunk);
      if (text.length === 3) {
        break;
      }
    }
    console.log(text);
    console.log("# stdin end");
  },
});
