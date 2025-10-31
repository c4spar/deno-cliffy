#!/usr/bin/env -S deno run

import { parse } from "@cliffy/keycode";

console.log(
  parse(
    "\x1b[A\x1b[B\x1b[C\x1b[D\x1b[E\x1b[F\x1b[H",
  ),
);
