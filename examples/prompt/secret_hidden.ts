#!/usr/bin/env -S deno run

import { Secret } from "@cliffy/prompt/secret";

const password: string = await Secret.prompt({
  message: "Enter your password",
  hidden: true,
});

console.log({ password });
