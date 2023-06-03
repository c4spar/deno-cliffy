import { assertEquals } from "../../dev_deps.ts";
import { consumeWords } from "../consume_words.ts";

const str =
  "│cell1│cell2 cell2 cell2 cell2 cell2 cell2 cell2 cell2 cell2 cell2│cell3│";

Deno.test("consume words 01", () => {
  assertEquals(consumeWords(str.length, str), str);
});

Deno.test("consume words 02", () => {
  assertEquals(
    consumeWords(str.length - 1, str),
    "│cell1│cell2 cell2 cell2 cell2 cell2 cell2 cell2 cell2 cell2",
  );
});

Deno.test("consume words 03", () => {
  assertEquals(consumeWords(5, str), "│cell1│cell2");
});

Deno.test("consume words 04", () => {
  assertEquals(consumeWords(12, str), "│cell1│cell2");
});

Deno.test("consume words 05", () => {
  assertEquals(consumeWords(17, str), "│cell1│cell2");
});

Deno.test("consume words 06", () => {
  assertEquals(consumeWords(18, str), "│cell1│cell2 cell2");
});

Deno.test("consume words 07", () => {
  assertEquals(consumeWords(19, str), "│cell1│cell2 cell2");
});

Deno.test("consume words 08", () => {
  assertEquals(consumeWords(19, `  ${str}  `), "  │cell1│cell2");
});

Deno.test("consume words 09", () => {
  assertEquals(consumeWords(20, `  ${str}  `), "  │cell1│cell2 cell2");
});

Deno.test("consume words 10", () => {
  assertEquals(consumeWords(21, `  ${str}  `), "  │cell1│cell2 cell2");
});

Deno.test("consume words 11", () => {
  assertEquals(consumeWords(22, `  ${str}  `), "  │cell1│cell2 cell2");
});

const multilineStr = `
 ┌─────┬───────────────────────────────────────────────────────────┬─────┐
 │cell1│cell2 cell2 cell2 cell2 cell2 cell2 cell2 cell2 cell2 cell2│cell3│
 ├─────┼───────────────────────────────────────────────────────────┼─────┤
 │cell1│cell2                                                      │cell3│
 ├─────┼───────────────────────────────────────────────────────────┼─────┤
 │cell1│cell2                                                      │cell3│
 └─────┴───────────────────────────────────────────────────────────┴─────┘`;

Deno.test("consume words 12", () => {
  assertEquals(
    consumeWords(74, multilineStr.slice(1)),
    " ┌─────┬───────────────────────────────────────────────────────────┬─────┐",
  );
});
