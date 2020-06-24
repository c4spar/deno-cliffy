#!/usr/bin/env -S deno run --unstable

import { Toggle } from '../../packages/prompt/mod.ts';

const confirmed: boolean = await Toggle.prompt( `Can you confirm?` );

console.log( { confirmed } );
