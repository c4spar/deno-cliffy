#!/usr/bin/env -S deno run

import { Secret } from "@cliffy/prompt/secret";

const password: string = await Secret.prompt("Enter your password");

console.log({ password });
