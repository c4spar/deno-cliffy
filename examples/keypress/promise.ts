#!/usr/bin/env -S deno run --unstable

import { keypress, KeyPressEvent } from "../../keypress/keypress.ts";

const event: KeyPressEvent | null = await keypress();

console.log(event);
