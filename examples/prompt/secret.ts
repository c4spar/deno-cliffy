#!/usr/bin/env -S deno run --unstable

import { Secret } from '../../packages/prompt/mod.ts';

const password: string = await Secret.prompt( `Enter your password` );

console.log( { password } );
