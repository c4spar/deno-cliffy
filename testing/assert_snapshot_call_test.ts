import { assert, assertSnapshot } from "../dev_deps.ts";
import { dirname, fromFileUrl } from "./deps.ts";

Deno.test({
  name: "should run snapshot tests",
  async fn(ctx) {
    const snapshotsDir = dirname(fromFileUrl(import.meta.url)) +
      "/__snapshots__";
    const snapshotPath =
      `${snapshotsDir}/assert_snapshot_call_test_fixture.ts.snap`;
    const snapshot2Path =
      `${snapshotsDir}/assert_snapshot_call_test_fixture_2.ts.snap`;

    const cmd = new Deno.Command("deno", {
      args: [
        "test",
        "--allow-run=deno",
        `--allow-read=${snapshotsDir}`,
        `--allow-write=${snapshotPath},${snapshot2Path}`,
        "testing/assert_snapshot_call_test_fixture.ts",
        "--",
        "--update",
      ],
    });

    const { success, stderr } = await cmd.output();

    assert(success, new TextDecoder().decode(stderr));

    const snapshotContent = await Deno.readTextFile(snapshotPath);
    const snapshot2Content = await Deno.readTextFile(snapshot2Path);

    await assertSnapshot(ctx, snapshotContent);
    await assertSnapshot(ctx, snapshot2Content);

    await Deno.remove(snapshotPath);
    await Deno.remove(snapshot2Path);
  },
});
