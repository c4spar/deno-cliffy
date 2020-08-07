#!/usr/bin/env -S deno run --unstable

import { List } from '../../prompt/list.ts';

const keywords: string[] = await List.prompt( `Enter some keywords` );

console.log( { keywords } );
