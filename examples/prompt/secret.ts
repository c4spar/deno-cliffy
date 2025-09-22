#!/usr/bin/env -S deno run

import { Secret } from "jsr:@cliffy/command@1.0.0-rc.8/secret";

const password: string = await Secret.prompt("Enter your password");

console.log({ password });
