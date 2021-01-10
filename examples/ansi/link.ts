#!/usr/bin/env -S deno run --allow-net=deno.land

import { link } from "../../ansi/ansi_escapes.ts";

console.log(link("Click me.", "https://deno.land"));
