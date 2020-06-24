#!/usr/bin/env -S deno run --unstable

import { List } from '../../packages/prompt/mod.ts';

const keywords: string[] = await List.prompt( `Enter some keywords` );

console.log( { keywords } );
