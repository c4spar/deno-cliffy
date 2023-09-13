import { Table } from "../table.ts";
import { assertEquals } from "../../dev_deps.ts";

const tests: {
  description: string;
  content: string[];
  width: number;
  expect: string;
}[] = [
  {
    description: "wrapping of ANSI codes within cell",
    // colors.red("Hello, world!")
    content: ["\x1b[31mHello, world!\x1b[39m"],
    width: 6,
    expect: `
┌────────┐
│ \x1b[31mHello,\x1b[39m │
│ \x1b[31mworld!\x1b[39m │
└────────┘`.slice(1),
  },
  {
    description: "wrapping of chained ANSI codes within cell",
    // colors.cyan.bold.underline("Hello, world!")
    content: ["\x1b[4m\x1b[1m\x1b[36mHello, world!\x1b[39m\x1b[22m\x1b[24m"],
    width: 6,
    expect: `
┌────────┐
│ \x1b[4m\x1b[1m\x1b[36mHello,\x1b[39m\x1b[22m\x1b[24m │
│ \x1b[4m\x1b[1m\x1b[36mworld!\x1b[39m\x1b[22m\x1b[24m │
└────────┘`.slice(1),
  },
  {
    description: "wrapping of chained ANSI codes with intra-word line breaking",
    // colors.cyan("Wrapping over multiple lines")
    content: ["\x1b[36mWrapping over multiple lines\x1b[39m"],
    width: 6,
    expect: `
┌────────┐
│ \x1b[36mWrappi\x1b[39m │
│ \x1b[36mng\x1b[39m     │
│ \x1b[36mover\x1b[39m   │
│ \x1b[36mmultip\x1b[39m │
│ \x1b[36mle\x1b[39m     │
│ \x1b[36mlines\x1b[39m  │
└────────┘`.slice(1),
  },
  {
    description: "wrapping of nested ANSI color codes within cell",
    // colors.red(`Red ${colors.yellow("and yellow")} text`)
    content: [
      "\x1b[31mRed \x1b[33mand yellow\x1b[31m text\x1b[39m",
      "Cell 2",
    ],
    width: 12,
    expect: `
┌──────────────┬────────┐
│ \x1b[31mRed \x1b[33mand\x1b[39m      │ Cell 2 │
│ \x1b[33myellow\x1b[31m text\x1b[39m  │        │
└──────────────┴────────┘`.slice(1),
  },
  {
    description: "wrapping of nested mixed ANSI codes within cell",
    // colors.rgb24(`Colorful ${colors.underline("and underlined")} text`, 0xff8800)
    content: [
      "\x1b[38;2;255;136;0mColorful \x1b[4mand underlined\x1b[24m text\x1b[39m",
    ],
    width: 15,
    expect: `
┌─────────────────┐
│ \x1b[38;2;255;136;0mColorful \x1b[4mand\x1b[24m\x1b[39m    │
│ \x1b[38;2;255;136;0m\x1b[4munderlined\x1b[24m text\x1b[39m │
└─────────────────┘`.slice(1),
  },
];

for (const { description, content, width, expect } of tests) {
  const actual = Table.from([content])
    .border(true)
    .columns([{ maxWidth: width, minWidth: width }])
    .toString();

  // // Uncomment for visual checking of output
  // console.log(`actual\n${actual}`);
  // console.log(`expect\n${expect}`);
  // console.log(JSON.stringify({ actual, expect }, null, '\t'));

  Deno.test(`table - ${description}`, () => {
    assertEquals(actual, expect);
  });
}
