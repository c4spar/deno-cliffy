#!/usr/bin/env -S deno run --allow-net=deno.land

import { link } from "@cliffy/ansi/ansi-escapes";

console.log(link("Click me.", "https://deno.land"));
