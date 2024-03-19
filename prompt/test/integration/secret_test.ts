import { Secret } from "../../secret.ts";
import { snapshotTest } from "@cliffy/testing";

await snapshotTest({
  name: "secret prompt",
  meta: import.meta,
  osSuffix: ["windows"],
  steps: {
    "should enter a secret": { stdin: ["123", "\n"] },
  },
  async fn() {
    await Secret.prompt({
      message: "enter your secret",
    });
  },
});
