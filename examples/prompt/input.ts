#!/usr/bin/env -S deno run --unstable

import { Input } from "../../prompt/input.ts";

const name: string = await Input.prompt("What's your github user name?");

console.log({ name });
