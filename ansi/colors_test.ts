import { assertEquals, bold, red } from "../dev_deps.ts";
import { underline } from "../prompt/deps.ts";
import { colors } from "./colors.ts";

Deno.test({
  name: "test colors",
  fn() {
    assertEquals(
      colors.red.underline.bold("test"),
      red(underline(bold("test"))),
    );
  },
});
