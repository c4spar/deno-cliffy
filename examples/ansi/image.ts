#!/usr/bin/env -S deno run --allow-net=deno.land

import { image } from "@cliffy/ansi/ansi-escapes";

const response = await fetch(
  "https://raw.githubusercontent.com/c4spar/deno-cliffy/main/logo.png",
);
const imageBuffer: ArrayBuffer = await response.arrayBuffer();
console.log(image(imageBuffer));
