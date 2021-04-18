#!/usr/bin/env -S deno run --unstable

import { KeyCode } from "../../keycode/key_code.ts";

async function read(): Promise<void> {
  const buffer = new Uint8Array(8);

  Deno.setRaw(Deno.stdin.rid, true);
  const nread = await Deno.stdin.read(buffer);
  Deno.setRaw(Deno.stdin.rid, false);

  if (nread === null) {
    return;
  }

  const data = buffer.subarray(0, nread);

  const events: Array<KeyCode> = KeyCode.parse(data);

  for (const event of events) {
    if (event.ctrl && event.name === "c") {
      console.log("exit");
      return;
    }
    console.log(event);
  }

  await read();
}

console.log("Hit ctrl + c to exit.");

await read();
