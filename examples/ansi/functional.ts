#!/usr/bin/env -S deno run

import {
  cursorTo,
  eraseDown,
  image,
  link,
} from "jsr:@cliffy/ansi@1.0.0-rc.8/ansi-escapes";

const response = await fetch("https://deno.land/images/hashrock_simple.png");
const imageBuffer: ArrayBuffer = await response.arrayBuffer();

console.log(
  cursorTo(0, 0) +
    eraseDown() +
    image(imageBuffer, {
      width: 29,
      preserveAspectRatio: true,
    }) +
    "\n          " +
    link("Deno Land", "https://deno.land") +
    "\n",
);
