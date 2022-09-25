import { assertEquals } from "../dev_deps.ts";
import { KeyPressEvent } from "./mod.ts";

Deno.test({
  name: "[keypress] should create KeyPressEvent",
  fn() {
    const event = new KeyPressEvent("keydown", {});
    assertEquals(event.type, "keydown");
  },
});
