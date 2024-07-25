#!/usr/bin/env -S deno run

import { List } from "@cliffy/prompt/list";

const keywords: string[] = await List.prompt("Enter some keywords");

console.log({ keywords });
