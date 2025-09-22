#!/usr/bin/env -S deno run

import { parse } from "jsr:@cliffy/keycode@1.0.0-rc.8";

console.log(
  parse(
    "\x1b[A\x1b[B\x1b[C\x1b[D\x1b[E\x1b[F\x1b[H",
  ),
);
