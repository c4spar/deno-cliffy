#!/usr/bin/env -S deno run

import { Confirm, Input, Number, Secret } from "../prompt/mod.ts";

let hostname: string, port: number, password: string;

await main();

async function main() {
  hostname = await Input.prompt({
    message: "Enter the hostname",
    default: hostname ?? "localhost",
  });

  port = await Number.prompt({
    message: "Enter the port number",
    default: port ?? 80,
  });

  password = await Secret.prompt({
    message: "Enter your password",
    default: password,
  });

  console.log({ port, hostname, password });
  if (!await Confirm.prompt("Is everything correct?")) {
    await main();
  }
}
