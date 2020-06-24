#!/usr/bin/env -S deno run --unstable

import { Number } from '../../packages/prompt/mod.ts';

const age: number = await Number.prompt( `How old are you?` );

console.log( { age } );
