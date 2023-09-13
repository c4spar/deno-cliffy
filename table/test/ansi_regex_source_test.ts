import { ansiRegexSource } from "../_utils.ts";
import { assertEquals } from "../../dev_deps.ts";

Deno.test(`table - ansiRegexSource`, () => {
  const DIGITS = String.raw`\d+`;
  // All open and close ANSI codes taken from calls to `code(...)` in
  // https://deno.land/std@0.196.0/fmt/colors.ts
  const ansiCodes = [
    { open: [0], close: 0 },
    { open: [1], close: 22 },
    { open: [2], close: 22 },
    { open: [3], close: 23 },
    { open: [4], close: 24 },
    { open: [7], close: 27 },
    { open: [8], close: 28 },
    { open: [9], close: 29 },
    { open: [30], close: 39 },
    { open: [31], close: 39 },
    { open: [32], close: 39 },
    { open: [33], close: 39 },
    { open: [34], close: 39 },
    { open: [35], close: 39 },
    { open: [36], close: 39 },
    { open: [37], close: 39 },
    { open: [90], close: 39 },
    { open: [91], close: 39 },
    { open: [92], close: 39 },
    { open: [93], close: 39 },
    { open: [94], close: 39 },
    { open: [95], close: 39 },
    { open: [96], close: 39 },
    { open: [97], close: 39 },
    { open: [40], close: 49 },
    { open: [41], close: 49 },
    { open: [42], close: 49 },
    { open: [43], close: 49 },
    { open: [44], close: 49 },
    { open: [45], close: 49 },
    { open: [46], close: 49 },
    { open: [47], close: 49 },
    { open: [100], close: 49 },
    { open: [101], close: 49 },
    { open: [102], close: 49 },
    { open: [103], close: 49 },
    { open: [104], close: 49 },
    { open: [105], close: 49 },
    { open: [106], close: 49 },
    { open: [107], close: 49 },
    { open: [38, 5, DIGITS], close: 39 },
    { open: [48, 5, DIGITS], close: 49 },
    { open: [38, 2, DIGITS, DIGITS, DIGITS], close: 39 },
    { open: [48, 2, DIGITS, DIGITS, DIGITS], close: 49 },
  ];

  const expect = String.raw`\x1b\[(?:${
    [...new Set(ansiCodes.map(({ close }) => close))]
      .map((kind) => {
        const opens = ansiCodes
          .filter(({ close }) => close === kind)
          .map(({ open }) => open.join(";"));

        return String.raw`(?<_${kind}>${
          [...new Set([String(kind), ...opens])].sort((a, b) =>
            a.localeCompare(b, "en-US", { numeric: true })
          ).join("|")
        })`;
      })
      .join("|")
  })m`;

  assertEquals(ansiRegexSource, expect);
});
