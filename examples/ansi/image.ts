#!/usr/bin/env -S deno run --allow-net=deno.land

import { image } from "@cliffy/ansi/ansi-escapes";

const response = await fetch("https://deno.land/images/hashrock_simple.png");
const imageBuffer: ArrayBuffer = await response.arrayBuffer();
console.log(image(imageBuffer));
