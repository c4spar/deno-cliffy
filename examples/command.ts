#!/usr/bin/env -S deno run --allow-net=localhost:8080,deno.land

import { Command } from "../command/mod.ts";
import { serve } from "https://deno.land/std@0.221.0/http/server.ts";

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
  .action(async ({ port, host }, domain = "deno.land") => {
    console.log(`Listening on http://${host}:${port}`);
    await serve((req: Request) => {
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
    }, { hostname: host, port });
  })
  .parse();
