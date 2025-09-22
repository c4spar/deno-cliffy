#!/usr/bin/env -S deno run --allow-net=deno.land

import { link } from "jsr:@cliffy/ansi@1.0.0-rc.8/ansi-escapes";

console.log(link("Click me.", "https://deno.land"));
