#!/usr/bin/env -S deno run

import { KeyCode, parse } from "jsr:@cliffy/keycode@1.0.0-rc.8";

while (true) {
  const data = new Uint8Array(8);

  Deno.stdin.setRaw(true);
  const nread = await Deno.stdin.read(data);
  Deno.stdin.setRaw(false);

  if (nread === null) {
    break;
  }

  const keys: Array<KeyCode> = parse(data.subarray(0, nread));

  for (const key of keys) {
    if (key.ctrl && key.name === "c") {
      console.log("exit");
      Deno.exit();
    }
    console.log("Key pressed: %O", key);
  }
}
