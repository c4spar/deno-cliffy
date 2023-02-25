#!/usr/bin/env -S deno run

import { Secret } from "../../prompt/secret.ts";

const password: string = await Secret.prompt("Enter your password");

console.log({ password });
