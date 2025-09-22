#!/usr/bin/env -S deno run

import { List } from "jsr:@cliffy/prompt@1.0.0-rc.8/list";

const keywords: string[] = await List.prompt("Enter some keywords");

console.log({ keywords });
