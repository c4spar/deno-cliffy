#!/usr/bin/env -S deno run --allow-net=localhost:8080,deno.land

import { Command } from "@cliffy/command";

await new Command()
  .name("reverse-proxy")
  .description("A simple reverse proxy example cli.")
  .version("v1.0.0")
  .option("-p, --port <port:number>", "The port number for the local server.", {
    default: 8080,
  })
  .option("--host <hostname>", "The host name for the local server.", {
    default: "localhost",
  })
  .arguments("[domain]")
  .action(({ port, host }, domain = "deno.com") => {
    Deno.serve({
      hostname: host,
      port,
    }, (req: Request) => {
      const url = new URL(req.url);
      url.protocol = "https:";
      url.hostname = domain;
      url.port = "443";

      console.log("Proxy request to:", url.href);
      return fetch(url.href, {
        headers: req.headers,
        method: req.method,
        body: req.body,
      });
    });
  })
  .parse();
