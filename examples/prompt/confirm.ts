#!/usr/bin/env -S deno run --unstable

import { Confirm } from '../../packages/prompt/mod.ts';

const confirmed: boolean = await Confirm.prompt( `Can you confirm?` );

console.log( { confirmed } );
