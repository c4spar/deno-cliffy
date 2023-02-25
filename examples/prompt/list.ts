#!/usr/bin/env -S deno run

import { List } from "../../prompt/list.ts";

const keywords: string[] = await List.prompt("Enter some keywords");

console.log({ keywords });
