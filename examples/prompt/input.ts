#!/usr/bin/env -S deno run --unstable --allow-net

import { Input } from "../../prompt/input.ts";

const username: string = await Input.prompt("What's your github user name?");

const response = await fetch(`https://api.github.com/users/${username}`, {
  headers: {
    "Accept": "application/vnd.github+json",
  },
});

const body = await response.text();

console.log(body);
