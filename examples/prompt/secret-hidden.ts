#!/usr/bin/env -S deno run --unstable

import { Secret } from "../../prompt/secret.ts";

const password: string = await Secret.prompt({
  message: "Enter your password",
  hidden: true,
});

console.log({ password });
